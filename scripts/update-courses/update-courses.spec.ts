import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import { resolve } from "path";
import { DIVISIONS } from "./divisions";

const COURSES_JSON_PATH = resolve(
  process.cwd(),
  "client/data/linkedinCourses.json"
);

describe("update-courses", () => {
  it("linkedinCourses.json has valid structure for all divisions", () => {
    const content = readFileSync(COURSES_JSON_PATH, "utf-8");
    const data = JSON.parse(content) as Record<string, Array<{ title: string; url: string }>>;

    for (const div of DIVISIONS) {
      expect(data).toHaveProperty(div);
      const courses = data[div];
      expect(Array.isArray(courses)).toBe(true);
      for (const c of courses) {
        expect(c).toHaveProperty("title");
        expect(typeof c.title).toBe("string");
        expect(c.title.length).toBeGreaterThan(0);
        expect(c).toHaveProperty("url");
        expect(c.url).toMatch(/^https:\/\/www\.linkedin\.com\/learning\//);
      }
    }
  });

  it("no duplicate URLs within a division", () => {
    const content = readFileSync(COURSES_JSON_PATH, "utf-8");
    const data = JSON.parse(content) as Record<string, Array<{ url: string }>>;

    for (const div of DIVISIONS) {
      const courses = data[div] ?? [];
      const urls = courses.map((c) => c.url);
      const unique = new Set(urls);
      expect(unique.size).toBe(urls.length);
    }
  });
});
