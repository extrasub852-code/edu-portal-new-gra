#!/usr/bin/env node
/**
 * Update LinkedIn Learning courses for each division.
 *
 * Usage:
 *   pnpm run update-courses              # Use seed data (no API key needed)
 *   pnpm run update-courses --dry-run   # Print proposed changes, don't write
 *   pnpm run update-courses --fetch     # Use search API + fetch titles (requires SERPAPI_KEY or BING_SEARCH_KEY)
 *
 * Output: client/data/linkedinCourses.json
 */

import { readFileSync, writeFileSync } from "fs";
import { resolve } from "path";
import { config } from "dotenv";
import {
  DIVISIONS,
  DIVISION_SEARCH_QUERIES,
  type Division,
  type DivisionCourses,
  type LinkedInCourse,
} from "./divisions";
import { getDefaultSearchProvider } from "./search-providers";
import { fetchCourseTitle } from "./fetch-title";

config({ path: resolve(process.cwd(), ".env") });

const COURSES_JSON_PATH = resolve(
  process.cwd(),
  "client/data/linkedinCourses.json"
);

const SEED_PATH = resolve(process.cwd(), "scripts/update-courses/seed.json");

// Built-in seed - used when no search API is configured
const BUILT_IN_SEED: DivisionCourses = {
  IT: [
    { title: "Applied AI for IT Operations (AIOps)", url: "https://www.linkedin.com/learning/applied-ai-for-it-operations-aiops" },
    { title: "AIOps Foundations: Automating IT Operations using AI", url: "https://www.linkedin.com/learning/aiops-foundations-automating-it-operations-using-ai" },
    { title: "Artificial Intelligence for Cybersecurity", url: "https://www.linkedin.com/learning/artificial-intelligence-for-cybersecurity-22882411" },
    { title: "The AI-Driven Cybersecurity Analyst", url: "https://www.linkedin.com/learning/the-ai-driven-cybersecurity-analyst" },
  ],
  "Marketing & Communication": [
    { title: "Using Generative AI across the Marketing Lifecycle", url: "https://www.linkedin.com/learning/using-generative-ai-across-the-marketing-lifecycle" },
    { title: "Build Your Generative AI Plan for Marketing Success", url: "https://www.linkedin.com/learning/build-your-generative-ai-plan-for-marketing-success" },
    { title: "Elevate Your Email Marketing with AI", url: "https://www.linkedin.com/learning/elevate-your-email-marketing-with-ai" },
  ],
  Finance: [
    { title: "The Future of AI for Finance and Accounting", url: "https://www.linkedin.com/learning/the-future-of-ai-for-finance-and-accounting" },
    { title: "Leveraging Generative AI in Finance and Accounting", url: "https://www.linkedin.com/learning/leveraging-generative-ai-in-finance-and-accounting" },
    { title: "The AI-Driven Financial Analyst", url: "https://www.linkedin.com/learning/the-ai-driven-financial-analyst" },
  ],
  "Business Administration": [
    { title: "Strategic AI Prompting for Managers: Leading Smarter with Generative AI", url: "https://www.linkedin.com/learning/strategic-ai-prompting-for-managers-leading-smarter-with-generative-ai" },
    { title: "Responsible AI for Managers", url: "https://www.linkedin.com/learning/responsible-ai-for-managers" },
    { title: "Integrating Generative AI into Business Strategy", url: "https://www.linkedin.com/learning/integrating-generative-ai-into-business-strategy" },
  ],
  "Human Resources": [
    { title: "Harnessing AI in the Recruiting Lifecycle", url: "https://www.linkedin.com/learning/harnessing-ai-in-the-recruiting-lifecycle" },
    { title: "Generative AI, Recruiting, and Talent Acquisition", url: "https://www.linkedin.com/learning/generative-ai-recruiting-and-talent-acquisition" },
    { title: "Generative AI in HR", url: "https://www.linkedin.com/learning/generative-ai-in-hr" },
  ],
  "Data analysis": [
    { title: "Complete Guide to Generative AI for Data Analysis and Data Science", url: "https://www.linkedin.com/learning/complete-guide-to-generative-ai-for-data-analysis-and-data-science" },
    { title: "Generative AI for Business Analysts", url: "https://www.linkedin.com/learning/generative-ai-for-business-analysts" },
    { title: "Excel and ChatGPT: Data Analysis Power Tips", url: "https://www.linkedin.com/learning/excel-and-chatgpt-data-analysis-power-tips" },
  ],
  "Career services": [
    { title: "Using AI to Make a Career Switch", url: "https://www.linkedin.com/learning/using-ai-to-make-a-career-switch" },
    { title: "ChatGPT Prompts for Jobseekers", url: "https://www.linkedin.com/learning/chatgpt-prompts-for-jobseekers" },
  ],
  "Facilities management": [
    { title: "AIOps Foundations: Automating IT Operations using AI", url: "https://www.linkedin.com/learning/aiops-foundations-automating-it-operations-using-ai" },
    { title: "Using AI to Improve Ops for Your Data Organization", url: "https://www.linkedin.com/learning/using-ai-to-improve-ops-for-your-data-organization" },
    { title: "Building an AI Implementation Roadmap", url: "https://www.linkedin.com/learning/building-an-ai-implementation-roadmap-key-principles-for-executing-a-successful-ai-strategy" },
  ],
};

function dedupeByUrl(courses: LinkedInCourse[]): LinkedInCourse[] {
  const seen = new Set<string>();
  return courses.filter((c) => {
    const key = c.url.toLowerCase().replace(/\/$/, "");
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function dedupeByTitleSimilarity(courses: LinkedInCourse[]): LinkedInCourse[] {
  const result: LinkedInCourse[] = [];
  for (const c of courses) {
    const norm = (s: string) => s.toLowerCase().replace(/\s+/g, " ").trim();
    const cNorm = norm(c.title);
    const isDuplicate = result.some((r) => {
      const rNorm = norm(r.title);
      return (
        cNorm === rNorm ||
        (cNorm.length > 20 && rNorm.length > 20 && cNorm.includes(rNorm)) ||
        (rNorm.length > 20 && rNorm.includes(cNorm))
      );
    });
    if (!isDuplicate) result.push(c);
  }
  return result;
}

async function runWithSearch(provider: NonNullable<ReturnType<typeof getDefaultSearchProvider>>): Promise<DivisionCourses> {
  const result: DivisionCourses = {} as DivisionCourses;

  for (const division of DIVISIONS) {
    const queries = DIVISION_SEARCH_QUERIES[division];
    const allCourses: LinkedInCourse[] = [];
    const seenUrls = new Set<string>();

    for (const q of queries.slice(0, 2)) {
      const searchRes = await provider.search(`${q} LinkedIn Learning`, 5);
      for (const r of searchRes) {
        if (seenUrls.has(r.url)) continue;
        seenUrls.add(r.url);
        let title = r.title;
        const fetched = await fetchCourseTitle(r.url);
        if (fetched) title = fetched;
        allCourses.push({ title, url: r.url });
      }
    }

    result[division] = dedupeByTitleSimilarity(dedupeByUrl(allCourses)).slice(0, 6);
  }

  return result;
}

function loadExistingCourses(): DivisionCourses | null {
  try {
    const content = readFileSync(COURSES_JSON_PATH, "utf-8");
    return JSON.parse(content) as DivisionCourses;
  } catch {
    return null;
  }
}

function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes("--dry-run");
  const useFetch = args.includes("--fetch");

  (async () => {
    let courses: DivisionCourses;

    if (useFetch) {
      const provider = getDefaultSearchProvider(process.env);
      if (!provider) {
        console.error(
          "Error: --fetch requires SERPAPI_KEY or BING_SEARCH_KEY in .env\n" +
          "See README for configuration instructions."
        );
        process.exit(1);
      }
      console.log(`Using search provider: ${provider.name}`);
      courses = await runWithSearch(provider);
    } else {
      courses = { ...BUILT_IN_SEED };
      if (Object.keys(courses).length === 0) {
        console.error("No seed data available.");
        process.exit(1);
      }
      console.log("Using built-in seed data.");
    }

    const output = JSON.stringify(courses, null, 2);

    if (dryRun) {
      console.log("\n--- Dry run: proposed courses.json ---\n");
      console.log(output);
      console.log("\n--- End dry run ---");
      return;
    }

    writeFileSync(COURSES_JSON_PATH, output + "\n", "utf-8");
    console.log(`Wrote ${COURSES_JSON_PATH}`);
  })().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}

main();
