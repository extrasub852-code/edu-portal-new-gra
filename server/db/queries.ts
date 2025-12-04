import Database from "better-sqlite3";
import type { UseCase } from "./schema.js";
import { getDatabase } from "./index.js";

/**
 * Insert a new use case
 */
export function createUseCase(useCase: Omit<UseCase, "id"> & { id?: string }): UseCase {
  const db = getDatabase();
  const id = useCase.id || `uc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  
  const stmt = db.prepare(`
    INSERT INTO use_cases (id, title, description, solution, author, category, rating, popularity, date_added, link)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  
  stmt.run(
    id,
    useCase.title,
    useCase.description,
    useCase.solution || null,
    useCase.author,
    useCase.category,
    useCase.rating,
    useCase.popularity,
    useCase.dateAdded,
    useCase.link || null
  );
  
  return getUseCaseById(id)!;
}

/**
 * Get a use case by ID
 */
export function getUseCaseById(id: string): UseCase | null {
  const db = getDatabase();
  const stmt = db.prepare(`
    SELECT 
      id,
      title,
      description,
      solution,
      author,
      category,
      rating,
      popularity,
      date_added as dateAdded,
      link
    FROM use_cases
    WHERE id = ?
  `);
  
  const row = stmt.get(id) as any;
  if (!row) return null;
  
  return {
    ...row,
    solution: row.solution || undefined,
    link: row.link || undefined,
  };
}

/**
 * Get all use cases with optional pagination
 */
export function getAllUseCases(limit?: number, offset?: number): UseCase[] {
  const db = getDatabase();
  let sql = `
    SELECT 
      id,
      title,
      description,
      solution,
      author,
      category,
      rating,
      popularity,
      date_added as dateAdded,
      link
    FROM use_cases
    ORDER BY popularity DESC, date_added DESC
  `;
  
  if (limit !== undefined) {
    sql += ` LIMIT ?`;
    if (offset !== undefined) {
      sql += ` OFFSET ?`;
    }
  }
  
  const stmt = db.prepare(sql);
  const rows = (limit !== undefined && offset !== undefined)
    ? stmt.all(limit, offset)
    : limit !== undefined
    ? stmt.all(limit)
    : stmt.all();
  
  return (rows as any[]).map(row => ({
    ...row,
    solution: row.solution || undefined,
    link: row.link || undefined,
  }));
}

/**
 * Update a use case
 */
export function updateUseCase(id: string, updates: Partial<Omit<UseCase, "id" | "dateAdded">>): UseCase | null {
  const db = getDatabase();
  const existing = getUseCaseById(id);
  if (!existing) return null;
  
  const fields: string[] = [];
  const values: any[] = [];
  
  if (updates.title !== undefined) {
    fields.push("title = ?");
    values.push(updates.title);
  }
  if (updates.description !== undefined) {
    fields.push("description = ?");
    values.push(updates.description);
  }
  if (updates.solution !== undefined) {
    fields.push("solution = ?");
    values.push(updates.solution || null);
  }
  if (updates.author !== undefined) {
    fields.push("author = ?");
    values.push(updates.author);
  }
  if (updates.category !== undefined) {
    fields.push("category = ?");
    values.push(updates.category);
  }
  if (updates.rating !== undefined) {
    fields.push("rating = ?");
    values.push(updates.rating);
  }
  if (updates.popularity !== undefined) {
    fields.push("popularity = ?");
    values.push(updates.popularity);
  }
  if (updates.link !== undefined) {
    fields.push("link = ?");
    values.push(updates.link || null);
  }
  
  if (fields.length === 0) {
    return existing;
  }
  
  values.push(id);
  const sql = `UPDATE use_cases SET ${fields.join(", ")} WHERE id = ?`;
  db.prepare(sql).run(...values);
  
  return getUseCaseById(id);
}

/**
 * Delete a use case
 */
export function deleteUseCase(id: string): boolean {
  const db = getDatabase();
  const stmt = db.prepare("DELETE FROM use_cases WHERE id = ?");
  const result = stmt.run(id);
  return result.changes > 0;
}

/**
 * Search use cases by keyword (searches title, description, and tags)
 */
export function searchUseCases(
  query: string,
  categories?: string[],
  limit: number = 20,
  offset: number = 0
): { useCases: UseCase[]; total: number } {
  const db = getDatabase();
  const normalizedQuery = query.toLowerCase().trim();
  
  // Build the search query
  let sql = `
    SELECT DISTINCT
      uc.id,
      uc.title,
      uc.description,
      uc.solution,
      uc.author,
      uc.category,
      uc.rating,
      uc.popularity,
      uc.date_added as dateAdded,
      uc.link
    FROM use_cases uc
    LEFT JOIN use_case_tags uct ON uc.id = uct.use_case_id
    LEFT JOIN tags t ON uct.tag_id = t.id
    WHERE 1=1
  `;
  
  const params: any[] = [];
  
  // Add text search conditions
  if (normalizedQuery) {
    sql += ` AND (
      LOWER(uc.title) LIKE ? OR
      LOWER(uc.description) LIKE ? OR
      LOWER(uc.solution) LIKE ? OR
      LOWER(t.name) LIKE ?
    )`;
    const searchPattern = `%${normalizedQuery}%`;
    params.push(searchPattern, searchPattern, searchPattern, searchPattern);
  }
  
  // Add category filter
  if (categories && categories.length > 0) {
    const placeholders = categories.map(() => "?").join(", ");
    sql += ` AND LOWER(uc.category) IN (${placeholders})`;
    params.push(...categories.map(c => c.toLowerCase()));
  }
  
  // Get total count
  const countSql = sql.replace(/SELECT DISTINCT[\s\S]*?FROM/, "SELECT COUNT(DISTINCT uc.id) as count FROM");
  const countStmt = db.prepare(countSql);
  const countResult = countStmt.get(...params) as { count: number };
  const total = countResult.count;
  
  // Add ordering and pagination
  sql += ` ORDER BY uc.popularity DESC, uc.date_added DESC LIMIT ? OFFSET ?`;
  params.push(limit, offset);
  
  const stmt = db.prepare(sql);
  const rows = stmt.all(...params) as any[];
  
  const useCases = rows.map(row => ({
    ...row,
    solution: row.solution || undefined,
    link: row.link || undefined,
  }));
  
  return { useCases, total };
}

/**
 * Get or create a tag by name
 */
export function getOrCreateTag(name: string): number {
  const db = getDatabase();
  
  // Try to get existing tag
  const getStmt = db.prepare("SELECT id FROM tags WHERE name = ?");
  const existing = getStmt.get(name) as { id: number } | undefined;
  
  if (existing) {
    return existing.id;
  }
  
  // Create new tag
  const insertStmt = db.prepare("INSERT INTO tags (name) VALUES (?)");
  const result = insertStmt.run(name);
  return Number(result.lastInsertRowid);
}

/**
 * Get all tags for a use case
 */
export function getUseCaseTags(useCaseId: string): string[] {
  const db = getDatabase();
  const stmt = db.prepare(`
    SELECT t.name
    FROM tags t
    INNER JOIN use_case_tags uct ON t.id = uct.tag_id
    WHERE uct.use_case_id = ?
  `);
  const rows = stmt.all(useCaseId) as { name: string }[];
  return rows.map(row => row.name);
}

/**
 * Set tags for a use case (replaces existing tags)
 */
export function setUseCaseTags(useCaseId: string, tagNames: string[]): void {
  const db = getDatabase();
  const transaction = db.transaction(() => {
    // Delete existing tags
    const deleteStmt = db.prepare("DELETE FROM use_case_tags WHERE use_case_id = ?");
    deleteStmt.run(useCaseId);
    
    // Add new tags
    const insertStmt = db.prepare("INSERT INTO use_case_tags (use_case_id, tag_id) VALUES (?, ?)");
    for (const tagName of tagNames) {
      const tagId = getOrCreateTag(tagName);
      insertStmt.run(useCaseId, tagId);
    }
  });
  
  transaction();
}

/**
 * Get all tags
 */
export function getAllTags(): string[] {
  const db = getDatabase();
  const stmt = db.prepare("SELECT name FROM tags ORDER BY name");
  const rows = stmt.all() as { name: string }[];
  return rows.map(row => row.name);
}

