import { CourseCardLinkedIn } from "@/components/courses/CourseCardLinkedIn";
import {
  DIVISIONS,
  DIVISION_DISPLAY_NAMES,
  type Division,
} from "@/data/divisionMapping";
import linkedinCoursesJson from "@/data/linkedinCourses.json";

const linkedinCourses = linkedinCoursesJson as Record<
  Division,
  Array<{ title: string; url: string }>
>;

export default function Courses() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="text-center">
        <h1 className="text-3xl font-extrabold text-[#003057]">
          AI Courses by Division
        </h1>
        <p className="mt-2 text-base font-semibold text-[#B3A369]">
          LinkedIn Learning courses on how AI can help in your role
        </p>
      </div>

      <div className="mt-10">
        {DIVISIONS.map((division) => {
          const courses = linkedinCourses[division] || [];
          if (courses.length === 0) return null;

          return (
            <section
              key={division}
              data-division={division}
              className="mb-12"
            >
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl font-extrabold text-[#003057]">
                  {DIVISION_DISPLAY_NAMES[division]}
                </h2>
                <div className="text-sm text-[#003057]/70">
                  {courses.length} {courses.length === 1 ? "course" : "courses"}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {courses.map((course) => (
                  <CourseCardLinkedIn
                    key={course.url}
                    title={course.title}
                    url={course.url}
                  />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
