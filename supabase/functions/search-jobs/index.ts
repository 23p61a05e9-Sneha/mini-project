const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query, skills, location, experience } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      return new Response(
        JSON.stringify({ success: false, error: 'LOVABLE_API_KEY not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const skillsList = (skills || []).join(', ') || 'general software development';
    const locationPref = location || 'any location';
    const experiencePref = experience || 'any level';
    const queryText = query || 'software developer';

    const prompt = `You are a job search API. Return EXACTLY a JSON array of 10-15 realistic job listings based on these search criteria:

Search query: "${queryText}"
Skills: ${skillsList}
Location preference: ${locationPref}
Experience level: ${experiencePref}

Each job object MUST have these exact fields:
- "external_id": unique string like "job_1", "job_2", etc.
- "title": realistic job title (e.g. "Senior Frontend Engineer", "ML Engineer")
- "company": real or realistic company name
- "location": specific city/state or "Remote" - must match the location preference "${locationPref}" for most results
- "type": "Full-time", "Part-time", or "Contract"
- "salary": realistic salary range as string (e.g. "$120,000 - $160,000")
- "description": 2-3 sentence realistic job description
- "skills": array of 4-6 relevant technical skills
- "match_score": integer 50-98 based on how well skills match (higher = better match to "${skillsList}")
- "recruiter_name": realistic full name
- "recruiter_email": realistic email at the company domain
- "posted_date": date in YYYY-MM-DD format within last 7 days from 2026-03-24
- "source": one of "LinkedIn", "Indeed", "Glassdoor", "AngelList", "Company Website"

IMPORTANT RULES:
1. Jobs MUST be relevant to the search query and skills provided
2. Match scores should reflect actual skill overlap - if a job needs React and user has React, score should be high
3. Location MUST match the preference for at least 80% of results
4. Include a mix of companies - some well-known, some startups
5. Salary ranges should be realistic for the role and location
6. Sort by match_score descending

Return ONLY the JSON array, no markdown, no explanation, no code blocks.`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: 'You are a job search API that returns only valid JSON arrays. Never include markdown formatting or code blocks.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('AI API error:', errText);
      return new Response(
        JSON.stringify({ success: false, error: `AI API error: ${response.status}` }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const aiData = await response.json();
    const content = aiData.choices?.[0]?.message?.content || '[]';

    // Clean any markdown formatting
    let cleaned = content.trim();
    if (cleaned.startsWith('```')) {
      cleaned = cleaned.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
    }

    let jobs: any[];
    try {
      jobs = JSON.parse(cleaned);
    } catch (parseErr) {
      console.error('Failed to parse AI response:', cleaned);
      return new Response(
        JSON.stringify({ success: false, error: 'Failed to parse job results' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!Array.isArray(jobs)) {
      jobs = [jobs];
    }

    // Ensure all jobs have required fields
    jobs = jobs.map((job: any, i: number) => ({
      external_id: job.external_id || `ai_job_${Date.now()}_${i}`,
      title: job.title || 'Software Developer',
      company: job.company || 'Unknown Company',
      location: job.location || locationPref,
      type: job.type || 'Full-time',
      salary: job.salary || null,
      description: job.description || '',
      skills: Array.isArray(job.skills) ? job.skills : [],
      match_score: typeof job.match_score === 'number' ? job.match_score : 70,
      recruiter_name: job.recruiter_name || null,
      recruiter_email: job.recruiter_email || null,
      posted_date: job.posted_date || '2026-03-24',
      source: job.source || 'AI Search',
    }));

    return new Response(
      JSON.stringify({ success: true, jobs }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Search error:', error);
    return new Response(
      JSON.stringify({ success: false, error: error instanceof Error ? error.message : 'Search failed' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
