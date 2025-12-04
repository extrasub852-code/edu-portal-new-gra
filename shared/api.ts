/**
 * Shared code between client and server
 * Useful to share types between client and server
 * and/or small pure JS functions that can be used on both client and server
 */

/**
 * Example response type for /api/demo
 */
export interface DemoResponse {
  message: string;
}

/**
 * Solution data model used by the Use Case Finder.
 */
export interface Solution {
  id: string;
  title: string;
  description: string;
  solution?: string; // Optional solution text/details
  author: string;
  category: string;
  tags: string[];
  rating: number; // 0-5
  popularity: number; // arbitrary score or likes
  dateAdded: string; // ISO timestamp
  link?: string;
}

/**
 * Plain listing response. Primarily for diagnostics and simple UIs.
 */
export interface SolutionListResponse {
  solutions: Solution[];
  total: number;
}

/**
 * Search request sent from client to server.
 */
export interface SearchRequest {
  query: string;
  categories?: string[];
  limit?: number;
  offset?: number;
}

/**
 * Search result item with scoring and matched tags for transparency.
 */
export interface ScoredSolution extends Solution {
  score: number;
  matchedTags: string[];
}

/**
 * Search response with extracted tags and ranked results.
 */
export interface SearchResponse {
  query: string;
  extractedTags: string[];
  results: ScoredSolution[];
  total: number;
}

/**
 * Detailed Use Case data model with problem, solution, tech stack, impact, and examples.
 */
export interface UseCaseDetail {
  id: string;
  slug: string;
  title: string;
  description: string;
  author: string;
  category: string;
  rating: number;
  popularity: number;
  dateAdded: string;
  tags: string[];
  problem: {
    statement: string;
    impact: string;
  };
  solution: {
    overview: string;
    keyFeatures: string[];
  };
  techStack: string[];
  impact: {
    metrics: string[];
    benefits: string[];
  };
  exampleImplementation: {
    overview: string;
    keyComponents: string[];
  };
  relatedUseCases: string[];
  aiPrompts?: {
    title: string;
    prompt: string;
    description?: string;
  }[];
  aiTools?: {
    id: string;
    name: string;
    category: string;
    description: string;
    suggestedPrompt?: string;
    affiliateUrl?: string;
  }[];
}

/**
 * Simplified Use Case for listings and cards.
 */
export interface UseCase {
  id: string;
  slug: string;
  title: string;
  description: string;
  author: string;
  category: string;
  rating: number;
  popularity: number;
  dateAdded: string;
  tags: string[];
}

/**
 * Use Case search response with semantic scoring.
 */
export interface UseCaseSearchResponse {
  query: string;
  results: (UseCase & { score: number; matchedTags: string[] })[];
  total: number;
  semanticSearch: boolean;
}

/**
 * Use Case suggestions response for autocomplete.
 */
export interface UseCaseSuggestionsResponse {
  suggestions: (UseCase & { score: number })[];
  query: string;
}
