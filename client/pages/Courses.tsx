import { useMemo } from "react";
import { useCourses } from "@/hooks/useCourses";
import { CourseCardSelfPaced } from "@/components/courses/CourseCardSelfPaced";
import { RecommendationsCarousel } from "@/components/courses/RecommendationsCarousel";
import { recommended as recommendedSeed, type CourseCategory } from "@/data/courses";

const CATEGORIES: CourseCategory[] = [
  "AI for Business",
  "AI for Program Mgmt",
  "AI for Career Services",
  "AI for IT",
  "AI for Finance Administration",
  "AI for Facilities Management",
  "AI for Admin Support",
  "AI For Teaching & Research",
];

export default function Courses() {
  const { loading, data } = useCourses();

  const selfPaced = useMemo(() => data.filter((c) => c.type === "self"), [data]);
  const recommendations = recommendedSeed;

  // Group courses by category
  const coursesByCategory = useMemo(() => {
    const grouped: Record<string, typeof selfPaced> = {};
    selfPaced.forEach((course) => {
      const category = course.category || "Uncategorized";
      if (!grouped[category]) {
        grouped[category] = [];
      }
      grouped[category].push(course);
    });
    return grouped;
  }, [selfPaced]);

  const handleCourseClick = (courseId: string, externalUrl?: string) => {
    // Placeholder: In future, this will redirect to third-party portals like Kajabi
    if (externalUrl) {
      window.open(externalUrl, "_blank");
    } else {
      // For now, show alert indicating future redirect
      alert(`This course will redirect to a third-party education portal (e.g., Kajabi) in the future.\n\nCourse ID: ${courseId}`);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="text-center">
        <h1 className="text-3xl font-extrabold text-[#003057]">Self-Paced Courses</h1>
        <p className="mt-2 text-base font-semibold text-[#B3A369]">Explore courses organized by category</p>
      </div>

      <div className="mt-10">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <svg className="h-8 w-8 animate-spin text-[#B3A369]" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0116 0h-2a6 6 0 10-6 6v2A8 8 0 014 12z" />
            </svg>
          </div>
        ) : (
          <>
            {CATEGORIES.map((category) => {
              const categoryCourses = coursesByCategory[category] || [];
              if (categoryCourses.length === 0) return null;

              return (
                <section key={category} className="mb-12">
                  <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-xl font-extrabold text-[#003057]">{category}</h2>
                    <div className="text-sm text-[#003057]/70">{categoryCourses.length} {categoryCourses.length === 1 ? "course" : "courses"}</div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {categoryCourses.map((c) => (
                      <CourseCardSelfPaced
                        key={c.id}
                        course={c}
                        onContinue={() => handleCourseClick(c.id, c.externalUrl)}
                      />
                    ))}
                  </div>
                </section>
              );
            })}

            {/* Show uncategorized courses if any */}
            {coursesByCategory["Uncategorized"]?.length > 0 && (
              <section className="mb-12">
                <div className="mb-6 flex items-center justify-between">
                  <h2 className="text-xl font-extrabold text-[#003057]">Other Courses</h2>
                  <div className="text-sm text-[#003057]/70">
                    {coursesByCategory["Uncategorized"].length}{" "}
                    {coursesByCategory["Uncategorized"].length === 1 ? "course" : "courses"}
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {coursesByCategory["Uncategorized"].map((c) => (
                    <CourseCardSelfPaced
                      key={c.id}
                      course={c}
                      onContinue={() => handleCourseClick(c.id, c.externalUrl)}
                    />
                  ))}
                </div>
              </section>
            )}

            {selfPaced.length === 0 && (
              <div className="rounded-xl border border-[#003057]/10 bg-white p-6 text-center text-[#003057] shadow-sm">
                <p className="mb-2 text-lg font-extrabold">No courses available</p>
                <p className="text-sm text-[#003057]/70">Check out recommended courses below to get started.</p>
              </div>
            )}
          </>
        )}

        <section className="mt-12">
          <RecommendationsCarousel items={recommendations} />
        </section>
      </div>
    </div>
  );
}
