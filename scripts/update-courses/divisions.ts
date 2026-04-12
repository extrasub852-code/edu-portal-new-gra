/**
 * Division definitions and search query patterns for finding LinkedIn Learning courses.
 * Used by the update-courses script to search for AI-relevant courses per division.
 */

export const DIVISIONS = [
  "IT",
  "Marketing & Communication",
  "Finance",
  "Business Administration",
  "Human Resources",
  "Data analysis",
  "Career services",
  "Facilities management",
] as const;

export type Division = (typeof DIVISIONS)[number];

export const DIVISION_SEARCH_QUERIES: Record<Division, string[]> = {
  IT: [
    "AI for IT",
    "AI automation IT",
    "AI for developers",
    "AI for cybersecurity",
    "generative AI for IT",
  ],
  "Marketing & Communication": [
    "generative AI for marketing",
    "AI content marketing",
    "AI copywriting",
    "AI social media",
  ],
  Finance: [
    "AI for finance",
    "AI for FP&A",
    "AI in accounting",
    "AI risk finance",
  ],
  "Business Administration": [
    "AI strategy",
    "AI for managers",
    "AI operations",
    "AI productivity",
  ],
  "Human Resources": [
    "AI for HR",
    "AI recruiting",
    "AI talent",
    "AI people analytics",
  ],
  "Data analysis": [
    "AI for data analysts",
    "AI analytics",
    "machine learning foundations",
    "generative AI for data",
  ],
  "Career services": [
    "AI for job search",
    "AI resume",
    "AI interviewing",
    "career in age of AI",
  ],
  "Facilities management": [
    "AI operations",
    "AI maintenance",
    "AI for operations management",
    "automation operations",
  ],
};

export interface LinkedInCourse {
  title: string;
  url: string;
}

export type DivisionCourses = Record<Division, LinkedInCourse[]>;
