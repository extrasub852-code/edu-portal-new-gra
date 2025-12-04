import { RequestHandler } from "express";
import { z } from "zod";
import fs from "node:fs";
import path from "node:path";
import type { UseCaseDetail, UseCase, UseCaseSearchResponse, UseCaseSuggestionsResponse } from "@shared/api";

let cachedUseCases: UseCaseDetail[] | null = null;

function getDataFilePath(): string {
  const fromRoot = path.resolve(process.cwd(), "server/data/useCases.json");
  if (fs.existsSync(fromRoot)) return fromRoot;
  const fromDist = path.resolve(process.cwd(), "dist/server/data/useCases.json");
  return fromDist;
}

function loadUseCases(): UseCaseDetail[] {
  if (cachedUseCases) return cachedUseCases;
  const filePath = getDataFilePath();
  const raw = fs.readFileSync(filePath, "utf-8");
  const json = JSON.parse(raw) as UseCaseDetail[];
  cachedUseCases = json;
  return json;
}

function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// Intent synonyms and related terms for semantic matching
const intentSynonyms: Record<string, string[]> = {
  // Customer onboarding
  "onboarding": ["onboarding", "setup", "activation", "welcome", "getting started", "initial setup"],
  "customer onboarding": ["customer onboarding", "user onboarding", "client onboarding", "new customer", "signup flow"],
  
  // Engagement
  "engagement": ["engagement", "user engagement", "interaction", "participation", "activity"],
  "boost engagement": ["boost engagement", "increase engagement", "improve engagement", "user engagement", "engagement"],
  "user engagement": ["user engagement", "engagement", "user activity", "user interaction"],
  
  // Retention
  "retention": ["retention", "customer retention", "user retention", "keep users", "reduce churn"],
  "customer retention": ["customer retention", "retention", "reduce churn", "keep customers", "loyalty"],
  "increase retention": ["increase retention", "improve retention", "boost retention", "retention"],
  
  // Analytics
  "analytics": ["analytics", "data", "metrics", "insights", "reporting", "dashboard"],
  "dashboard": ["dashboard", "analytics", "metrics", "reporting", "insights"],
  
  // Personalization
  "personalization": ["personalization", "personalized", "customization", "tailored", "individual"],
  "personalized": ["personalized", "personalization", "custom", "tailored", "individual"],
  
  // Workflow automation
  "automation": ["automation", "automate", "workflow", "automated", "streamline"],
  "workflow": ["workflow", "process", "automation", "workflow automation", "process automation"],
  
  // Notifications
  "notifications": ["notifications", "alerts", "messages", "notify", "push notifications"],
  "targeted notifications": ["targeted notifications", "personalized notifications", "smart notifications"],
  
  // Loyalty
  "loyalty": ["loyalty", "loyalty program", "rewards", "loyalty campaigns", "customer loyalty"],
  "loyalty campaigns": ["loyalty campaigns", "loyalty program", "rewards", "loyalty"],
  
  // Feedback
  "feedback": ["feedback", "reviews", "customer feedback", "user feedback", "survey"],
  "customer feedback": ["customer feedback", "feedback", "reviews", "user feedback"],
  
  // Reactivation
  "reactivation": ["reactivation", "re-engagement", "win back", "reactivate", "bring back"],
  "customer reactivation": ["customer reactivation", "reactivation", "re-engagement", "win back"],
  
  // Gamification
  "gamification": ["gamification", "gamified", "points", "badges", "leaderboard", "rewards"],
  "gamified": ["gamified", "gamification", "points", "badges", "leaderboard"],
  
  // Integration
  "integration": ["integration", "integrate", "connect", "sync", "api"],
  "integrations": ["integrations", "integration", "connect", "sync", "api"],
};

// Extract intent keywords from query
function extractIntentKeywords(query: string): string[] {
  const normalized = normalize(query);
  const keywords = new Set<string>();
  
  // Check for exact matches in synonyms
  for (const [intent, synonyms] of Object.entries(intentSynonyms)) {
    for (const synonym of synonyms) {
      if (normalized.includes(synonym.toLowerCase())) {
        keywords.add(intent);
        // Add all related synonyms
        synonyms.forEach(s => keywords.add(s.toLowerCase()));
      }
    }
  }
  
  // Also add individual words from query
  normalized.split(" ").forEach(word => {
    if (word.length > 2) {
      keywords.add(word);
    }
  });
  
  return Array.from(keywords);
}

// Calculate semantic similarity score
function calculateSemanticScore(useCase: UseCaseDetail, query: string, intentKeywords: string[]): number {
  let score = 0;
  const normalizedQuery = normalize(query);
  const queryWords = normalizedQuery.split(" ").filter(w => w.length > 2);
  
  // Create searchable text from use case
  const searchableText = [
    useCase.title,
    useCase.description,
    useCase.category,
    ...useCase.tags,
    useCase.problem.statement,
    useCase.solution.overview,
    ...useCase.solution.keyFeatures,
  ].join(" ").toLowerCase();
  
  // Title match (highest weight)
  if (normalizedQuery.split(" ").some(word => useCase.title.toLowerCase().includes(word))) {
    score += 5;
  }
  
  // Exact phrase match in title
  if (useCase.title.toLowerCase().includes(normalizedQuery)) {
    score += 10;
  }
  
  // Description match
  if (normalizedQuery.split(" ").some(word => useCase.description.toLowerCase().includes(word))) {
    score += 3;
  }
  
  // Tag matches
  const tagMatches = useCase.tags.filter(tag => 
    intentKeywords.some(keyword => tag.toLowerCase().includes(keyword)) ||
    queryWords.some(word => tag.toLowerCase().includes(word))
  ).length;
  score += tagMatches * 2;
  
  // Intent keyword matches in searchable text
  const intentMatches = intentKeywords.filter(keyword => 
    searchableText.includes(keyword.toLowerCase())
  ).length;
  score += intentMatches * 1.5;
  
  // Word frequency in searchable text
  queryWords.forEach(word => {
    const frequency = (searchableText.match(new RegExp(word, "g")) || []).length;
    score += frequency * 0.5;
  });
  
  // Category match
  if (useCase.category.toLowerCase().includes(normalizedQuery) || 
      normalizedQuery.includes(useCase.category.toLowerCase())) {
    score += 2;
  }
  
  // Problem/Solution match (semantic understanding)
  if (useCase.problem.statement.toLowerCase().includes(normalizedQuery) ||
      useCase.solution.overview.toLowerCase().includes(normalizedQuery)) {
    score += 2;
  }
  
  return score;
}

// Keyword-based fallback search
function keywordSearch(useCases: UseCaseDetail[], query: string): UseCaseDetail[] {
  const normalizedQuery = normalize(query);
  const queryWords = normalizedQuery.split(" ").filter(w => w.length > 2);
  
  return useCases
    .map(uc => {
      let score = 0;
      const searchableText = [
        uc.title,
        uc.description,
        uc.category,
        ...uc.tags,
      ].join(" ").toLowerCase();
      
      queryWords.forEach(word => {
        if (uc.title.toLowerCase().includes(word)) score += 5;
        if (uc.description.toLowerCase().includes(word)) score += 3;
        if (uc.category.toLowerCase().includes(word)) score += 2;
        if (uc.tags.some(tag => tag.toLowerCase().includes(word))) score += 2;
      });
      
      return { useCase: uc, score };
    })
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .map(item => item.useCase);
}

const SearchSchema = z.object({
  query: z.string().default(""),
  categories: z.array(z.string()).optional(),
  limit: z.number().int().min(1).max(100).optional().default(20),
  offset: z.number().int().min(0).optional().default(0),
});

const SuggestionsSchema = z.object({
  query: z.string().min(1),
  limit: z.number().int().min(1).max(10).optional().default(5),
});

// Get all use cases
export const listUseCases: RequestHandler = (_req, res) => {
  const useCases = loadUseCases();
  const simplified: UseCase[] = useCases.map(uc => ({
    id: uc.id,
    slug: uc.slug,
    title: uc.title,
    description: uc.description,
    author: uc.author,
    category: uc.category,
    rating: uc.rating,
    popularity: uc.popularity,
    dateAdded: uc.dateAdded,
    tags: uc.tags,
  }));
  res.status(200).json({ useCases: simplified, total: simplified.length });
};

// Get use case by slug
export const getUseCaseBySlug: RequestHandler = (req, res) => {
  const { slug } = req.params;
  const useCases = loadUseCases();
  const useCase = useCases.find(uc => uc.slug === slug);
  
  if (!useCase) {
    res.status(404).json({ error: "Use case not found" });
    return;
  }
  
  res.status(200).json(useCase);
};

// Get use case by ID (for backward compatibility)
export const getUseCase: RequestHandler = (req, res) => {
  const { id } = req.params;
  const useCases = loadUseCases();
  const useCase = useCases.find(uc => uc.id === id);
  
  if (!useCase) {
    res.status(404).json({ error: "Use case not found" });
    return;
  }
  
  res.status(200).json(useCase);
};

// Create use case handler (placeholder for backward compatibility)
export const createUseCaseHandler: RequestHandler = (req, res) => {
  res.status(501).json({ error: "Use case creation not implemented yet. Use the JSON file directly." });
};

// Update use case handler (placeholder for backward compatibility)
export const updateUseCaseHandler: RequestHandler = (req, res) => {
  res.status(501).json({ error: "Use case update not implemented yet. Use the JSON file directly." });
};

// Delete use case handler (placeholder for backward compatibility)
export const deleteUseCaseHandler: RequestHandler = (req, res) => {
  res.status(501).json({ error: "Use case deletion not implemented yet. Use the JSON file directly." });
};

// Analytics endpoint (placeholder - can be enhanced with database storage)
export const trackUseCaseAnalytics: RequestHandler = (req, res) => {
  const { useCaseId, action } = req.body;
  
  // In a production system, you would store this in a database
  // For now, we'll just log it and return success
  console.log(`Analytics: Use case ${useCaseId} - Action: ${action} - Timestamp: ${new Date().toISOString()}`);
  
  res.status(200).json({ success: true, message: "Analytics tracked" });
};

// Semantic search for use cases
export const searchUseCases: RequestHandler = (req, res) => {
  const parsed = SearchSchema.safeParse({
    query: req.body?.query ?? (typeof req.query?.q === "string" ? req.query.q : ""),
    categories: (req.body?.categories as string[] | undefined) ?? undefined,
    limit: req.body?.limit ?? (req.query?.limit ? Number(req.query.limit) : undefined),
    offset: req.body?.offset ?? (req.query?.offset ? Number(req.query.offset) : undefined),
  });

  if (!parsed.success) {
    res.status(400).json({ error: "Invalid request" });
    return;
  }

  const { query, categories, limit, offset } = parsed.data;
  const useCases = loadUseCases();
  
  if (!query || query.trim().length === 0) {
    // Return all use cases if no query
    const simplified: UseCase[] = useCases.map(uc => ({
      id: uc.id,
      slug: uc.slug,
      title: uc.title,
      description: uc.description,
      author: uc.author,
      category: uc.category,
      rating: uc.rating,
      popularity: uc.popularity,
      dateAdded: uc.dateAdded,
      tags: uc.tags,
    }));
    
    let filtered = simplified;
    if (categories && categories.length > 0) {
      const categorySet = new Set(categories.map(c => c.toLowerCase()));
      filtered = filtered.filter(uc => categorySet.has(uc.category.toLowerCase()));
    }
    
    const response: UseCaseSearchResponse = {
      query: "",
      results: filtered.map(uc => ({ ...uc, score: 0, matchedTags: [] })),
      total: filtered.length,
      semanticSearch: false,
    };
    res.status(200).json(response);
    return;
  }

  // Extract intent keywords
  const intentKeywords = extractIntentKeywords(query);
  
  // Calculate semantic scores
  let candidates = useCases.map(uc => {
    const score = calculateSemanticScore(uc, query, intentKeywords);
    const matchedTags = uc.tags.filter(tag => 
      intentKeywords.some(keyword => tag.toLowerCase().includes(keyword)) ||
      query.toLowerCase().includes(tag.toLowerCase())
    );
    return { useCase: uc, score, matchedTags };
  });

  // Filter by categories if provided
  if (categories && categories.length > 0) {
    const categorySet = new Set(categories.map(c => c.toLowerCase()));
    candidates = candidates.filter(item => 
      categorySet.has(item.useCase.category.toLowerCase())
    );
  }

  // Fallback to keyword search if semantic search yields no results
  const hasResults = candidates.some(c => c.score > 0);
  if (!hasResults) {
    const keywordResults = keywordSearch(useCases, query);
    candidates = keywordResults.map(uc => ({
      useCase: uc,
      score: 1, // Minimum score for keyword matches
      matchedTags: uc.tags.filter(tag => 
        query.toLowerCase().includes(tag.toLowerCase())
      ),
    }));
  }

  // Sort by score (descending), then by popularity
  candidates.sort((a, b) => {
    if (Math.abs(b.score - a.score) > 0.1) {
      return b.score - a.score;
    }
    return b.useCase.popularity - a.useCase.popularity;
  });

  // Apply pagination
  const total = candidates.length;
  const paged = candidates.slice(offset, offset + limit);

  // Convert to simplified format
  const results = paged.map(item => ({
    id: item.useCase.id,
    slug: item.useCase.slug,
    title: item.useCase.title,
    description: item.useCase.description,
    author: item.useCase.author,
    category: item.useCase.category,
    rating: item.useCase.rating,
    popularity: item.useCase.popularity,
    dateAdded: item.useCase.dateAdded,
    tags: item.useCase.tags,
    score: item.score,
    matchedTags: item.matchedTags,
  }));

  const response: UseCaseSearchResponse = {
    query,
    results,
    total,
    semanticSearch: hasResults,
  };

  res.status(200).json(response);
};

// Get search suggestions for autocomplete
export const getUseCaseSuggestions: RequestHandler = (req, res) => {
  const parsed = SuggestionsSchema.safeParse({
    query: req.query?.q ?? req.body?.query ?? "",
    limit: req.query?.limit ? Number(req.query.limit) : undefined,
  });

  if (!parsed.success) {
    res.status(400).json({ error: "Invalid request" });
    return;
  }

  const { query, limit } = parsed.data;
  const useCases = loadUseCases();
  
  if (!query || query.trim().length === 0) {
    res.status(200).json({ suggestions: [], query });
    return;
  }

  const intentKeywords = extractIntentKeywords(query);
  
  const suggestions = useCases
    .map(uc => {
      const score = calculateSemanticScore(uc, query, intentKeywords);
      return {
        useCase: uc,
        score,
      };
    })
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(item => ({
      id: item.useCase.id,
      slug: item.useCase.slug,
      title: item.useCase.title,
      description: item.useCase.description,
      author: item.useCase.author,
      category: item.useCase.category,
      rating: item.useCase.rating,
      popularity: item.useCase.popularity,
      dateAdded: item.useCase.dateAdded,
      tags: item.useCase.tags,
      score: item.score,
    }));

  const response: UseCaseSuggestionsResponse = {
    suggestions,
    query,
  };

  res.status(200).json(response);
};
