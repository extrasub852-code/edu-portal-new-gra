#!/usr/bin/env tsx
/**
 * Utility script to add a new use case via command line
 * 
 * Usage:
 *   pnpm tsx server/scripts/addUseCase.ts --title "My Use Case" --description "Description" --author "Author Name" --category "Category" --tags "tag1,tag2"
 * 
 * Or run interactively without arguments.
 */

import { initDatabase } from "../db/index.js";
import { createUseCase, setUseCaseTags } from "../db/queries.js";
import readline from "node:readline";

function parseArgs(): Record<string, string> {
  const args: Record<string, string> = {};
  const argv = process.argv.slice(2);
  
  for (let i = 0; i < argv.length; i += 2) {
    const key = argv[i]?.replace(/^--/, "");
    const value = argv[i + 1];
    if (key && value) {
      args[key] = value;
    }
  }
  
  return args;
}

function question(rl: readline.Interface, query: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(query, resolve);
  });
}

async function addUseCaseInteractive() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  try {
    const title = await question(rl, "Title: ");
    const description = await question(rl, "Description: ");
    const solution = await question(rl, "Solution (optional, press Enter to skip): ");
    const author = await question(rl, "Author: ");
    const category = await question(rl, "Category: ");
    const tagsInput = await question(rl, "Tags (comma-separated, optional): ");
    const ratingInput = await question(rl, "Rating (0-5, default 0): ");
    const popularityInput = await question(rl, "Popularity (default 0): ");
    const link = await question(rl, "Link (optional, press Enter to skip): ");

    const tags = tagsInput.trim() ? tagsInput.split(",").map(t => t.trim()).filter(Boolean) : [];
    const rating = ratingInput.trim() ? parseFloat(ratingInput) : 0;
    const popularity = popularityInput.trim() ? parseInt(popularityInput, 10) : 0;

    initDatabase();

    const useCase = createUseCase({
      title: title.trim(),
      description: description.trim(),
      solution: solution.trim() || undefined,
      author: author.trim(),
      category: category.trim(),
      rating,
      popularity,
      dateAdded: new Date().toISOString(),
      link: link.trim() || undefined,
    });

    if (tags.length > 0) {
      setUseCaseTags(useCase.id, tags);
    }

    console.log("\n✓ Use case created successfully!");
    console.log(`  ID: ${useCase.id}`);
    console.log(`  Title: ${useCase.title}`);
  } catch (error: any) {
    console.error("Error creating use case:", error.message);
    process.exit(1);
  } finally {
    rl.close();
  }
}

async function addUseCaseFromArgs(args: Record<string, string>) {
  if (!args.title || !args.description || !args.author || !args.category) {
    console.error("Missing required arguments: --title, --description, --author, --category");
    console.error("\nUsage:");
    console.error('  pnpm tsx server/scripts/addUseCase.ts --title "Title" --description "Description" --author "Author" --category "Category" [--tags "tag1,tag2"] [--solution "Solution"] [--rating 4.5] [--popularity 100] [--link "https://..."]');
    process.exit(1);
  }

  initDatabase();

  const tags = args.tags ? args.tags.split(",").map(t => t.trim()).filter(Boolean) : [];
  const rating = args.rating ? parseFloat(args.rating) : 0;
  const popularity = args.popularity ? parseInt(args.popularity, 10) : 0;

  try {
    const useCase = createUseCase({
      title: args.title,
      description: args.description,
      solution: args.solution,
      author: args.author,
      category: args.category,
      rating,
      popularity,
      dateAdded: new Date().toISOString(),
      link: args.link || undefined,
    });

    if (tags.length > 0) {
      setUseCaseTags(useCase.id, tags);
    }

    console.log("✓ Use case created successfully!");
    console.log(`  ID: ${useCase.id}`);
    console.log(`  Title: ${useCase.title}`);
  } catch (error: any) {
    console.error("Error creating use case:", error.message);
    process.exit(1);
  }
}

async function main() {
  const args = parseArgs();
  
  if (Object.keys(args).length === 0) {
    console.log("Interactive mode - please provide the following information:\n");
    await addUseCaseInteractive();
  } else {
    await addUseCaseFromArgs(args);
  }
}

main();

