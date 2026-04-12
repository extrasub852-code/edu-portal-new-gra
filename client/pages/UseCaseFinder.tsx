import { useEffect, useState, useCallback, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { UseCaseAnalysisDisplay } from "@/components/UseCaseAnalysis";
import { Sparkles } from "lucide-react";
import type { GenerateUseCaseAnalysisResponse } from "@shared/api";

// Categories - can be extracted from API if needed
const categories = [
  "Education",
  "Healthcare",
  "Marketing",
  "Technology",
  "Business",
];

export default function UseCaseFinder() {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const cat = params.get("category");
    if (cat && categories.includes(cat) && !selected.includes(cat)) {
      setSelected((prev) => [...prev, cat]);
    }
  }, []);

  // AI Analysis query - generates new use case analysis from idea
  const { data: analysisData, isLoading: isAnalyzing, error: analysisError } = useQuery<GenerateUseCaseAnalysisResponse>({
    queryKey: ["useCaseAnalysis", searchQuery],
    queryFn: async () => {
      const response = await fetch("/api/use-cases/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          idea: searchQuery,
        }),
      });
      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: "Analysis failed" }));
        throw new Error(error.message || error.error || "Analysis failed");
      }
      return response.json();
    },
    enabled: hasSearched && searchQuery.trim().length > 0,
    staleTime: 0, // Don't cache AI-generated content
    retry: 1, // Only retry once on failure
  });

  const resultsRef = useRef<HTMLDivElement>(null);
  const isLoading = hasSearched && isAnalyzing;
  const hasAnalysis = !!analysisData?.analysis;

  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim().length === 0) return;
    setSearchQuery(query.trim());
    setHasSearched(true);
    setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
  }, [query]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setQuery(e.target.value);
    if (e.target.value.trim().length === 0) {
      setHasSearched(false);
      setSearchQuery("");
    }
  }, []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Enter (without Shift) triggers search
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (query.trim().length > 0 && !isLoading) {
        setSearchQuery(query.trim());
        setHasSearched(true);
        setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
      }
    }
  }, [query, isLoading]);

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-5xl px-4 pb-12 pt-10 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-extrabold text-[#003057] sm:text-4xl">
            Use Case Explorer
          </h1>
          <p className="mt-2 text-base font-semibold text-[#B3A369]">
            Transform your ideas into structured use case analyses with AI
          </p>
          {hasAnalysis && (
            <div className="mt-2 inline-flex items-center gap-2 rounded-full bg-[#B3A369]/10 px-3 py-1 text-sm text-[#003057]">
              <Sparkles className="h-4 w-4 text-[#B3A369]" />
              <span>AI Analysis Generated</span>
            </div>
          )}
        </div>

        <div className="mx-auto rounded-2xl border border-[#003057]/15 bg-white p-5 shadow-sm sm:p-7">
          <form onSubmit={handleSearch} className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-bold text-[#003057]">
                Describe your project or requirement
              </label>
              <textarea
                ref={textareaRef}
                value={query}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder="e.g., 'increase customer retention' or 'boost user engagement' or 'customer onboarding flow'..."
                rows={4}
                className="w-full resize-y rounded-md border border-[#003057]/20 bg-white px-3 py-2 text-sm text-[#003057] outline-none transition-shadow focus:ring-2 focus:ring-[#B3A369]"
              />
              <p className="mt-2 text-xs text-[#003057]/60">
                Describe your idea and press <kbd className="rounded border border-[#003057]/30 px-1.5 py-0.5 font-mono text-[10px]">Enter</kbd> to generate an AI analysis. Use Shift+Enter for a new line.
              </p>
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-[#003057]">
                Category (Optional)
              </label>
              <div className="flex flex-wrap gap-2">
                {categories.map((c) => {
                  const active = selected.includes(c);
                  return (
                    <button
                      type="button"
                      key={c}
                      onClick={() =>
                        setSelected((prev) =>
                          prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c],
                        )
                      }
                      className={
                        "rounded-full border px-3 py-1 text-xs font-semibold transition-colors " +
                        (active
                          ? "border-[#B3A369] bg-[#B3A369]/20 text-[#003057]"
                          : "border-[#003057]/20 text-[#003057] hover:bg-[#003057]/5")
                      }
                    >
                      {c}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-sm text-[#003057]/70">
                {hasAnalysis && (
                  <span className="inline-flex items-center gap-1">
                    <Sparkles className="h-3 w-3 text-[#B3A369]" />
                    Analysis ready
                  </span>
                )}
              </div>
              <button
                type="submit"
                disabled={isLoading || query.trim().length === 0}
                className="inline-flex items-center gap-2 rounded-md bg-[#003057] px-4 py-2 text-sm font-semibold text-[#B3A369] shadow-sm transition-colors hover:bg-[#022d52] disabled:opacity-50"
              >
                <Sparkles className="h-4 w-4" />
                {isLoading ? "Generating Analysis..." : "Generate Analysis"}
              </button>
            </div>
          </form>
        </div>

        <div ref={resultsRef} className="mt-10">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-24">
              <svg className="h-8 w-8 animate-spin text-[#B3A369]" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 0116 0h-2a6 6 0 10-6 6v2A8 8 0 014 12z"
                />
              </svg>
              <p className="mt-4 text-sm text-[#003057]/70">
                Generating AI analysis of your idea...
              </p>
            </div>
          ) : hasAnalysis && analysisData ? (
            <UseCaseAnalysisDisplay analysis={analysisData.analysis} idea={searchQuery} />
          ) : hasSearched && !hasAnalysis ? (
            <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center text-[#003057] shadow-sm">
              <p className="mb-2 text-lg font-extrabold text-red-900">Analysis Failed</p>
              <p className="text-sm text-red-800">
                {analysisError?.message || "Unable to generate analysis. Please check your OpenAI API key is configured and try again."}
              </p>
              {(!analysisError?.message?.includes("OPENAI") && !analysisError?.message?.includes("API key")) ? null : (
                <p className="mt-3 text-xs text-red-700">
                  Add <code className="rounded bg-red-100 px-1 py-0.5 font-mono">OPENAI_API_KEY</code> to a <code className="rounded bg-red-100 px-1 py-0.5 font-mono">.env</code> file in the project root (see <code className="rounded bg-red-100 px-1 py-0.5 font-mono">.env.example</code>).
                </p>
              )}
            </div>
          ) : (
            <section className="rounded-xl border border-[#003057]/15 bg-[#F7F9FC] p-12 text-center">
              <p className="text-lg font-semibold text-[#003057]">Enter your idea above</p>
              <p className="mt-2 text-sm text-[#003057]/70">
                Press <kbd className="rounded border border-[#003057]/30 px-2 py-1 font-mono text-xs">Enter</kbd> to generate an AI analysis with similar existing solutions
              </p>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
