import type { Course } from "@/data/courses";

export function CourseCardSelfPaced({ course, onContinue }: { course: Course; onContinue?: (id: string) => void }) {
  const progress = Math.min(Math.max(course.progress ?? 0, 0), 100);

  return (
    <article className="flex flex-col rounded-xl border border-[#003057]/10 bg-white p-5 shadow-sm">
      <div className="mb-3 flex items-start justify-between">
        <h3 className="text-lg font-extrabold text-[#003057]">{course.title}</h3>
        {course.popularity && (
          <div className="text-sm font-semibold text-[#B3A369]">★ {Math.round((course.popularity / 1000) * 5) / 1}</div>
        )}
      </div>
      <p className="mb-4 text-sm text-[#003057]/80">{course.description}</p>

      {course.progress !== undefined && (
        <div className="mb-4">
          <div className="h-3 w-full rounded-full bg-[#003057]/10">
            <div
              className="h-3 rounded-full bg-[#B3A369] transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="mt-2 flex items-center justify-between text-xs text-[#003057]/70">
            <span>{progress}% complete</span>
            <span>{course.lastAccess ? new Date(course.lastAccess).toLocaleDateString() : "--"}</span>
          </div>
        </div>
      )}

      <div className="mt-auto flex items-center justify-end">
        <button
          onClick={() => onContinue?.(course.id)}
          className="rounded-md bg-[#B3A369] px-4 py-2 text-sm font-semibold text-[#003057] shadow-sm hover:bg-[#a4945c]"
        >
          {course.progress && course.progress > 0 ? "Continue Learning" : "View Course"}
        </button>
      </div>
    </article>
  );
}
