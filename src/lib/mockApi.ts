import { Tables } from "@/integrations/supabase/types";

export type JobRow = Tables<"jobs">;

// Expanded mock job database — 20 jobs across various locations, roles, and skills
const mockJobs: Omit<JobRow, "id" | "created_at">[] = [
  {
    external_id: "m1",
    title: "Senior Frontend Developer",
    company: "TechNova Inc.",
    location: "San Francisco, CA",
    type: "Full-time",
    salary: "$140,000 - $180,000",
    description: "Build cutting-edge web applications using React, TypeScript, and modern tooling. Lead a team of 4 developers.",
    skills: ["React", "TypeScript", "Next.js", "Tailwind CSS", "GraphQL"],
    match_score: 95,
    recruiter_name: "Sarah Chen",
    recruiter_email: "sarah.chen@technova.com",
    posted_date: "2026-03-18",
    source: "LinkedIn",
  },
  {
    external_id: "m2",
    title: "Full Stack Engineer",
    company: "DataFlow Systems",
    location: "Remote",
    type: "Full-time",
    salary: "$120,000 - $160,000",
    description: "Work on distributed systems and real-time data pipelines. Python + React stack.",
    skills: ["Python", "React", "PostgreSQL", "Docker", "AWS"],
    match_score: 88,
    recruiter_name: "James Wright",
    recruiter_email: "j.wright@dataflow.io",
    posted_date: "2026-03-17",
    source: "LinkedIn",
  },
  {
    external_id: "m3",
    title: "AI/ML Engineer",
    company: "NeuralPath AI",
    location: "New York, NY",
    type: "Full-time",
    salary: "$150,000 - $200,000",
    description: "Design and deploy large language model applications. Fine-tune models for production use cases.",
    skills: ["Python", "PyTorch", "LLMs", "FastAPI", "Kubernetes"],
    match_score: 82,
    recruiter_name: "Priya Sharma",
    recruiter_email: "priya@neuralpath.ai",
    posted_date: "2026-03-16",
    source: "LinkedIn",
  },
  {
    external_id: "m4",
    title: "DevOps Engineer",
    company: "CloudScale",
    location: "Austin, TX",
    type: "Contract",
    salary: "$130,000 - $170,000",
    description: "Manage CI/CD pipelines and cloud infrastructure across AWS and GCP.",
    skills: ["AWS", "Terraform", "Docker", "Kubernetes", "Python"],
    match_score: 72,
    recruiter_name: "Mike Johnson",
    recruiter_email: "mike.j@cloudscale.com",
    posted_date: "2026-03-15",
    source: "Indeed",
  },
  {
    external_id: "m5",
    title: "Backend Developer",
    company: "FinEdge",
    location: "Chicago, IL",
    type: "Full-time",
    salary: "$110,000 - $145,000",
    description: "Build high-performance APIs for financial trading platform.",
    skills: ["Python", "FastAPI", "Redis", "PostgreSQL", "Microservices"],
    match_score: 78,
    recruiter_name: "Lisa Park",
    recruiter_email: "lisa.park@finedge.com",
    posted_date: "2026-03-14",
    source: "LinkedIn",
  },
  {
    external_id: "m6",
    title: "React Native Developer",
    company: "AppVista",
    location: "Remote",
    type: "Full-time",
    salary: "$100,000 - $135,000",
    description: "Build cross-platform mobile apps for health-tech startup.",
    skills: ["React Native", "TypeScript", "Redux", "Firebase", "REST APIs"],
    match_score: 68,
    recruiter_name: "David Kim",
    recruiter_email: "david@appvista.co",
    posted_date: "2026-03-13",
    source: "AngelList",
  },
  {
    external_id: "m7",
    title: "Frontend Engineer",
    company: "Stripe",
    location: "San Francisco, CA",
    type: "Full-time",
    salary: "$160,000 - $210,000",
    description: "Build beautiful, performant UIs for payment infrastructure used by millions.",
    skills: ["React", "TypeScript", "CSS", "GraphQL", "Testing"],
    match_score: 91,
    recruiter_name: "Emily Torres",
    recruiter_email: "emily.t@stripe.com",
    posted_date: "2026-03-19",
    source: "LinkedIn",
  },
  {
    external_id: "m8",
    title: "Data Engineer",
    company: "Snowflake",
    location: "Remote",
    type: "Full-time",
    salary: "$135,000 - $175,000",
    description: "Design and maintain large-scale data pipelines and ETL processes.",
    skills: ["Python", "SQL", "Spark", "Airflow", "AWS"],
    match_score: 75,
    recruiter_name: "Alex Rivera",
    recruiter_email: "alex.r@snowflake.com",
    posted_date: "2026-03-18",
    source: "LinkedIn",
  },
  {
    external_id: "m9",
    title: "iOS Developer",
    company: "HealthSync",
    location: "New York, NY",
    type: "Full-time",
    salary: "$125,000 - $165,000",
    description: "Build native iOS applications for healthcare monitoring platform.",
    skills: ["Swift", "SwiftUI", "CoreData", "HealthKit", "REST APIs"],
    match_score: 60,
    recruiter_name: "Jennifer Liu",
    recruiter_email: "j.liu@healthsync.com",
    posted_date: "2026-03-17",
    source: "Indeed",
  },
  {
    external_id: "m10",
    title: "Cloud Architect",
    company: "AWS Solutions",
    location: "Seattle, WA",
    type: "Full-time",
    salary: "$170,000 - $220,000",
    description: "Design cloud architectures for enterprise clients migrating to AWS.",
    skills: ["AWS", "Terraform", "Kubernetes", "Python", "Networking"],
    match_score: 70,
    recruiter_name: "Robert Chen",
    recruiter_email: "r.chen@awssolutions.com",
    posted_date: "2026-03-16",
    source: "LinkedIn",
  },
  {
    external_id: "m11",
    title: "Machine Learning Engineer",
    company: "OpenMind Labs",
    location: "Remote",
    type: "Full-time",
    salary: "$145,000 - $190,000",
    description: "Build and deploy ML models for natural language understanding products.",
    skills: ["Python", "TensorFlow", "NLP", "Docker", "GCP"],
    match_score: 85,
    recruiter_name: "Sophia Martinez",
    recruiter_email: "sophia@openmindlabs.ai",
    posted_date: "2026-03-19",
    source: "LinkedIn",
  },
  {
    external_id: "m12",
    title: "React Developer",
    company: "DesignCraft",
    location: "Austin, TX",
    type: "Full-time",
    salary: "$105,000 - $140,000",
    description: "Build component libraries and design systems for SaaS products.",
    skills: ["React", "TypeScript", "Storybook", "Figma", "Tailwind CSS"],
    match_score: 87,
    recruiter_name: "Nathan Brooks",
    recruiter_email: "nathan@designcraft.io",
    posted_date: "2026-03-18",
    source: "AngelList",
  },
  {
    external_id: "m13",
    title: "Site Reliability Engineer",
    company: "Datadog",
    location: "New York, NY",
    type: "Full-time",
    salary: "$155,000 - $200,000",
    description: "Ensure reliability and scalability of monitoring infrastructure.",
    skills: ["Go", "Kubernetes", "Prometheus", "Terraform", "AWS"],
    match_score: 65,
    recruiter_name: "Chris Wang",
    recruiter_email: "c.wang@datadog.com",
    posted_date: "2026-03-15",
    source: "LinkedIn",
  },
  {
    external_id: "m14",
    title: "Python Developer",
    company: "AutomateIQ",
    location: "Chicago, IL",
    type: "Full-time",
    salary: "$95,000 - $130,000",
    description: "Build automation tools and workflow engines for enterprise clients.",
    skills: ["Python", "Django", "Celery", "PostgreSQL", "REST APIs"],
    match_score: 76,
    recruiter_name: "Amanda Foster",
    recruiter_email: "amanda@automateiq.com",
    posted_date: "2026-03-14",
    source: "Indeed",
  },
  {
    external_id: "m15",
    title: "Blockchain Developer",
    company: "Web3Labs",
    location: "Remote",
    type: "Contract",
    salary: "$140,000 - $185,000",
    description: "Build smart contracts and decentralized applications on Ethereum.",
    skills: ["Solidity", "Ethereum", "React", "Node.js", "Web3.js"],
    match_score: 55,
    recruiter_name: "Marcus Lee",
    recruiter_email: "marcus@web3labs.xyz",
    posted_date: "2026-03-13",
    source: "AngelList",
  },
  {
    external_id: "m16",
    title: "UI/UX Engineer",
    company: "Figma",
    location: "San Francisco, CA",
    type: "Full-time",
    salary: "$130,000 - $170,000",
    description: "Bridge design and engineering to build world-class collaborative tools.",
    skills: ["React", "TypeScript", "CSS", "Animation", "Accessibility"],
    match_score: 83,
    recruiter_name: "Olivia Grant",
    recruiter_email: "olivia@figma.com",
    posted_date: "2026-03-19",
    source: "LinkedIn",
  },
  {
    external_id: "m17",
    title: "Security Engineer",
    company: "CyberShield",
    location: "Austin, TX",
    type: "Full-time",
    salary: "$140,000 - $180,000",
    description: "Perform security audits, penetration testing, and build secure infrastructure.",
    skills: ["Python", "Networking", "AWS", "Penetration Testing", "SIEM"],
    match_score: 58,
    recruiter_name: "Daniel Park",
    recruiter_email: "d.park@cybershield.com",
    posted_date: "2026-03-16",
    source: "Indeed",
  },
  {
    external_id: "m18",
    title: "Node.js Backend Developer",
    company: "StreamIO",
    location: "Remote",
    type: "Full-time",
    salary: "$115,000 - $150,000",
    description: "Build real-time messaging and streaming APIs at scale.",
    skills: ["Node.js", "TypeScript", "MongoDB", "Redis", "WebSockets"],
    match_score: 79,
    recruiter_name: "Rachel Kim",
    recruiter_email: "rachel@streamio.dev",
    posted_date: "2026-03-17",
    source: "LinkedIn",
  },
  {
    external_id: "m19",
    title: "Product Engineer",
    company: "Linear",
    location: "Remote",
    type: "Full-time",
    salary: "$150,000 - $195,000",
    description: "Build the future of project management with a focus on speed and design.",
    skills: ["React", "TypeScript", "GraphQL", "PostgreSQL", "Electron"],
    match_score: 90,
    recruiter_name: "Kevin Zhao",
    recruiter_email: "kevin@linear.app",
    posted_date: "2026-03-19",
    source: "LinkedIn",
  },
  {
    external_id: "m20",
    title: "Junior Frontend Developer",
    company: "StartupHub",
    location: "Chicago, IL",
    type: "Full-time",
    salary: "$70,000 - $95,000",
    description: "Join a fast-paced startup building tools for creators. Great for entry-level developers.",
    skills: ["React", "JavaScript", "HTML", "CSS", "Git"],
    match_score: 65,
    recruiter_name: "Tina Nguyen",
    recruiter_email: "tina@startuphub.io",
    posted_date: "2026-03-18",
    source: "AngelList",
  },
];

/**
 * Smart job search that filters by query, location, skills, and experience.
 * Returns ALL matching jobs, sorted by match score.
 */
export const searchJobs = async (
  query: string,
  skills: string[],
  location?: string,
  experience?: string
): Promise<Omit<JobRow, "id" | "created_at">[]> => {
  await new Promise((r) => setTimeout(r, 1800));

  const q = query.toLowerCase().trim();
  const loc = (location || "").toLowerCase().trim();

  let results = mockJobs.filter((job) => {
    // Location filter — if specified, must match
    if (loc) {
      const jobLoc = job.location.toLowerCase();
      const locationMatch =
        loc === "remote"
          ? jobLoc.includes("remote")
          : jobLoc.includes(loc);
      if (!locationMatch) return false;
    }

    // Query filter — title or company matches
    const queryMatch = !q || job.title.toLowerCase().includes(q) || job.company.toLowerCase().includes(q);

    // Skills filter — at least one skill matches
    const skillMatch =
      skills.length === 0 ||
      skills.some((s) =>
        (job.skills || []).some((js) => js.toLowerCase().includes(s.toLowerCase()))
      );

    return queryMatch && skillMatch;
  });

  // Experience-based scoring adjustment
  if (experience) {
    results = results.map((job) => {
      let scoreBoost = 0;
      const title = job.title.toLowerCase();
      if (experience === "entry" && (title.includes("junior") || title.includes("entry"))) scoreBoost = 10;
      if (experience === "senior" && (title.includes("senior") || title.includes("lead") || title.includes("principal"))) scoreBoost = 10;
      if (experience === "mid" && !title.includes("junior") && !title.includes("senior") && !title.includes("lead")) scoreBoost = 8;
      return { ...job, match_score: Math.min(100, (job.match_score || 0) + scoreBoost) };
    });
  }

  // Boost score for more skill matches
  results = results.map((job) => {
    const matchCount = skills.filter((s) =>
      (job.skills || []).some((js) => js.toLowerCase().includes(s.toLowerCase()))
    ).length;
    const skillBoost = Math.min(matchCount * 5, 20);
    return { ...job, match_score: Math.min(100, (job.match_score || 0) + skillBoost) };
  });

  return results.sort((a, b) => (b.match_score || 0) - (a.match_score || 0));
};

export const generateEmail = async (
  job: Omit<JobRow, "id" | "created_at">,
  userName: string,
  userSkills: string[]
): Promise<string> => {
  await new Promise((r) => setTimeout(r, 1200));

  const relevantSkills = userSkills.filter((s) =>
    (job.skills || []).some((js) => js.toLowerCase().includes(s.toLowerCase()))
  );
  const displaySkills = relevantSkills.length > 0 ? relevantSkills : userSkills.slice(0, 3);

  return `Dear ${job.recruiter_name || "Hiring Manager"},

I hope this email finds you well. My name is ${userName}, and I am writing to express my strong interest in the ${job.title} position at ${job.company}.

With my background in ${displaySkills.join(", ")}, I believe I would be an excellent fit for this role. Your job description particularly resonated with me, especially the focus on ${(job.skills || []).slice(0, 2).join(" and ")}.

I have extensive experience building production-grade applications and working in collaborative team environments. I am particularly drawn to ${job.company}'s mission and would love the opportunity to contribute to your team's success.

I would welcome the chance to discuss how my skills and experience align with your needs. Please find my resume attached for your review.

Thank you for your time and consideration. I look forward to hearing from you.

Best regards,
${userName}`;
};
