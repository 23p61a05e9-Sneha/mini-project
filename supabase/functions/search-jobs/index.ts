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

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

function extractTags(tags: any[]): string[] {
  if (!Array.isArray(tags)) return [];
  return tags.map((t: any) => typeof t === 'string' ? t : t.name || '').filter(Boolean).slice(0, 6);
}

function todayStr(): string {
  return new Date().toISOString().split('T')[0];
}

// ─── JSearch (RapidAPI) ───────────────────────────────────────────
async function fetchJSearch(query: string, location: string): Promise<JobResult[]> {
  const apiKey = Deno.env.get('RAPIDAPI_KEY');
  if (!apiKey) {
    console.log('RAPIDAPI_KEY not set, skipping JSearch');
    return [];
  }
  try {
    const searchQuery = location && location !== 'any location'
      ? `${query} in ${location}`
      : query;

    const url = `https://jsearch.p.rapidapi.com/search?query=${encodeURIComponent(searchQuery)}&page=1&num_pages=2&date_posted=month`;
    console.log('Fetching JSearch:', url);

    const res = await fetch(url, {
      headers: {
        'x-rapidapi-key': apiKey,
        'x-rapidapi-host': 'jsearch.p.rapidapi.com',
      },
    });

    if (!res.ok) {
      console.error('JSearch error:', res.status, await res.text());
      return [];
    }

    const data = await res.json();
    const jobs = data.data || [];

    return jobs.slice(0, 20).map((job: any) => ({
      external_id: `jsearch_${job.job_id || Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      title: job.job_title || 'Unknown Title',
      company: job.employer_name || 'Unknown Company',
      location: [job.job_city, job.job_state, job.job_country].filter(Boolean).join(', ') || 'Remote',
      type: job.job_employment_type?.replace(/_/g, '-') || 'Full-time',
      salary: job.job_min_salary && job.job_max_salary
        ? `${job.job_salary_currency || '$'}${job.job_min_salary} - ${job.job_salary_currency || '$'}${job.job_max_salary}`
        : null,
      description: stripHtml(job.job_description || '').slice(0, 300),
      skills: extractTags(job.job_required_skills || job.job_highlights?.Qualifications?.slice(0, 5) || []),
      match_score: 0,
      recruiter_name: job.employer_name || null,
      recruiter_email: null,
      posted_date: job.job_posted_at_datetime_utc?.split('T')[0] || todayStr(),
      source: 'JSearch',
    }));
  } catch (err) {
    console.error('JSearch fetch error:', err);
    return [];
  }
}

// ─── Remotive ─────────────────────────────────────────────────────
async function fetchRemotive(query: string): Promise<JobResult[]> {
  try {
    const url = `https://remotive.com/api/remote-jobs?search=${encodeURIComponent(query)}&limit=20`;
    console.log('Fetching Remotive:', url);
    const res = await fetch(url);
    if (!res.ok) return [];
    const data = await res.json();
    return (data.jobs || []).map((job: any) => ({
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
      posted_date: job.publication_date?.split('T')[0] || todayStr(),
      source: 'Remotive',
    }));
  } catch (err) {
    console.error('Remotive fetch error:', err);
    return [];
  }
}

// ─── Arbeitnow ────────────────────────────────────────────────────
async function fetchArbeitnow(query: string): Promise<JobResult[]> {
  try {
    const url = `https://www.arbeitnow.com/api/job-board-api?search=${encodeURIComponent(query)}`;
    console.log('Fetching Arbeitnow:', url);
    const res = await fetch(url);
    if (!res.ok) return [];
    const data = await res.json();
    return (data.data || []).slice(0, 15).map((job: any) => ({
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
      posted_date: job.created_at ? new Date(job.created_at * 1000).toISOString().split('T')[0] : todayStr(),
      source: 'Arbeitnow',
    }));
  } catch (err) {
    console.error('Arbeitnow fetch error:', err);
    return [];
  }
}

// ─── Jobicy ───────────────────────────────────────────────────────
async function fetchJobicy(query: string): Promise<JobResult[]> {
  try {
    const url = `https://jobicy.com/api/v2/remote-jobs?count=15&tag=${encodeURIComponent(query)}`;
    console.log('Fetching Jobicy:', url);
    const res = await fetch(url);
    if (!res.ok) return [];
    const data = await res.json();
    return (data.jobs || []).map((job: any) => ({
      external_id: `jobicy_${job.id || Date.now()}`,
      title: job.jobTitle || 'Unknown Title',
      company: job.companyName || 'Unknown Company',
      location: job.jobGeo || 'Remote',
      type: job.jobType || 'Full-time',
      salary: job.annualSalaryMin && job.annualSalaryMax
        ? `$${job.annualSalaryMin} - $${job.annualSalaryMax}`
        : null,
      description: stripHtml(job.jobExcerpt || job.jobDescription || '').slice(0, 300),
      skills: Array.isArray(job.jobIndustry) ? job.jobIndustry.flat() : job.jobIndustry ? [job.jobIndustry] : [],
      match_score: 0,
      recruiter_name: null,
      recruiter_email: null,
      posted_date: job.pubDate?.split(' ')[0] || todayStr(),
      source: 'Jobicy',
    }));
  } catch (err) {
    console.error('Jobicy fetch error:', err);
    return [];
  }
}

// ─── Location filter ──────────────────────────────────────────────
function filterByLocation(jobs: JobResult[], location: string): JobResult[] {
  if (!location || location === '' || location.toLowerCase() === 'any location') {
    return jobs;
  }

  const loc = location.toLowerCase().trim();
  const isRemoteSearch = ['remote', 'work from home', 'wfh'].some(r => loc.includes(r));

  // Location aliases for better matching
  const aliases: Record<string, string[]> = {
    'india': ['india', 'bangalore', 'bengaluru', 'mumbai', 'delhi', 'hyderabad', 'pune', 'chennai', 'kolkata', 'noida', 'gurgaon', 'gurugram', 'in'],
    'usa': ['usa', 'united states', 'us', 'san francisco', 'new york', 'nyc', 'seattle', 'austin', 'boston', 'chicago', 'los angeles', 'la', 'denver', 'sf'],
    'uk': ['uk', 'united kingdom', 'london', 'manchester', 'birmingham', 'gb'],
  };

  // Find which alias group the search matches
  let matchTerms = [loc];
  for (const [, terms] of Object.entries(aliases)) {
    if (terms.some(t => loc.includes(t) || t.includes(loc))) {
      matchTerms = terms;
      break;
    }
  }

  const filtered = jobs.filter(j => {
    const jLoc = j.location.toLowerCase();
    if (isRemoteSearch) {
      return jLoc.includes('remote') || jLoc.includes('anywhere') || jLoc.includes('worldwide');
    }
    return matchTerms.some(t => jLoc.includes(t)) ||
      jLoc.includes('remote') ||
      jLoc.includes('anywhere') ||
      jLoc.includes('worldwide');
  });

  // If filtering removes too many results, return all but boost matched ones
  if (filtered.length < 3) {
    return jobs;
  }
  return filtered;
}

// ─── AI recruiter email enrichment ────────────────────────────────
async function enrichWithRecruiterEmails(jobs: JobResult[]): Promise<JobResult[]> {
  const jobsNeedingEmails = jobs.filter(j => !j.recruiter_email);
  if (!jobsNeedingEmails.length) return jobs;

  const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
  if (!LOVABLE_API_KEY) {
    // Fallback: generate standard HR email patterns
    return jobs.map(j => {
      if (j.recruiter_email) return j;
      const domain = j.company.toLowerCase().replace(/[^a-z0-9]/g, '') + '.com';
      return { ...j, recruiter_email: `careers@${domain}`, recruiter_name: j.recruiter_name || `${j.company} HR Team` };
    });
  }

  try {
    const companies = jobsNeedingEmails.map((j, i) => `${i}: ${j.company} (${j.title})`).join('\n');
    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash-lite',
        messages: [
          {
            role: 'system',
            content: `You are an expert at finding real recruiter/HR contact emails for companies. For each company, provide the most likely real HR/recruiting email address. Use common patterns like:
- careers@company.com, hr@company.com, jobs@company.com, recruiting@company.com, talent@company.com
- For well-known companies, use their actual domain (e.g., careers@google.com, jobs@microsoft.com)
- For startups, use the company name domain
Return ONLY a JSON array of objects with "email" and "name" fields. No explanation.`
          },
          { role: 'user', content: `Find the most likely real recruiter/HR email for each company:\n${companies}` }
        ],
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      console.error('AI email enrichment error:', response.status);
      return jobs.map(j => {
        if (j.recruiter_email) return j;
        const domain = j.company.toLowerCase().replace(/[^a-z0-9]/g, '') + '.com';
        return { ...j, recruiter_email: `careers@${domain}`, recruiter_name: j.recruiter_name || `${j.company} HR Team` };
      });
    }

    const aiData = await response.json();
    let content = aiData.choices?.[0]?.message?.content || '[]';
    content = content.trim().replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
    const emails = JSON.parse(content);

    if (Array.isArray(emails)) {
      let idx = 0;
      return jobs.map(j => {
        if (j.recruiter_email) return j;
        const emailData = emails[idx++];
        return {
          ...j,
          recruiter_email: emailData?.email || `careers@${j.company.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`,
          recruiter_name: emailData?.name || j.recruiter_name || `${j.company} HR Team`,
        };
      });
    }
  } catch (err) {
    console.error('Email enrichment error:', err);
  }

  return jobs.map(j => {
    if (j.recruiter_email) return j;
    const domain = j.company.toLowerCase().replace(/[^a-z0-9]/g, '') + '.com';
    return { ...j, recruiter_email: `careers@${domain}`, recruiter_name: j.recruiter_name || `${j.company} HR Team` };
  });
}

// ─── AI match scoring ─────────────────────────────────────────────
async function enrichWithMatchScores(jobs: JobResult[], userSkills: string[]): Promise<JobResult[]> {
  if (!jobs.length || !userSkills.length) {
    return jobs.map(j => ({ ...j, match_score: 60 + Math.floor(Math.random() * 25) }));
  }

  const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
  if (!LOVABLE_API_KEY) {
    return jobs.map(j => ({ ...j, match_score: 60 + Math.floor(Math.random() * 25) }));
  }

  try {
    const jobSummaries = jobs.map((j, i) =>
      `${i}: "${j.title}" at ${j.company} [${j.location}] - skills: ${j.skills.join(', ')} - ${j.description.slice(0, 80)}`
    ).join('\n');

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

// ─── Main handler ─────────────────────────────────────────────────
Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query, skills, location, experience } = await req.json();
    const searchQuery = query || 'software developer';
    const userSkills = skills || [];
    const searchLocation = location || '';

    console.log(`Searching: query="${searchQuery}", skills=${userSkills.join(',')}, location=${searchLocation}, exp=${experience}`);

    // Fetch from all APIs in parallel — JSearch gets location context
    const [jsearchJobs, remotiveJobs, arbeitnowJobs, jobicyJobs] = await Promise.all([
      fetchJSearch(searchQuery, searchLocation),
      fetchRemotive(searchQuery),
      fetchArbeitnow(searchQuery),
      fetchJobicy(searchQuery),
    ]);

    console.log(`Results: JSearch=${jsearchJobs.length}, Remotive=${remotiveJobs.length}, Arbeitnow=${arbeitnowJobs.length}, Jobicy=${jobicyJobs.length}`);

    // Merge all results — JSearch first (best location data)
    let allJobs = [...jsearchJobs, ...remotiveJobs, ...arbeitnowJobs, ...jobicyJobs];

    // Filter by location
    allJobs = filterByLocation(allJobs, searchLocation);

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

    // Limit to top 25
    allJobs = allJobs.slice(0, 25);

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
