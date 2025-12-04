import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import type { UseCaseSuggestionsResponse } from "@shared/api";
import { Loader2 } from "lucide-react";

interface SearchSuggestionsProps {
  query: string;
  onSelect: (query: string) => void;
  onClose: () => void;
  isOpen: boolean;
}

export function SearchSuggestions({ query, onSelect, onClose, isOpen }: SearchSuggestionsProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const { data, isLoading } = useQuery<UseCaseSuggestionsResponse>({
    queryKey: ["useCaseSuggestions", query],
    queryFn: async () => {
      if (!query || query.trim().length < 2) {
        return { suggestions: [], query };
      }
      const response = await fetch(`/api/use-cases/suggestions?q=${encodeURIComponent(query)}&limit=5`);
      if (!response.ok) throw new Error("Failed to fetch suggestions");
      return response.json();
    },
    enabled: isOpen && query.trim().length >= 2,
    staleTime: 30000, // Cache for 30 seconds
  });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen, onClose]);

  if (!isOpen || !query || query.trim().length < 2) {
    return null;
  }

  const suggestions = data?.suggestions || [];

  return (
    <div
      ref={containerRef}
      className="absolute left-0 right-0 z-50 mt-1 rounded-lg border border-[#003057]/20 bg-white shadow-lg"
    >
      {isLoading ? (
        <div className="flex items-center justify-center p-4">
          <Loader2 className="h-4 w-4 animate-spin text-[#B3A369]" />
        </div>
      ) : suggestions.length > 0 ? (
        <div className="max-h-64 overflow-y-auto">
          {suggestions.map((suggestion) => (
            <button
              key={suggestion.id}
              type="button"
              onClick={() => {
                onSelect(suggestion.title);
                onClose();
              }}
              className="w-full text-left px-4 py-3 hover:bg-[#003057]/5 transition-colors border-b border-[#003057]/10 last:border-b-0"
            >
              <div className="font-semibold text-[#003057] text-sm">{suggestion.title}</div>
              <div className="text-xs text-[#003057]/70 mt-1 line-clamp-1">{suggestion.description}</div>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs text-[#B3A369] font-semibold">{suggestion.category}</span>
                {suggestion.score !== undefined && (
                  <span className="text-xs text-[#003057]/50">
                    Score: {suggestion.score.toFixed(1)}
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div className="p-4 text-sm text-[#003057]/70 text-center">
          No suggestions found
        </div>
      )}
    </div>
  );
}

