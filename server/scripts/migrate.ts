#!/usr/bin/env tsx
/**
 * Migration script to import existing solutions.json data into SQLite database
 * Run with: pnpm tsx server/scripts/migrate.ts
 */

import fs from "node:fs";
import path from "node:path";
import { initDatabase } from "../db/index.js";
import { createUseCase, setUseCaseTags } from "../db/queries.js";
import type { Solution } from "@shared/api";

function getDataFilePath(): string {
  const fromRoot = path.resolve(process.cwd(), "server/data/solutions.json");
  if (fs.existsSync(fromRoot)) return fromRoot;
  const fromDist = path.resolve(process.cwd(), "dist/server/data/solutions.json");
  if (fs.existsSync(fromDist)) return fromDist;
  throw new Error("Could not find solutions.json file");
}

function loadSolutions(): Solution[] {
  const filePath = getDataFilePath();
  const raw = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(raw) as Solution[];
}

async function migrate() {
  console.log("Initializing database...");
  initDatabase();
  
  console.log("Loading solutions from JSON...");
  const solutions = loadSolutions();
  
  console.log(`Found ${solutions.length} solutions to migrate`);
  
  let imported = 0;
  let skipped = 0;
  
  for (const solution of solutions) {
    try {
      // Create use case
      const useCase = createUseCase({
        id: solution.id,
        title: solution.title,
        description: solution.description,
        author: solution.author,
        category: solution.category,
        rating: solution.rating,
        popularity: solution.popularity,
        dateAdded: solution.dateAdded,
        link: solution.link,
      });
      
      // Set tags
      if (solution.tags && solution.tags.length > 0) {
        setUseCaseTags(useCase.id, solution.tags);
      }
      
      imported++;
      console.log(`✓ Imported: ${solution.title}`);
    } catch (error: any) {
      if (error.message?.includes("UNIQUE constraint")) {
        skipped++;
        console.log(`⊘ Skipped (already exists): ${solution.title}`);
      } else {
        console.error(`✗ Error importing ${solution.title}:`, error.message);
      }
    }
  }
  
  console.log("\nMigration complete!");
  console.log(`  Imported: ${imported}`);
  console.log(`  Skipped: ${skipped}`);
  console.log(`  Total: ${solutions.length}`);
}

migrate().catch((error) => {
  console.error("Migration failed:", error);
  process.exit(1);
});

