export type CourseType = "self" | "live";

export type CourseCategory =
  | "AI for Business"
  | "AI for Program Mgmt"
  | "AI for Career Services"
  | "AI for IT"
  | "AI for Finance Administration"
  | "AI for Facilities Management"
  | "AI for Admin Support"
  | "AI For Teaching & Research";

export type Course = {
  id: string;
  title: string;
  type: CourseType;
  category?: CourseCategory;
  description: string;
  progress?: number; // 0-100 for self-paced
  lastAccess?: string; // ISO
  instructor?: string;
  nextSession?: string; // ISO for live
  popularity?: number;
  recommended?: boolean;
  externalUrl?: string; // URL for third-party portals like Kajabi
};

export const courses: Course[] = [
  {
    id: "c-1",
    title: "AI-Powered Business Analytics",
    type: "self",
    category: "AI for Business",
    description: "Learn how to leverage AI for data-driven business decisions and analytics.",
    popularity: 1250,
    recommended: false,
  },
  {
    id: "c-2",
    title: "AI Strategy for Business Leaders",
    type: "self",
    category: "AI for Business",
    description: "Strategic approaches to implementing AI in your organization.",
    popularity: 2043,
    recommended: true,
  },
  {
    id: "c-3",
    title: "Program Management with AI Tools",
    type: "self",
    category: "AI for Program Mgmt",
    description: "Streamline program management workflows using AI-powered tools.",
    popularity: 980,
    recommended: true,
  },
  {
    id: "c-4",
    title: "AI for Project Planning",
    type: "self",
    category: "AI for Program Mgmt",
    description: "Use AI to improve project planning, scheduling, and resource allocation.",
    popularity: 810,
    recommended: false,
  },
  {
    id: "c-5",
    title: "AI-Enhanced Career Counseling",
    type: "self",
    category: "AI for Career Services",
    description: "Leverage AI to provide personalized career guidance and job matching.",
    popularity: 670,
    recommended: true,
  },
  {
    id: "c-6",
    title: "Resume Optimization with AI",
    type: "self",
    category: "AI for Career Services",
    description: "Help students optimize their resumes using AI-powered tools.",
    popularity: 920,
    recommended: false,
  },
  {
    id: "c-7",
    title: "AI for IT Operations",
    type: "self",
    category: "AI for IT",
    description: "Automate IT operations, monitoring, and incident management with AI.",
    popularity: 1540,
    recommended: true,
  },
  {
    id: "c-8",
    title: "Cybersecurity with AI",
    type: "self",
    category: "AI for IT",
    description: "Implement AI-driven security measures and threat detection.",
    popularity: 1320,
    recommended: false,
  },
  {
    id: "c-9",
    title: "AI for Budget Planning",
    type: "self",
    category: "AI for Finance Administration",
    description: "Use AI to improve financial forecasting and budget management.",
    popularity: 890,
    recommended: false,
  },
  {
    id: "c-10",
    title: "Automated Financial Reporting",
    type: "self",
    category: "AI for Finance Administration",
    description: "Streamline financial reporting processes with AI automation.",
    popularity: 750,
    recommended: true,
  },
  {
    id: "c-11",
    title: "AI for Facility Maintenance",
    type: "self",
    category: "AI for Facilities Management",
    description: "Predictive maintenance and facility management using AI.",
    popularity: 640,
    recommended: false,
  },
  {
    id: "c-12",
    title: "Smart Building Management",
    type: "self",
    category: "AI for Facilities Management",
    description: "Optimize energy usage and building operations with AI systems.",
    popularity: 580,
    recommended: false,
  },
  {
    id: "c-13",
    title: "AI-Powered Document Management",
    type: "self",
    category: "AI for Admin Support",
    description: "Automate document processing, organization, and retrieval with AI.",
    popularity: 1100,
    recommended: true,
  },
  {
    id: "c-14",
    title: "Virtual Assistant Implementation",
    type: "self",
    category: "AI for Admin Support",
    description: "Deploy AI virtual assistants for administrative tasks.",
    popularity: 950,
    recommended: false,
  },
  {
    id: "c-15",
    title: "AI in Curriculum Design",
    type: "self",
    category: "AI For Teaching & Research",
    description: "Create engaging curricula using AI-powered content generation.",
    popularity: 1780,
    recommended: true,
  },
  {
    id: "c-16",
    title: "Research Assistant Tools",
    type: "self",
    category: "AI For Teaching & Research",
    description: "Enhance research workflows with AI-powered literature review and analysis.",
    popularity: 1450,
    recommended: true,
  },
  {
    id: "c-17",
    title: "Automated Grading Systems",
    type: "self",
    category: "AI For Teaching & Research",
    description: "Implement AI systems for automated assessment and feedback.",
    popularity: 1620,
    recommended: false,
  },
];

export const recommended = courses.filter((c) => c.recommended).slice(0, 6);
