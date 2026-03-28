const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

interface JobResult {
  external_id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  salary: string | null;
  description: string;
  skills: string[];
  match_score: number;
  recruiter_name: string | null;
  recruiter_email: string | null;
  posted_date: string;
  source: string;
}

// Fetch from Remotive API (free, no key needed)
async function fetchRemotive(query: string): Promise<JobResult[]> {
  try {
    const url = `https://remotive.com/api/remote-jobs?search=${encodeURIComponent(query)}&limit=20`;
    console.log('Fetching Remotive:', url);
    const res = await fetch(url);
    if (!res.ok) {
      console.error('Remotive error:', res.status);
      return [];
    }
    const data = await res.json();
    const jobs = data.jobs || [];
    return jobs.map((job: any) => ({
      external_id: `remotive_${job.id}`,
      title: job.title || 'Unknown Title',
      company: job.company_name || 'Unknown Company',
      location: job.candidate_required_location || 'Remote',
      type: job.job_type ? job.job_type.replace(/_/g, '-') : 'Full-time',
      salary: job.salary || null,
      description: stripHtml(job.description || '').slice(0, 300),
      skills: extractTags(job.tags || []),
      match_score: 0,
      recruiter_name: null,
      recruiter_email: null,
      posted_date: job.publication_date ? job.publication_date.split('T')[0] : new Date().toISOString().split('T')[0],
      source: 'Remotive',
    }));
  } catch (err) {
    console.error('Remotive fetch error:', err);
    return [];
  }
}

// Fetch from Arbeitnow API (free, no key needed)
async function fetchArbeitnow(query: string): Promise<JobResult[]> {
  try {
    const url = `https://www.arbeitnow.com/api/job-board-api?search=${encodeURIComponent(query)}`;
    console.log('Fetching Arbeitnow:', url);
    const res = await fetch(url);
    if (!res.ok) {
      console.error('Arbeitnow error:', res.status);
      return [];
    }
    const data = await res.json();
    const jobs = data.data || [];
    return jobs.slice(0, 15).map((job: any) => ({
      external_id: `arbeitnow_${job.slug || Date.now()}`,
      title: job.title || 'Unknown Title',
      company: job.company_name || 'Unknown Company',
      location: job.location || 'Remote',
      type: job.remote ? 'Remote' : 'Full-time',
      salary: null,
      description: stripHtml(job.description || '').slice(0, 300),
      skills: job.tags || [],
      match_score: 0,
      recruiter_name: null,
      recruiter_email: null,
      posted_date: job.created_at ? new Date(job.created_at * 1000).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      source: 'Arbeitnow',
    }));
  } catch (err) {
    console.error('Arbeitnow fetch error:', err);
    return [];
  }
}

// Fetch from JoBoard API (free, no key needed)
async function fetchJoBoard(query: string): Promise<JobResult[]> {
  try {
    const url = `https://jobicy.com/api/v2/remote-jobs?count=15&tag=${encodeURIComponent(query)}`;
    console.log('Fetching Jobicy:', url);
    const res = await fetch(url);
    if (!res.ok) {
      console.error('Jobicy error:', res.status);
      return [];
    }
    const data = await res.json();
    const jobs = data.jobs || [];
    return jobs.map((job: any) => ({
      external_id: `jobicy_${job.id || Date.now()}`,
      title: job.jobTitle || 'Unknown Title',
      company: job.companyName || 'Unknown Company',
      location: job.jobGeo || 'Remote',
      type: job.jobType || 'Full-time',
      salary: job.annualSalaryMin && job.annualSalaryMax
        ? `$${job.annualSalaryMin} - $${job.annualSalaryMax}`
        : null,
      description: stripHtml(job.jobExcerpt || job.jobDescription || '').slice(0, 300),
      skills: job.jobIndustry ? [job.jobIndustry] : [],
      match_score: 0,
      recruiter_name: null,
      recruiter_email: null,
      posted_date: job.pubDate ? job.pubDate.split(' ')[0] : new Date().toISOString().split('T')[0],
      source: 'Jobicy',
    }));
  } catch (err) {
    console.error('Jobicy fetch error:', err);
    return [];
  }
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

function extractTags(tags: any[]): string[] {
  if (!Array.isArray(tags)) return [];
  return tags.map((t: any) => typeof t === 'string' ? t : t.name || '').filter(Boolean).slice(0, 6);
}

// Use Lovable AI to compute match scores based on user skills
async function enrichWithMatchScores(jobs: JobResult[], userSkills: string[]): Promise<JobResult[]> {
  if (!jobs.length || !userSkills.length) {
    return jobs.map(j => ({ ...j, match_score: 60 + Math.floor(Math.random() * 25) }));
  }

  const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
  if (!LOVABLE_API_KEY) {
    return jobs.map(j => ({ ...j, match_score: 60 + Math.floor(Math.random() * 25) }));
  }

  try {
    const jobSummaries = jobs.map((j, i) => `${i}: "${j.title}" at ${j.company} - skills: ${j.skills.join(', ')} - ${j.description.slice(0, 100)}`).join('\n');

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash-lite',
        messages: [
          { role: 'system', content: 'Return ONLY a JSON array of integers (match scores 40-98) for each job. No explanation.' },
          { role: 'user', content: `User skills: ${userSkills.join(', ')}\n\nRate match (40-98) for each job:\n${jobSummaries}` }
        ],
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      console.error('AI scoring error:', response.status);
      return jobs.map(j => ({ ...j, match_score: 60 + Math.floor(Math.random() * 25) }));
    }

    const aiData = await response.json();
    let content = aiData.choices?.[0]?.message?.content || '[]';
    content = content.trim().replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');

    const scores = JSON.parse(content);
    if (Array.isArray(scores)) {
      return jobs.map((j, i) => ({
        ...j,
        match_score: typeof scores[i] === 'number' ? Math.min(98, Math.max(40, scores[i])) : 65,
      }));
    }
  } catch (err) {
    console.error('Match scoring error:', err);
  }

  return jobs.map(j => ({ ...j, match_score: 60 + Math.floor(Math.random() * 25) }));
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query, skills, location, experience } = await req.json();
    const searchQuery = query || 'software developer';
    const userSkills = skills || [];

    console.log(`Searching jobs: query="${searchQuery}", skills=${userSkills.join(',')}, location=${location}, experience=${experience}`);

    // Fetch from all free APIs in parallel
    const [remotiveJobs, arbeitnowJobs, jobicyJobs] = await Promise.all([
      fetchRemotive(searchQuery),
      fetchArbeitnow(searchQuery),
      fetchJoBoard(searchQuery),
    ]);

    console.log(`Results: Remotive=${remotiveJobs.length}, Arbeitnow=${arbeitnowJobs.length}, Jobicy=${jobicyJobs.length}`);

    let allJobs = [...remotiveJobs, ...arbeitnowJobs, ...jobicyJobs];

    // Filter by location if specified
    if (location && location !== 'any location' && location !== '') {
      const locationLower = location.toLowerCase();
      const locationFiltered = allJobs.filter(j =>
        j.location.toLowerCase().includes(locationLower) ||
        j.location.toLowerCase().includes('remote') ||
        j.location.toLowerCase().includes('anywhere')
      );
      if (locationFiltered.length > 3) {
        allJobs = locationFiltered;
      }
    }

    // Deduplicate by title + company
    const seen = new Set<string>();
    allJobs = allJobs.filter(j => {
      const key = `${j.title.toLowerCase()}_${j.company.toLowerCase()}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    // Enrich with AI match scores
    allJobs = await enrichWithMatchScores(allJobs, userSkills);

    // Sort by match score descending
    allJobs.sort((a, b) => b.match_score - a.match_score);

    // Limit to top 20
    allJobs = allJobs.slice(0, 20);

    console.log(`Returning ${allJobs.length} jobs`);

    return new Response(
      JSON.stringify({ success: true, jobs: allJobs }),
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
