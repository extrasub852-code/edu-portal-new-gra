import { RequestHandler } from "express";
import { z } from "zod";
import OpenAI from "openai";
import type { UseCaseAnalysis, UseCaseDetail, GenerateUseCaseAnalysisResponse } from "@shared/api";
import { loadUseCases, calculateSemanticScore, extractIntentKeywords } from "./useCases.js";

/** Lazy-initialized so OPENAI_API_KEY is available after server loads .env (e.g. when Vite loads config). */
function getOpenAI(): OpenAI {
  const key = process.env.OPENAI_API_KEY;
  if (!key) throw new Error("OPENAI API key not configured");
  return new OpenAI({ apiKey: key });
}

const GenerateAnalysisSchema = z.object({
  idea: z.string().min(1, "Idea cannot be empty"),
});

// System prompt for the LLM
const SYSTEM_PROMPT = `You are the LLM powering the Use Case Explorer page.  

The Use Case Explorer connects to the ChatGPT API, takes a user's idea or concept, and transforms it into a structured Use Case analysis.  

Your output will be used by both the backend API and the frontend page renderer.

Your primary goals:

1. Normalize the user's raw idea into a structured, consistent, JSON-formatted Use Case object.

2. Ensure the JSON fields EXACTLY match the fields used by the "Individual Solution" page for displaying existing solutions from the local database.

3. Return output that can be directly consumed by the API layer without any post-processing.

STRICT RULES:

- Output MUST be valid JSON only.

- Do NOT include explanations, commentary, or text before/after the JSON.

- Do NOT wrap the JSON in backticks or code blocks.

- Use the exact keys in the schema below.

- Arrays should contain 3–6 concise items unless the user input requires otherwise.

- If the idea is unclear or empty, still return a fully structured JSON object with empty strings/arrays.

- The field "similar_existing_solutions" must remain empty. It will be populated by the backend using local DB matches.

OUTPUT FORMAT (MUST MATCH THE INDIVIDUAL SOLUTION PAGE SCHEMA):

{
  "idea_summary": "",
  "problem_statement": "",
  "target_users": [],
  "benefits": [],
  "key_features": [],
  "tech_stack": [],
  "similar_existing_solutions": [],
  "risk_factors": [],
  "suggested_next_steps": [],
  "recommended_ai_tools": [
    { "tool_name": "", "description": "", "prompt": "" }
  ]
}

DESCRIPTIONS OF EACH FIELD (FOR CONSISTENCY):

- idea_summary: Short description of the idea or product concept.

- problem_statement: The core problem the idea solves.

- target_users: Types of users who would need or adopt this solution.

- benefits: The value propositions or positive outcomes for users.

- key_features: Major capabilities this solution should include.

- tech_stack: Technologies required for building the solution.

- similar_existing_solutions: This stays empty. The backend merges DB results here.

- risk_factors: Business, technical, ethical, or execution risks.

- suggested_next_steps: Practical steps to move toward MVP or validation.

- recommended_ai_tools: Array of 3–6 AI tools the user can use to implement this idea. For each tool provide: tool_name (e.g. "ChatGPT", "Claude", "Cursor", "Notion AI"), optional short description of why it fits, prompt: a concrete, copy-paste-ready prompt the user can paste into that tool to get started, and link: the official URL to open the tool (e.g. "https://chat.openai.com", "https://claude.ai", "https://cursor.sh"). Prompts should be specific to the user's idea and actionable.

MECHANICS:

1. Read & interpret the user's idea.

2. Normalize it into concise business language.

3. Produce a JSON object that matches the schema and is ready for API integration.

4. Do not reference tools, the database, or the backend process. Simply return structured content.

EXAMPLE INPUT:

"An app that automates gym workouts using pose detection."

EXAMPLE OUTPUT:

{
  "idea_summary": "AI-powered fitness app that automates workout guidance using real-time pose detection.",
  "problem_statement": "Many gym users struggle with maintaining correct form and consistent workout routines without a trainer.",
  "target_users": ["Gym-goers", "Home fitness users", "Beginners learning proper form"],
  "benefits": ["Real-time form correction", "Personalized workout plans", "Reduced risk of injury"],
  "key_features": ["Pose detection feedback", "Adaptive workout plans", "Progress tracking dashboard"],
  "tech_stack": ["Computer vision", "Mobile app (iOS/Android)", "Real-time inference engine"],
  "similar_existing_solutions": [],
  "risk_factors": ["Pose detection accuracy", "Device performance constraints", "High development complexity"],
  "suggested_next_steps": ["Train baseline pose model", "Build workout library", "Run closed beta with test users"],
  "recommended_ai_tools": [
    { "tool_name": "ChatGPT", "description": "Draft product spec and user stories", "prompt": "I'm building an AI-powered fitness app that uses pose detection to guide workouts. Write a one-page product brief with user stories for gym-goers and home users, and suggest 5 key features for an MVP.", "link": "https://chat.openai.com" },
    { "tool_name": "Claude", "description": "Technical architecture and API design", "prompt": "Design the technical architecture for a mobile fitness app with real-time pose detection: suggest stack (e.g. React Native vs Flutter), how to integrate a pose estimation model, and a simple REST API for workout plans and progress.", "link": "https://claude.ai" },
    { "tool_name": "Cursor", "description": "Generate starter code", "prompt": "Generate a minimal React Native (or Flutter) screen that displays the device camera feed and a placeholder for overlaying pose keypoints. Include a button to start/stop a workout session.", "link": "https://cursor.sh" }
  ]
}

BEGIN NOW. Always return ONLY the JSON response for the user's idea.`;

/**
 * Find similar existing solutions from the database based on the analysis
 */
function findSimilarSolutions(
  analysis: UseCaseAnalysis,
  limit: number = 5
): UseCaseDetail[] {
  const useCases = loadUseCases();
  
  // Create a search query from the analysis
  const searchQuery = [
    analysis.idea_summary,
    analysis.problem_statement,
    ...analysis.key_features,
    ...analysis.tech_stack,
  ].join(" ");
  
  const intentKeywords = extractIntentKeywords(searchQuery);
  
  // Calculate similarity scores
  const scored = useCases.map(uc => {
    const score = calculateSemanticScore(uc, searchQuery, intentKeywords);
    return { useCase: uc, score };
  });
  
  // Sort by score and return top matches
  return scored
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(item => item.useCase);
}

/**
 * Generate use case analysis from user's idea
 */
export const generateUseCaseAnalysis: RequestHandler = async (req, res) => {
  try {
    // Validate request
    const parsed = GenerateAnalysisSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "Invalid request", details: parsed.error.errors });
      return;
    }

    const { idea } = parsed.data;

    // Check if OpenAI API key is configured
    if (!process.env.OPENAI_API_KEY) {
      res.status(500).json({ 
        error: "OpenAI API key not configured",
        message: "Please set OPENAI_API_KEY environment variable"
      });
      return;
    }

    // Call OpenAI API
    let analysis: UseCaseAnalysis;
    try {
      const openai = getOpenAI();
      const completion = await openai.chat.completions.create({
        model: process.env.OPENAI_MODEL || "gpt-4o-mini",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: idea },
        ],
        temperature: 0.7,
        response_format: { type: "json_object" },
      });

      const content = completion.choices[0]?.message?.content;
      if (!content) {
        throw new Error("No response from OpenAI");
      }

      // Parse the JSON response
      try {
        analysis = JSON.parse(content) as UseCaseAnalysis;
      } catch (parseError) {
        // Try to extract JSON from markdown code blocks if present
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          analysis = JSON.parse(jsonMatch[0]) as UseCaseAnalysis;
        } else {
          throw new Error("Failed to parse JSON from OpenAI response");
        }
      }

      // Validate the structure
      if (!analysis.idea_summary || !analysis.problem_statement) {
        throw new Error("Invalid analysis structure from OpenAI");
      }

      // Ensure similar_existing_solutions is empty (will be populated by backend)
      analysis.similar_existing_solutions = [];

      // Normalize recommended_ai_tools: ensure array, filter invalid entries
      if (!Array.isArray(analysis.recommended_ai_tools)) {
        analysis.recommended_ai_tools = [];
      } else {
        analysis.recommended_ai_tools = analysis.recommended_ai_tools.filter(
          (t: any) => t && typeof t.tool_name === "string" && typeof t.prompt === "string"
        ).map((t: any) => ({
          ...t,
          link: typeof t.link === "string" && t.link.startsWith("http") ? t.link : undefined,
        }));
      }

    } catch (openaiError: any) {
      console.error("OpenAI API error:", openaiError);
      res.status(500).json({ 
        error: "Failed to generate analysis",
        message: openaiError.message || "OpenAI API error"
      });
      return;
    }

    // Find similar existing solutions from the database
    const similarSolutions = findSimilarSolutions(analysis, 5);
    analysis.similar_existing_solutions = similarSolutions;

    // Return the complete analysis
    const response: GenerateUseCaseAnalysisResponse = {
      analysis,
    };

    res.status(200).json(response);
  } catch (error: any) {
    console.error("Error generating use case analysis:", error);
    res.status(500).json({ 
      error: "Internal server error",
      message: error.message 
    });
  }
};

