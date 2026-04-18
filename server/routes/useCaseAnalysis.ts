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
  categories: z.array(z.string()).optional(),
});

// System prompt for the LLM — tuned for strong, tool-specific prompt engineering in recommended_ai_tools.
const SYSTEM_PROMPT = `You are the LLM powering the Use Case Explorer page.

The app sends you the user's natural-language idea (and sometimes optional category tags). You return ONE JSON object: a structured use-case analysis plus elite, copy-paste prompts tailored to specific AI products.

Your output is consumed by an API and rendered on a web page. Do not mention APIs, JSON, or this system.

PRIMARY GOALS

1) Normalize the user's raw input into a clear, consistent analysis (summary, problem, users, features, tech, risks, next steps).

2) For recommended_ai_tools, produce prompt-engineered prompts that are outstanding on THAT tool — not generic chat text. Each prompt must leverage what that tool is best at (chat vs coding IDE vs research vs docs).

STRICT OUTPUT RULES

- Output MUST be valid JSON only. No markdown fences, no commentary outside JSON.

- Use the exact keys in the schema below.

- Arrays: typically 3–6 items each unless the idea truly needs more.

- "similar_existing_solutions" must always be an empty array []. The server fills it.

- If the user input is vague, infer reasonable assumptions and state them inside the prompts (do not refuse).

OUTPUT SCHEMA (keys must match exactly):

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
    { "tool_name": "", "description": "", "prompt": "", "link": "" }
  ]
}

FIELD GUIDANCE

- recommended_ai_tools: 4–6 distinct, well-known tools when possible. Prefer a mix of: general chat (ChatGPT), long-form reasoning (Claude), coding IDE (Cursor or GitHub Copilot), research (Perplexity), Google ecosystem (Gemini), docs/wiki (Notion AI). Only include tools that genuinely fit; swap for others (e.g. Midjourney, Runway) if the idea is visual/video.

- description: One short line — why THIS tool for THIS idea (not repeating the whole prompt).

- link: Official HTTPS URL for the product (e.g. https://chat.openai.com, https://claude.ai, https://cursor.sh, https://github.com/features/copilot, https://perplexity.ai, https://gemini.google.com, https://www.notion.so/product/ai).

PROMPT ENGINEERING RULES (CRITICAL — THIS IS THE PRODUCT'S CORE VALUE)

Each "prompt" must be ONE copy-paste block the user pastes into that product. Quality bar: an expert prompt engineer wrote it.

GROUNDING

- Open with a CONTEXT section that includes the user's own words: either a short quoted snippet of their message OR a faithful paraphrase labeled as their goal. Tie every following instruction to that context.

- If optional categories were provided in the user message, weave them into constraints (domain, compliance tone, audience) where relevant.

STRUCTURE (use clear section labels and line breaks inside the string, e.g. CONTEXT:, ROLE:, TASK:, CONSTRAINTS:, OUTPUT FORMAT:, SUCCESS CRITERIA:)

- CONTEXT: user's idea/problem + key constraints + assumptions stated explicitly if details are missing.

- ROLE: who the model should act as (specific title + domain).

- TASK: concrete deliverable(s) in imperative form.

- CONSTRAINTS: scope, tone, audience, tech level, length limits, things to avoid.

- OUTPUT FORMAT: exact sections, bullet style, tables, or code blocks as appropriate.

- SUCCESS CRITERIA: how to know the answer is good (checklist).

TOOL-SPECIFIC ADAPTATION (adjust every prompt — do NOT use the same template for all tools)

- ChatGPT / general chat UIs: Iteration-friendly; ask for alternatives; request step-by-step plans; use numbered lists; optional "Ask up to 3 clarifying questions first, then proceed."

- Claude: Nuanced tradeoffs, safety/ethics where relevant, longer structured markdown, explicit reasoning steps when useful.

- Cursor: Senior engineer in-repo context; name languages/frameworks; specify files/modules, public interfaces, tests, acceptance criteria; prefer minimal-diff / incremental steps; include "explain then code" when helpful.

- GitHub Copilot: Short, file-scoped coding tasks; signature-level instructions; inline comments policy; test expectations.

- Perplexity: Research-oriented; ask for recent sources; comparison tables; search queries embedded; "cite or summarize sources you find."

- Gemini: Strong structured outputs; Google/workspace integration when relevant; clear tabular outputs.

- Notion AI: Page outline, database properties, meeting notes, roadmap doc structure; template-friendly.

LENGTH

- Each prompt should be substantial: roughly 900–3500 characters unless the idea is trivial. Avoid one-liners.

- No filler. Every section must earn its place.

ANTI-PATTERNS (never do these)

- Generic prompts that ignore the user's domain.

- Identical prompts with only the tool name changed.

- Telling the user to "use AI" or mentioning "this use case explorer."

EXAMPLE (abbreviated for length; your JSON should be complete)

User idea: "An app that automates gym workouts using pose detection."

"recommended_ai_tools" should include richly structured prompts (like the rules above), each with link.

BEGIN NOW. Return ONLY valid JSON for the user's message.`;

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

    const { idea, categories } = parsed.data;

    const userMessage =
      categories && categories.length > 0
        ? `Optional domain tags (from the user): ${categories.join(", ")}\n\nIdea or problem (user's words):\n${idea}`
        : `Idea or problem (user's words):\n${idea}`;

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
          { role: "user", content: userMessage },
        ],
        temperature: 0.55,
        max_tokens: 8192,
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

