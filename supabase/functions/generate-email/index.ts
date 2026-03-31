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
    const { job, userName, userSkills } = await req.json();

    if (!job || !userName) {
      return new Response(JSON.stringify({ error: 'Missing job or userName' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      // Fallback to template
      const email = `Dear ${job.recruiter_name || 'Hiring Manager'},\n\nI am writing to express my interest in the ${job.title} position at ${job.company}.\n\nWith expertise in ${(userSkills || []).slice(0, 3).join(', ')}, I believe I would be a strong fit.\n\nBest regards,\n${userName}`;
      return new Response(JSON.stringify({ email, subject: `Application for ${job.title} at ${job.company}` }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'system',
            content: `You are an expert professional email writer for job applications. Write concise, personalized, professional outreach emails. Keep it under 200 words. Be genuine, not generic. No fluff. Include:
1. A compelling opening that shows you researched the company
2. 2-3 specific skills that match the role
3. A confident but not arrogant closing
4. Return ONLY the email body text, no subject line, no formatting markers.`
          },
          {
            role: 'user',
            content: `Write a job application email:
- Applicant: ${userName}
- Position: ${job.title} at ${job.company}
- Location: ${job.location}
- Job Description: ${job.description || 'Not provided'}
- Required Skills: ${(job.skills || []).join(', ')}
- My Skills: ${(userSkills || []).join(', ')}
- Recruiter Name: ${job.recruiter_name || 'Hiring Manager'}
- Company: ${job.company}`
          }
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      console.error('AI email generation error:', response.status);
      const email = `Dear ${job.recruiter_name || 'Hiring Manager'},\n\nI am writing to express my interest in the ${job.title} position at ${job.company}.\n\nWith expertise in ${(userSkills || []).slice(0, 3).join(', ')}, I believe I would be a strong fit.\n\nBest regards,\n${userName}`;
      return new Response(JSON.stringify({ email, subject: `Application for ${job.title} at ${job.company}` }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const aiData = await response.json();
    const emailBody = aiData.choices?.[0]?.message?.content || '';
    const subject = `Application for ${job.title} at ${job.company}`;

    return new Response(JSON.stringify({ email: emailBody, subject }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Generate email error:', error);
    return new Response(JSON.stringify({ error: 'Failed to generate email' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
