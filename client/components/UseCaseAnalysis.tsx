import { CheckCircle2, Users, TrendingUp, Code, AlertTriangle, ArrowRight, Sparkles, Wrench, ExternalLink } from "lucide-react";
import type { UseCaseAnalysis, RecommendedAITool } from "@shared/api";
import { UseCaseCard } from "./UseCaseCard";
import { CopyablePrompt } from "./CopyablePrompt";

/** Fallback URLs for common AI tools when LLM doesn't provide a link */
const AI_TOOL_LINKS: Record<string, string> = {
  "ChatGPT": "https://chat.openai.com",
  "Claude": "https://claude.ai",
  "Anthropic Claude": "https://claude.ai",
  "Cursor": "https://cursor.sh",
  "Notion AI": "https://notion.so/product/ai",
  "Notion": "https://notion.so",
  "GitHub Copilot": "https://github.com/features/copilot",
  "Copilot": "https://github.com/features/copilot",
  "Perplexity": "https://perplexity.ai",
  "Gemini": "https://gemini.google.com",
  "Google AI": "https://gemini.google.com",
};

function getToolLink(tool: RecommendedAITool): string | undefined {
  if (tool.link) return tool.link;
  return AI_TOOL_LINKS[tool.tool_name];
}

interface UseCaseAnalysisProps {
  analysis: UseCaseAnalysis;
  idea: string;
}

export function UseCaseAnalysisDisplay({ analysis, idea }: UseCaseAnalysisProps) {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="rounded-xl border border-[#003057]/15 bg-gradient-to-br from-[#003057] to-[#022d52] p-6 text-white shadow-sm">
        <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-sm font-semibold">
          <Sparkles className="h-4 w-4" />
          <span>AI-Generated Analysis</span>
        </div>
        <h2 className="mb-2 text-2xl font-extrabold">{analysis.idea_summary}</h2>
        <p className="text-sm text-white/80">Based on: "{idea}"</p>
      </div>

      {/* AI tools and copy-paste prompts */}
      {analysis.recommended_ai_tools && analysis.recommended_ai_tools.length > 0 && (
        <section className="rounded-xl border-2 border-[#B3A369]/40 bg-[#F7F9FC] p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <Wrench className="h-5 w-5 text-[#B3A369]" />
            <h3 className="text-xl font-extrabold text-[#003057]">AI tools to implement this idea</h3>
          </div>
          <p className="mb-4 text-sm text-[#003057]/80">
            Use these tools and copy-paste the prompts below to get started.
          </p>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {analysis.recommended_ai_tools.map((tool, index) => {
              const link = getToolLink(tool);
              return (
                <div key={index} className="rounded-lg border border-[#003057]/15 bg-white p-4 shadow-sm">
                  <div className="mb-1 flex items-center justify-between gap-2">
                    <h4 className="font-semibold text-[#003057]">{tool.tool_name}</h4>
                    {link && (
                      <a
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-md bg-[#003057] px-3 py-1.5 text-xs font-semibold text-[#B3A369] transition-colors hover:bg-[#022d52]"
                      >
                        Open in {tool.tool_name}
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    )}
                  </div>
                  {tool.description && (
                    <p className="mb-3 text-xs text-[#003057]/70">{tool.description}</p>
                  )}
                  <CopyablePrompt
                    title="Prompt to copy"
                    prompt={tool.prompt}
                    description="Paste this into the tool to get started"
                  />
                </div>
              );
            })}
          </div>
        </section>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Problem Statement */}
          <section className="rounded-xl border border-[#003057]/15 bg-white p-6 shadow-sm">
            <h3 className="mb-3 text-xl font-extrabold text-[#003057]">Problem Statement</h3>
            <p className="text-[#003057]/80">{analysis.problem_statement}</p>
          </section>

          {/* Key Features */}
          <section className="rounded-xl border border-[#003057]/15 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-[#B3A369]" />
              <h3 className="text-xl font-extrabold text-[#003057]">Key Features</h3>
            </div>
            <ul className="space-y-2">
              {analysis.key_features.map((feature, index) => (
                <li key={index} className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#B3A369]" />
                  <span className="text-[#003057]/80">{feature}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Tech Stack */}
          <section className="rounded-xl border border-[#003057]/15 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-2">
              <Code className="h-5 w-5 text-[#B3A369]" />
              <h3 className="text-xl font-extrabold text-[#003057]">Tech Stack</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {analysis.tech_stack.map((tech, index) => (
                <span
                  key={index}
                  className="rounded-full bg-[#003057]/10 px-3 py-1 text-sm font-semibold text-[#003057]"
                >
                  {tech}
                </span>
              ))}
            </div>
          </section>

          {/* Risk Factors */}
          {analysis.risk_factors.length > 0 && (
            <section className="rounded-xl border border-red-200 bg-red-50 p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                <h3 className="text-xl font-extrabold text-red-900">Risk Factors</h3>
              </div>
              <ul className="space-y-2">
                {analysis.risk_factors.map((risk, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-600" />
                    <span className="text-sm text-red-800">{risk}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Suggested Next Steps */}
          {analysis.suggested_next_steps.length > 0 && (
            <section className="rounded-xl border border-[#003057]/15 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-2">
                <ArrowRight className="h-5 w-5 text-[#B3A369]" />
                <h3 className="text-xl font-extrabold text-[#003057]">Suggested Next Steps</h3>
              </div>
              <ol className="space-y-2">
                {analysis.suggested_next_steps.map((step, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[#B3A369] text-xs font-bold text-[#003057]">
                      {index + 1}
                    </span>
                    <span className="text-[#003057]/80">{step}</span>
                  </li>
                ))}
              </ol>
            </section>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Target Users */}
          <section className="rounded-xl border border-[#003057]/15 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-2">
              <Users className="h-5 w-5 text-[#B3A369]" />
              <h3 className="text-lg font-extrabold text-[#003057]">Target Users</h3>
            </div>
            <ul className="space-y-2">
              {analysis.target_users.map((user, index) => (
                <li key={index} className="flex items-start gap-2">
                  <Users className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#B3A369]" />
                  <span className="text-sm text-[#003057]/80">{user}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Benefits */}
          <section className="rounded-xl border border-[#003057]/15 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-[#B3A369]" />
              <h3 className="text-lg font-extrabold text-[#003057]">Benefits</h3>
            </div>
            <ul className="space-y-2">
              {analysis.benefits.map((benefit, index) => (
                <li key={index} className="flex items-start gap-2">
                  <TrendingUp className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-600" />
                  <span className="text-sm text-[#003057]/80">{benefit}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>

      {/* Similar Existing Solutions - sorted by similarity on the backend */}
      {analysis.similar_existing_solutions.length > 0 && (
        <section className="mt-8">
          <h3 className="mb-4 text-xl font-extrabold text-[#003057]">
            Similar Existing Solutions
          </h3>
          <p className="mb-4 text-sm text-[#003057]/70">
            Most similar to your idea (closest matches first)
          </p>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {analysis.similar_existing_solutions.map((solution) => (
              <UseCaseCard 
                key={solution.id} 
                useCase={{
                  id: solution.id,
                  slug: solution.slug,
                  title: solution.title,
                  description: solution.description,
                  author: solution.author,
                  category: solution.category,
                  rating: solution.rating,
                  popularity: solution.popularity,
                  dateAdded: solution.dateAdded,
                  tags: solution.tags,
                }} 
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

