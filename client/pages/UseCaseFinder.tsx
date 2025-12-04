import { useEffect, useState, useCallback, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { Filters, FiltersSidebar } from "@/components/FiltersSidebar";
import { UseCaseCard } from "@/components/UseCaseCard";
import { AIToolCard } from "@/components/AIToolCard";
import { SearchSuggestions } from "@/components/SearchSuggestions";
import { aiTools } from "@/data/aiTools";
import { Search, Sparkles } from "lucide-react";
import type { UseCaseSearchResponse } from "@shared/api";

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
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const cat = params.get("category");
    if (cat && categories.includes(cat) && !selected.includes(cat)) {
      setSelected((prev) => [...prev, cat]);
    }
  }, []);

  // Fetch all use cases for initial display
  const { data: allUseCasesData } = useQuery({
    queryKey: ["useCases"],
    queryFn: async () => {
      const response = await fetch("/api/use-cases");
      if (!response.ok) throw new Error("Failed to fetch use cases");
      return response.json();
    },
    staleTime: 300000, // Cache for 5 minutes
  });

  // Semantic search query
  const { data: searchResults, isLoading: isSearching } = useQuery<UseCaseSearchResponse>({
    queryKey: ["useCaseSearch", searchQuery, selected],
    queryFn: async () => {
      const cats = Array.from(new Set(selected));
      const response = await fetch("/api/use-cases/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: searchQuery,
          categories: cats.length > 0 ? cats : undefined,
          limit: 20,
        }),
      });
      if (!response.ok) throw new Error("Search failed");
      return response.json();
    },
    enabled: hasSearched,
    staleTime: 60000, // Cache for 1 minute
  });

  const resultsRef = useRef<HTMLDivElement>(null);

  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    // Always trigger search when button is clicked, even with empty query
    setSearchQuery(query.trim());
    setHasSearched(true);
    setShowSuggestions(false);
    // Scroll to results after a short delay to allow state update
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  }, [query]);

  const handleSuggestionSelect = useCallback((selectedQuery: string) => {
    setQuery(selectedQuery);
    setSearchQuery(selectedQuery);
    setHasSearched(true);
    setShowSuggestions(false);
  }, []);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setQuery(e.target.value);
    setShowSuggestions(true);
    if (e.target.value.trim().length === 0) {
      setHasSearched(false);
      setSearchQuery("");
    }
  }, []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Escape") {
      setShowSuggestions(false);
    }
  }, []);

  // Determine what to display
  const displayResults = hasSearched && searchResults
    ? searchResults.results
    : allUseCasesData?.useCases || [];

  const isLoading = hasSearched && isSearching;

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-5xl px-4 pb-12 pt-10 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-extrabold text-[#003057] sm:text-4xl">
            Use Case Explorer
          </h1>
          <p className="mt-2 text-base font-semibold text-[#B3A369]">
            Discover intelligent solutions with semantic search
          </p>
          {searchResults?.semanticSearch && (
            <div className="mt-2 inline-flex items-center gap-2 rounded-full bg-[#B3A369]/10 px-3 py-1 text-sm text-[#003057]">
              <Sparkles className="h-4 w-4 text-[#B3A369]" />
              <span>Semantic search enabled</span>
            </div>
          )}
        </div>

        <div className="mx-auto rounded-2xl border border-[#003057]/15 bg-white p-5 shadow-sm sm:p-7">
          <form onSubmit={handleSearch} className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-bold text-[#003057]">
                Describe your project or requirement
              </label>
              <div className="relative">
                <textarea
                  ref={textareaRef}
                  value={query}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  onFocus={() => query.length > 0 && setShowSuggestions(true)}
                  placeholder="e.g., 'increase customer retention' or 'boost user engagement' or 'customer onboarding flow'..."
                  rows={4}
                  className="w-full resize-y rounded-md border border-[#003057]/20 bg-white px-3 py-2 text-sm text-[#003057] outline-none transition-shadow focus:ring-2 focus:ring-[#B3A369]"
                />
                {showSuggestions && (
                  <SearchSuggestions
                    query={query}
                    onSelect={handleSuggestionSelect}
                    onClose={() => setShowSuggestions(false)}
                    isOpen={showSuggestions}
                  />
                )}
              </div>
              <p className="mt-2 text-xs text-[#003057]/60">
                Try semantic searches like: "customer onboarding flow", "boost user engagement", "increase retention"
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
                {hasSearched && searchResults && (
                  <span>
                    Found {searchResults.total} result{searchResults.total !== 1 ? "s" : ""}
                  </span>
                )}
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="inline-flex items-center gap-2 rounded-md bg-[#003057] px-4 py-2 text-sm font-semibold text-[#B3A369] shadow-sm transition-colors hover:bg-[#022d52] disabled:opacity-50"
              >
                <Search className="h-4 w-4" />
                {isLoading ? "Searching..." : "Find Solutions"}
              </button>
            </div>
          </form>
        </div>

        <div ref={resultsRef} className="mt-10">
          {isLoading ? (
            <div className="flex items-center justify-center py-24">
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
            </div>
          ) : displayResults.length > 0 ? (
            <section>
              <header className="mb-6">
                <h2 className="text-xl font-extrabold text-[#003057]">
                  {hasSearched ? "Search Results" : "All Use Cases"}
                </h2>
                <p className="text-sm text-[#003057]/70">
                  {hasSearched
                    ? "Matching use cases based on your search"
                    : "Browse all available use cases"}
                </p>
              </header>
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                {displayResults.map((uc) => (
                  <UseCaseCard key={uc.id} useCase={uc} />
                ))}
              </div>
            </section>
          ) : (
            <div className="rounded-xl border border-[#003057]/15 bg-white p-6 text-center text-[#003057] shadow-sm">
              <p className="mb-2 text-lg font-extrabold">No results found</p>
              <p className="text-sm text-[#003057]/70">
                {hasSearched
                  ? "Try adjusting your search query or categories."
                  : "No use cases available at the moment."}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
