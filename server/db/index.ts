import Database from "better-sqlite3";
import path from "node:path";
import fs from "node:fs";
import { SCHEMA } from "./schema.js";

let db: Database.Database | null = null;

/**
 * Get the database file path
 */
function getDbPath(): string {
  // In development, use server/db directory
  const devPath = path.resolve(process.cwd(), "server/db/use_cases.db");
  
  // In production (dist), use dist/server/db
  const prodPath = path.resolve(process.cwd(), "dist/server/db/use_cases.db");
  
  // Check which directory exists and use that
  if (fs.existsSync(path.dirname(devPath))) {
    return devPath;
  }
  
  // Ensure directory exists
  const dbDir = path.dirname(prodPath);
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }
  
  return prodPath;
}

/**
 * Initialize the database connection and create tables if they don't exist
 */
export function initDatabase(): Database.Database {
  if (db) {
    return db;
  }

  const dbPath = getDbPath();
  db = new Database(dbPath);
  
  // Enable foreign keys
  db.pragma("foreign_keys = ON");
  
  // Create tables
  db.exec(SCHEMA.useCases);
  db.exec(SCHEMA.tags);
  db.exec(SCHEMA.useCaseTags);
  
  // Create indexes
  for (const indexSql of SCHEMA.indexes) {
    db.exec(indexSql);
  }
  
  return db;
}

/**
 * Get the database instance (throws if not initialized)
 */
export function getDatabase(): Database.Database {
  if (!db) {
    throw new Error("Database not initialized. Call initDatabase() first.");
  }
  return db;
}

/**
 * Close the database connection
 */
export function closeDatabase(): void {
  if (db) {
    db.close();
    db = null;
  }
}

