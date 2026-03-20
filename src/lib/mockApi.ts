import { Job } from "@/context/AppContext";

// Mock job data
const mockJobs: Job[] = [
  {
    id: "1",
    title: "Senior Frontend Developer",
    company: "TechNova Inc.",
    location: "San Francisco, CA",
    type: "Full-time",
    salary: "$140,000 - $180,000",
    description: "Build cutting-edge web applications using React, TypeScript, and modern tooling. Lead a team of 4 developers.",
    skills: ["React", "TypeScript", "Next.js", "Tailwind CSS", "GraphQL"],
    matchScore: 95,
    recruiterName: "Sarah Chen",
    recruiterEmail: "sarah.chen@technova.com",
    postedDate: "2026-03-18",
    source: "LinkedIn",
  },
  {
    id: "2",
    title: "Full Stack Engineer",
    company: "DataFlow Systems",
    location: "Remote",
    type: "Full-time",
    salary: "$120,000 - $160,000",
    description: "Work on distributed systems and real-time data pipelines. Python + React stack.",
    skills: ["Python", "React", "PostgreSQL", "Docker", "AWS"],
    matchScore: 88,
    recruiterName: "James Wright",
    recruiterEmail: "j.wright@dataflow.io",
    postedDate: "2026-03-17",
    source: "LinkedIn",
  },
  {
    id: "3",
    title: "AI/ML Engineer",
    company: "NeuralPath AI",
    location: "New York, NY",
    type: "Full-time",
    salary: "$150,000 - $200,000",
    description: "Design and deploy large language model applications. Fine-tune models for production use cases.",
    skills: ["Python", "PyTorch", "LLMs", "FastAPI", "Kubernetes"],
    matchScore: 82,
    recruiterName: "Priya Sharma",
    recruiterEmail: "priya@neuralpath.ai",
    postedDate: "2026-03-16",
    source: "LinkedIn",
  },
  {
    id: "4",
    title: "DevOps Engineer",
    company: "CloudScale",
    location: "Austin, TX",
    type: "Contract",
    salary: "$130,000 - $170,000",
    description: "Manage CI/CD pipelines and cloud infrastructure across AWS and GCP.",
    skills: ["AWS", "Terraform", "Docker", "Kubernetes", "Python"],
    matchScore: 72,
    recruiterName: "Mike Johnson",
    recruiterEmail: "mike.j@cloudscale.com",
    postedDate: "2026-03-15",
    source: "Indeed",
  },
  {
    id: "5",
    title: "Backend Developer",
    company: "FinEdge",
    location: "Chicago, IL",
    type: "Full-time",
    salary: "$110,000 - $145,000",
    description: "Build high-performance APIs for financial trading platform.",
    skills: ["Python", "FastAPI", "Redis", "PostgreSQL", "Microservices"],
    matchScore: 78,
    recruiterName: "Lisa Park",
    recruiterEmail: "lisa.park@finedge.com",
    postedDate: "2026-03-14",
    source: "LinkedIn",
  },
  {
    id: "6",
    title: "React Native Developer",
    company: "AppVista",
    location: "Remote",
    type: "Full-time",
    salary: "$100,000 - $135,000",
    description: "Build cross-platform mobile apps for health-tech startup.",
    skills: ["React Native", "TypeScript", "Redux", "Firebase", "REST APIs"],
    matchScore: 68,
    recruiterName: "David Kim",
    recruiterEmail: "david@appvista.co",
    postedDate: "2026-03-13",
    source: "AngelList",
  },
];

export const searchJobs = async (query: string, skills: string[]): Promise<Job[]> => {
  // Simulate API delay
  await new Promise((r) => setTimeout(r, 2000));
  
  const q = query.toLowerCase();
  const filtered = mockJobs.filter((job) => {
    const titleMatch = job.title.toLowerCase().includes(q);
    const companyMatch = job.company.toLowerCase().includes(q);
    const skillMatch = skills.some((s) =>
      job.skills.some((js) => js.toLowerCase().includes(s.toLowerCase()))
    );
    return titleMatch || companyMatch || skillMatch || !q;
  });

  return filtered.sort((a, b) => b.matchScore - a.matchScore);
};

export const generateEmail = async (job: Job, userName: string, userSkills: string[]): Promise<string> => {
  await new Promise((r) => setTimeout(r, 1500));

  return `Dear ${job.recruiterName},

I hope this email finds you well. My name is ${userName}, and I am writing to express my strong interest in the ${job.title} position at ${job.company}.

With my background in ${userSkills.slice(0, 3).join(", ")}, I believe I would be an excellent fit for this role. Your job description particularly resonated with me, especially the focus on ${job.skills.slice(0, 2).join(" and ")}.

I have extensive experience building production-grade applications and working in collaborative team environments. I am particularly drawn to ${job.company}'s mission and would love the opportunity to contribute to your team's success.

I would welcome the chance to discuss how my skills and experience align with your needs. Please find my resume attached for your review.

Thank you for your time and consideration. I look forward to hearing from you.

Best regards,
${userName}`;
};
