/**
 * Division keys (used in linkedinCourses.json) and display names.
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

/** Full, proper section titles for display (not abbreviated) */
export const DIVISION_DISPLAY_NAMES: Record<Division, string> = {
  IT: "Information Technology",
  "Marketing & Communication": "Marketing and Communication",
  Finance: "Finance",
  "Business Administration": "Business Administration",
  "Human Resources": "Human Resources",
  "Data analysis": "Data Analysis",
  "Career services": "Career Services",
  "Facilities management": "Facilities Management",
};
