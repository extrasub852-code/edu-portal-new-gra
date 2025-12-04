import { Link } from "react-router-dom";
import { Search, BookOpen, Sparkles, Bot, CheckCircle2, Lightbulb, Tag, Copy, ArrowRight } from "lucide-react";

export default function About() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <header className="text-center">
        <h1 className="text-4xl font-extrabold text-[#003057]">How to Use EduPortal</h1>
        <p className="mt-3 text-lg font-semibold text-[#B3A369]">
          Your complete guide to navigating and making the most of our educational platform
        </p>
      </header>

      {/* Getting Started */}
      <section className="mt-12 rounded-xl border border-[#003057]/15 bg-white p-8 shadow-sm">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-[#B3A369]/20">
            <Lightbulb className="h-5 w-5 text-[#003057]" />
          </div>
          <h2 className="text-2xl font-extrabold text-[#003057]">Getting Started</h2>
        </div>
        <p className="text-[#003057]/80">
          EduPortal is designed to help you find real-world solutions, learn through curated courses, and discover AI tools 
          that can accelerate your work. Whether you're an educator, administrator, or learner, this platform provides 
          everything you need to go from idea to implementation.
        </p>
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Link
            to="/use-case-finder"
            className="flex flex-col items-center rounded-lg border border-[#003057]/10 p-4 text-center transition-colors hover:bg-[#003057]/5"
          >
            <Search className="mb-2 h-8 w-8 text-[#B3A369]" />
            <div className="font-semibold text-[#003057]">Find Use Cases</div>
            <div className="mt-1 text-xs text-[#003057]/70">Explore solutions</div>
          </Link>
          <Link
            to="/courses"
            className="flex flex-col items-center rounded-lg border border-[#003057]/10 p-4 text-center transition-colors hover:bg-[#003057]/5"
          >
            <BookOpen className="mb-2 h-8 w-8 text-[#B3A369]" />
            <div className="font-semibold text-[#003057]">Browse Courses</div>
            <div className="mt-1 text-xs text-[#003057]/70">Start learning</div>
          </Link>
          <Link
            to="/contact"
            className="flex flex-col items-center rounded-lg border border-[#003057]/10 p-4 text-center transition-colors hover:bg-[#003057]/5"
          >
            <Bot className="mb-2 h-8 w-8 text-[#B3A369]" />
            <div className="font-semibold text-[#003057]">Get Help</div>
            <div className="mt-1 text-xs text-[#003057]/70">Contact support</div>
          </Link>
        </div>
      </section>

      {/* Use Case Finder Guide */}
      <section className="mt-10 rounded-xl border border-[#003057]/15 bg-white p-8 shadow-sm">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-[#B3A369]/20">
            <Search className="h-5 w-5 text-[#003057]" />
          </div>
          <div>
            <h2 className="text-2xl font-extrabold text-[#003057]">Using the Use Case Finder</h2>
            <p className="mt-1 text-sm text-[#003057]/70">
              Discover real-world solutions with our intelligent search system
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="mb-3 flex items-center gap-2 text-lg font-bold text-[#003057]">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#003057] text-xs font-bold text-[#B3A369]">1</span>
              Semantic Search
            </h3>
            <p className="text-[#003057]/80">
              Our search understands the meaning behind your query, not just keywords. Instead of searching for exact terms, 
              describe your problem or goal in natural language.
            </p>
            <div className="mt-3 rounded-lg bg-[#F7F8FA] p-4">
              <p className="mb-2 text-sm font-semibold text-[#003057]">Good search examples:</p>
              <ul className="space-y-1 text-sm text-[#003057]/80">
                <li className="flex items-start gap-2">
                  <ArrowRight className="mt-1 h-4 w-4 flex-shrink-0 text-[#B3A369]" />
                  <span>"increase customer retention"</span>
                </li>
                <li className="flex items-start gap-2">
                  <ArrowRight className="mt-1 h-4 w-4 flex-shrink-0 text-[#B3A369]" />
                  <span>"boost user engagement"</span>
                </li>
                <li className="flex items-start gap-2">
                  <ArrowRight className="mt-1 h-4 w-4 flex-shrink-0 text-[#B3A369]" />
                  <span>"customer onboarding flow"</span>
                </li>
                <li className="flex items-start gap-2">
                  <ArrowRight className="mt-1 h-4 w-4 flex-shrink-0 text-[#B3A369]" />
                  <span>"reduce student dropout rates"</span>
                </li>
              </ul>
            </div>
          </div>

          <div>
            <h3 className="mb-3 flex items-center gap-2 text-lg font-bold text-[#003057]">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#003057] text-xs font-bold text-[#B3A369]">2</span>
              Filter by Categories
            </h3>
            <p className="text-[#003057]/80">
              Narrow your search by selecting one or more categories. You can combine categories to find solutions that 
              span multiple domains. Categories include: Education, Healthcare, Marketing, Technology, and Business.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {["Education", "Healthcare", "Marketing", "Technology", "Business"].map((cat) => (
                <span
                  key={cat}
                  className="inline-flex items-center rounded-full border border-[#003057]/20 bg-white px-3 py-1 text-xs font-semibold text-[#003057]"
                >
                  <Tag className="mr-1 h-3 w-3" />
                  {cat}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-3 flex items-center gap-2 text-lg font-bold text-[#003057]">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#003057] text-xs font-bold text-[#B3A369]">3</span>
              Exploring Search Results
            </h3>
            <p className="text-[#003057]/80">
              Each use case card shows the title, category, and a brief description. Click on any card to view detailed 
              information including the problem statement, solution approach, tech stack, and implementation guides.
            </p>
          </div>
        </div>
      </section>

      {/* Use Case Details Guide */}
      <section className="mt-10 rounded-xl border border-[#003057]/15 bg-white p-8 shadow-sm">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-[#B3A369]/20">
            <BookOpen className="h-5 w-5 text-[#003057]" />
          </div>
          <div>
            <h2 className="text-2xl font-extrabold text-[#003057]">Understanding Use Case Details</h2>
            <p className="mt-1 text-sm text-[#003057]/70">
              Make the most of each use case page
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="rounded-lg border border-[#003057]/10 bg-[#F7F8FA] p-4">
              <h3 className="mb-2 flex items-center gap-2 font-semibold text-[#003057]">
                <CheckCircle2 className="h-5 w-5 text-[#B3A369]" />
                Problem Statement
              </h3>
              <p className="text-sm text-[#003057]/80">
                Understand the challenge being addressed and its impact on users or organizations.
              </p>
            </div>

            <div className="rounded-lg border border-[#003057]/10 bg-[#F7F8FA] p-4">
              <h3 className="mb-2 flex items-center gap-2 font-semibold text-[#003057]">
                <CheckCircle2 className="h-5 w-5 text-[#B3A369]" />
                Solution Overview
              </h3>
              <p className="text-sm text-[#003057]/80">
                Review the proposed solution approach and key features that address the problem.
              </p>
            </div>

            <div className="rounded-lg border border-[#003057]/10 bg-[#F7F8FA] p-4">
              <h3 className="mb-2 flex items-center gap-2 font-semibold text-[#003057]">
                <Sparkles className="h-5 w-5 text-[#B3A369]" />
                AI Prompts
              </h3>
              <p className="text-sm text-[#003057]/80">
                Copy ready-to-use prompts that you can paste directly into AI tools to develop your solution.
              </p>
            </div>

            <div className="rounded-lg border border-[#003057]/10 bg-[#F7F8FA] p-4">
              <h3 className="mb-2 flex items-center gap-2 font-semibold text-[#003057]">
                <Bot className="h-5 w-5 text-[#B3A369]" />
                Recommended AI Tools
              </h3>
              <p className="text-sm text-[#003057]/80">
                Discover specific AI tools with suggested prompts tailored to help you implement the solution.
              </p>
            </div>
          </div>

          <div className="rounded-lg border border-[#B3A369]/30 bg-[#B3A369]/5 p-4">
            <h3 className="mb-2 flex items-center gap-2 font-semibold text-[#003057]">
              <Copy className="h-5 w-5 text-[#B3A369]" />
              Using AI Prompts
            </h3>
            <p className="text-sm text-[#003057]/80">
              Each use case includes copyable prompts. Simply click the copy button to copy the prompt, then paste it into 
              your preferred AI tool (like ChatGPT, Claude, or other AI assistants) to get started on implementation.
            </p>
          </div>
        </div>
      </section>

      {/* Courses Guide */}
      <section className="mt-10 rounded-xl border border-[#003057]/15 bg-white p-8 shadow-sm">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-[#B3A369]/20">
            <BookOpen className="h-5 w-5 text-[#003057]" />
          </div>
          <div>
            <h2 className="text-2xl font-extrabold text-[#003057]">Exploring Courses</h2>
            <p className="mt-1 text-sm text-[#003057]/70">
              Browse and enroll in self-paced courses organized by category
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="mb-2 font-semibold text-[#003057]">Course Categories</h3>
            <p className="text-[#003057]/80">
              Courses are organized by functional area, including AI for Business, AI for Program Management, 
              AI for Career Services, AI for IT, and more. Use the course cards to see details about each offering, 
              including duration, difficulty level, and learning outcomes.
            </p>
          </div>

          <div>
            <h3 className="mb-2 font-semibold text-[#003057]">Recommended Courses</h3>
            <p className="text-[#003057]/80">
              At the bottom of the courses page, you'll find a carousel of recommended courses curated based on 
              popularity and relevance. These are great starting points for new learners.
            </p>
          </div>

          <div className="rounded-lg border border-[#003057]/10 bg-[#F7F8FA] p-4">
            <p className="text-sm font-semibold text-[#003057]">Note:</p>
            <p className="mt-1 text-sm text-[#003057]/80">
              Courses may redirect to third-party education portals (like Kajabi) for enrollment and completion. 
              Clicking on a course will open it in a new tab.
            </p>
          </div>
        </div>
      </section>

      {/* Best Practices */}
      <section className="mt-10 rounded-xl border border-[#003057]/15 bg-white p-8 shadow-sm">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-[#B3A369]/20">
            <Lightbulb className="h-5 w-5 text-[#003057]" />
          </div>
          <h2 className="text-2xl font-extrabold text-[#003057]">Best Practices</h2>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="mb-3 font-semibold text-[#003057]">1. Start with Clear Goals</h3>
            <p className="text-[#003057]/80">
              Before searching, clearly define what problem you're trying to solve or what you want to learn. 
              This will help you write better search queries and find more relevant results.
            </p>
          </div>

          <div>
            <h3 className="mb-3 font-semibold text-[#003057]">2. Use Natural Language</h3>
            <p className="text-[#003057]/80">
              Don't worry about finding the perfect keywords. Write your search query as you would describe 
              your need to a colleague. The semantic search will understand your intent.
            </p>
          </div>

          <div>
            <h3 className="mb-3 font-semibold text-[#003057]">3. Combine Search and Filters</h3>
            <p className="text-[#003057]/80">
              Use both the semantic search and category filters together. Start broad with a search query, 
              then narrow down using categories to refine your results.
            </p>
          </div>

          <div>
            <h3 className="mb-3 font-semibold text-[#003057]">4. Explore Related Use Cases</h3>
            <p className="text-[#003057]/80">
              When viewing a use case detail page, check out the related use cases section at the bottom. 
              These suggestions can lead you to complementary solutions or alternative approaches.
            </p>
          </div>

          <div>
            <h3 className="mb-3 font-semibold text-[#003057]">5. Leverage AI Prompts</h3>
            <p className="text-[#003057]/80">
              The AI prompts provided in each use case are ready to use. Copy them directly into your AI tool 
              of choice to start building. You can modify these prompts to better fit your specific context.
            </p>
          </div>

          <div>
            <h3 className="mb-3 font-semibold text-[#003057]">6. Bookmark for Later</h3>
            <p className="text-[#003057]/80">
              Found something useful? Use your browser's bookmark feature to save use cases or courses you 
              want to revisit later. Consider creating folders by project or topic.
            </p>
          </div>

          <div>
            <h3 className="mb-3 font-semibold text-[#003057]">7. Learn and Iterate</h3>
            <p className="text-[#003057]/80">
              Combine courses with use cases for maximum impact. Start with a course to build foundational knowledge, 
              then explore use cases to see how concepts are applied in real-world scenarios.
            </p>
          </div>
        </div>
      </section>

      {/* Quick Tips */}
      <section className="mt-10 rounded-xl border-2 border-[#B3A369]/30 bg-gradient-to-br from-[#B3A369]/10 to-[#003057]/5 p-8 shadow-sm">
        <h2 className="mb-6 text-2xl font-extrabold text-[#003057]">Quick Tips</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="flex items-start gap-3 rounded-lg bg-white/60 p-4">
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#B3A369] text-sm font-bold text-[#003057]">
              ✓
            </div>
            <div>
              <p className="font-semibold text-[#003057]">Be Specific</p>
              <p className="text-sm text-[#003057]/70">More detailed queries yield better results</p>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-lg bg-white/60 p-4">
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#B3A369] text-sm font-bold text-[#003057]">
              ✓
            </div>
            <div>
              <p className="font-semibold text-[#003057]">Try Variations</p>
              <p className="text-sm text-[#003057]/70">If results aren't ideal, rephrase your query</p>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-lg bg-white/60 p-4">
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#B3A369] text-sm font-bold text-[#003057]">
              ✓
            </div>
            <div>
              <p className="font-semibold text-[#003057]">Read Details</p>
              <p className="text-sm text-[#003057]/70">Full use case pages contain implementation guides</p>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-lg bg-white/60 p-4">
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#B3A369] text-sm font-bold text-[#003057]">
              ✓
            </div>
            <div>
              <p className="font-semibold text-[#003057]">Save Prompts</p>
              <p className="text-sm text-[#003057]/70">Copy and save AI prompts for future projects</p>
            </div>
          </div>
        </div>
      </section>

      {/* Get Started CTA */}
      <section className="mt-10 rounded-xl border border-[#003057]/15 bg-gradient-to-br from-[#003057] to-[#022d52] p-8 text-center text-white shadow-lg">
        <h2 className="mb-3 text-2xl font-extrabold">Ready to Get Started?</h2>
        <p className="mb-6 text-white/90">
          Explore use cases, browse courses, and start building solutions today.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            to="/use-case-finder"
            className="inline-flex items-center gap-2 rounded-md bg-[#B3A369] px-6 py-3 font-semibold text-[#003057] shadow-sm transition-colors hover:bg-[#a4945c]"
          >
            <Search className="h-5 w-5" />
            Find Use Cases
          </Link>
          <Link
            to="/courses"
            className="inline-flex items-center gap-2 rounded-md border-2 border-white/30 bg-transparent px-6 py-3 font-semibold text-white transition-colors hover:bg-white/10"
          >
            <BookOpen className="h-5 w-5" />
            Browse Courses
          </Link>
        </div>
      </section>
    </main>
  );
}
