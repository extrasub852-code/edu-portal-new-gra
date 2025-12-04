import { Star, Bookmark, ArrowRight } from "lucide-react";
import type { UseCase } from "@shared/api";

export type { UseCase };

export function UseCaseCard({ useCase }: { useCase: UseCase & { score?: number; matchedTags?: string[] } }) {
  const { title, description, author, category, rating, slug } = useCase;

  return (
    <article className="group flex flex-col rounded-xl border border-[#003057]/15 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
      <div className="mb-3 flex items-center justify-between">
        <span className="inline-flex items-center rounded-full bg-[#B3A369]/15 px-2.5 py-1 text-xs font-bold text-[#003057] ring-1 ring-[#B3A369]/30">
          {category}
        </span>
        <div className="flex items-center gap-1 text-[#B3A369]">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={i < Math.round(rating) ? "h-4 w-4 fill-[#B3A369]" : "h-4 w-4"}
            />
          ))}
          <span className="ml-1 text-xs font-semibold text-[#003057]">{rating.toFixed(1)}</span>
        </div>
      </div>
      <h3 className="mb-1 text-lg font-extrabold text-[#003057]">{title}</h3>
      <p className="mb-4 text-sm text-[#003057]/80">{description}</p>
      {useCase.matchedTags && useCase.matchedTags.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-1">
          {useCase.matchedTags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center rounded bg-[#003057]/10 px-2 py-0.5 text-xs font-semibold text-[#003057]"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
      <div className="mt-auto flex items-center justify-between pt-2">
        <p className="text-xs font-semibold text-[#B3A369]">by {author}</p>
        <a
          href={`/usecase/${slug}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#B3A369] hover:underline"
        >
          View Details
          <ArrowRight className="h-4 w-4" />
        </a>
      </div>
    </article>
  );
}
