/**
 * Database schema definitions for use cases and tags
 */

export interface UseCase {
  id: string;
  title: string;
  description: string;
  solution?: string; // Optional solution text/details
  author: string;
  category: string;
  rating: number; // 0-5
  popularity: number; // arbitrary score
  dateAdded: string; // ISO timestamp
  link?: string;
}

export interface Tag {
  id: number;
  name: string;
}

export interface UseCaseTag {
  useCaseId: string;
  tagId: number;
}

/**
 * SQL schema definitions
 */
export const SCHEMA = {
  useCases: `
    CREATE TABLE IF NOT EXISTS use_cases (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      solution TEXT,
      author TEXT NOT NULL,
      category TEXT NOT NULL,
      rating REAL NOT NULL DEFAULT 0,
      popularity INTEGER NOT NULL DEFAULT 0,
      date_added TEXT NOT NULL,
      link TEXT
    )
  `,
  tags: `
    CREATE TABLE IF NOT EXISTS tags (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE
    )
  `,
  useCaseTags: `
    CREATE TABLE IF NOT EXISTS use_case_tags (
      use_case_id TEXT NOT NULL,
      tag_id INTEGER NOT NULL,
      PRIMARY KEY (use_case_id, tag_id),
      FOREIGN KEY (use_case_id) REFERENCES use_cases(id) ON DELETE CASCADE,
      FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
    )
  `,
  // Indexes for better search performance
  indexes: [
    `CREATE INDEX IF NOT EXISTS idx_use_cases_title ON use_cases(title)`,
    `CREATE INDEX IF NOT EXISTS idx_use_cases_description ON use_cases(description)`,
    `CREATE INDEX IF NOT EXISTS idx_use_cases_category ON use_cases(category)`,
    `CREATE INDEX IF NOT EXISTS idx_tags_name ON tags(name)`,
    `CREATE INDEX IF NOT EXISTS idx_use_case_tags_use_case_id ON use_case_tags(use_case_id)`,
    `CREATE INDEX IF NOT EXISTS idx_use_case_tags_tag_id ON use_case_tags(tag_id)`,
  ],
};

