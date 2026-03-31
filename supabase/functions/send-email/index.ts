import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify user auth
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const { to, subject, body, applicationId } = await req.json();

    if (!to || !subject || !body) {
      return new Response(JSON.stringify({ error: 'Missing to, subject, or body' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Get user's SMTP settings from profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('smtp_host, smtp_port, smtp_email, smtp_password, name')
      .eq('user_id', user.id)
      .single();

    if (profileError || !profile) {
      return new Response(JSON.stringify({ error: 'Profile not found. Please configure your settings.' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    if (!profile.smtp_email || !profile.smtp_password) {
      return new Response(JSON.stringify({ error: 'SMTP not configured. Go to Settings to add your Gmail credentials.' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const smtpHost = profile.smtp_host || 'smtp.gmail.com';
    const smtpPort = parseInt(profile.smtp_port || '587');
    const fromEmail = profile.smtp_email;
    const fromName = profile.name || 'Job Seeker';

    // Use Deno's native SMTP - send via raw SMTP socket
    // For Gmail, use the Gmail API approach via fetch
    console.log(`Sending email from ${fromEmail} to ${to}`);

    // Gmail SMTP via TLS connection
    const conn = await Deno.connectTls({
      hostname: smtpHost,
      port: 465, // Use SSL port
    });

    const encoder = new TextEncoder();
    const decoder = new TextDecoder();

    async function readResponse(): Promise<string> {
      const buf = new Uint8Array(4096);
      const n = await conn.read(buf);
      return n ? decoder.decode(buf.subarray(0, n)) : '';
    }

    async function sendCommand(cmd: string): Promise<string> {
      await conn.write(encoder.encode(cmd + '\r\n'));
      return await readResponse();
    }

    // SMTP handshake
    await readResponse(); // greeting
    await sendCommand(`EHLO localhost`);

    // AUTH LOGIN
    await sendCommand('AUTH LOGIN');
    await sendCommand(btoa(fromEmail));
    const authResult = await sendCommand(btoa(profile.smtp_password));

    if (!authResult.startsWith('235')) {
      conn.close();
      return new Response(JSON.stringify({ error: 'SMTP authentication failed. Check your email and app password in Settings.' }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Send email
    await sendCommand(`MAIL FROM:<${fromEmail}>`);
    await sendCommand(`RCPT TO:<${to}>`);
    await sendCommand('DATA');

    const emailContent = [
      `From: "${fromName}" <${fromEmail}>`,
      `To: ${to}`,
      `Subject: ${subject}`,
      `MIME-Version: 1.0`,
      `Content-Type: text/plain; charset=UTF-8`,
      '',
      body,
      '.',
    ].join('\r\n');

    const sendResult = await sendCommand(emailContent);
    await sendCommand('QUIT');
    conn.close();

    const sent = sendResult.includes('250') || sendResult.includes('OK');

    if (sent && applicationId) {
      // Update application status
      await supabase
        .from('applications')
        .update({ email_sent: true, status: 'emailed' })
        .eq('id', applicationId);
    }

    if (sent) {
      return new Response(JSON.stringify({ success: true, message: 'Email sent successfully' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    } else {
      return new Response(JSON.stringify({ error: 'Failed to send email. Check your SMTP settings.' }), {
        status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
  } catch (error) {
    console.error('Send email error:', error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : 'Failed to send email' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
