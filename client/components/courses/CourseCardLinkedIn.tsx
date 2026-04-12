/** LinkedIn "in" logo SVG */
function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-label="LinkedIn Learning"
    >
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

export function CourseCardLinkedIn({
  title,
  url,
}: {
  title: string;
  url: string;
}) {
  return (
    <article className="flex flex-col rounded-xl border border-[#003057]/10 bg-white p-5 shadow-sm">
      <div className="mb-3 flex items-start justify-between gap-2">
        <h3 className="text-lg font-extrabold text-[#003057]">{title}</h3>
        <LinkedInIcon className="h-6 w-6 shrink-0 text-[#0A66C2]" />
      </div>
      <p className="mb-4 text-sm text-[#003057]/80">
        Learn how AI can help in your role—from practical skills to strategy.
      </p>

      <div className="mt-auto flex items-center justify-end">
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-md bg-[#B3A369] px-4 py-2 text-sm font-semibold text-[#003057] shadow-sm hover:bg-[#a4945c]"
        >
          View Course
        </a>
      </div>
    </article>
  );
}
