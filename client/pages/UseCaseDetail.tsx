import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Star, TrendingUp, Users, Clock, CheckCircle2, Code, BarChart3, Sparkles, Bot } from "lucide-react";
import type { UseCaseDetail } from "@shared/api";
import { UseCaseCard } from "@/components/UseCaseCard";
import { CopyablePrompt } from "@/components/CopyablePrompt";
import { AIToolCard } from "@/components/AIToolCard";

export default function UseCaseDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [relatedUseCases, setRelatedUseCases] = useState<any[]>([]);

  const { data: useCase, isLoading, error } = useQuery<UseCaseDetail>({
    queryKey: ["useCase", slug],
    queryFn: async () => {
      const response = await fetch(`/api/use-cases/slug/${slug}?t=${Date.now()}`);
      if (!response.ok) throw new Error("Use case not found");
      return response.json();
    },
    enabled: !!slug,
    staleTime: 0, // Always fetch fresh data
    cacheTime: 0, // Don't cache
  });

  // Fetch related use cases
  useEffect(() => {
    if (useCase?.relatedUseCases && useCase.relatedUseCases.length > 0) {
      Promise.all(
        useCase.relatedUseCases.map((id) =>
          fetch(`/api/use-cases/${id}`)
            .then((res) => res.json())
            .catch(() => null)
        )
      ).then((results) => {
        setRelatedUseCases(results.filter(Boolean));
      });
    }
  }, [useCase]);

  // Track view analytics
  useEffect(() => {
    if (useCase) {
      // Track use case view
      fetch("/api/use-cases/analytics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ useCaseId: useCase.id, action: "view" }),
      }).catch(() => {
        // Silently fail if analytics endpoint doesn't exist
      });
    }
  }, [useCase]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
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
    );
  }

  if (error || !useCase) {
    return (
      <div className="min-h-screen bg-white">
        <div className="mx-auto max-w-4xl px-4 py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-[#003057]">Use Case Not Found</h1>
            <p className="mt-2 text-[#003057]/70">The use case you're looking for doesn't exist.</p>
            <Link
              to="/use-case-finder"
              className="mt-4 inline-flex items-center gap-2 text-[#B3A369] hover:underline"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Use Case Finder
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-[#003057] to-[#022d52] text-white">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
          <Link
            to="/use-case-finder"
            className="mb-6 inline-flex items-center gap-2 text-sm text-white/80 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Use Case Finder
          </Link>

          <div className="mb-4">
            <span className="inline-flex items-center rounded-full bg-white/20 px-3 py-1 text-sm font-semibold">
              {useCase.category}
            </span>
          </div>

          <h1 className="mb-4 text-4xl font-extrabold sm:text-5xl">{useCase.title}</h1>
          <p className="mb-8 max-w-3xl text-lg text-white/90">{useCase.description}</p>

          {/* Key Metrics */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="rounded-lg bg-white/10 p-4 backdrop-blur-sm">
              <div className="flex items-center gap-2 text-white/80">
                <Star className="h-5 w-5 text-[#B3A369]" />
                <span className="text-sm">Rating</span>
              </div>
              <div className="mt-2 text-2xl font-bold">{useCase.rating.toFixed(1)}</div>
            </div>
            <div className="rounded-lg bg-white/10 p-4 backdrop-blur-sm">
              <div className="flex items-center gap-2 text-white/80">
                <TrendingUp className="h-5 w-5 text-[#B3A369]" />
                <span className="text-sm">Popularity</span>
              </div>
              <div className="mt-2 text-2xl font-bold">{useCase.popularity}</div>
            </div>
            <div className="rounded-lg bg-white/10 p-4 backdrop-blur-sm">
              <div className="flex items-center gap-2 text-white/80">
                <Users className="h-5 w-5 text-[#B3A369]" />
                <span className="text-sm">Author</span>
              </div>
              <div className="mt-2 text-lg font-semibold">{useCase.author}</div>
            </div>
            <div className="rounded-lg bg-white/10 p-4 backdrop-blur-sm">
              <div className="flex items-center gap-2 text-white/80">
                <Clock className="h-5 w-5 text-[#B3A369]" />
                <span className="text-sm">Added</span>
              </div>
              <div className="mt-2 text-lg font-semibold">
                {new Date(useCase.dateAdded).toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Main Content Column */}
          <div className="lg:col-span-2">
            {/* Problem Statement */}
            <section className="mb-8 rounded-xl border border-[#003057]/15 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-2xl font-extrabold text-[#003057]">Problem Statement</h2>
              <p className="mb-4 text-[#003057]/80">{useCase.problem.statement}</p>
              <div className="rounded-lg bg-red-50 p-4">
                <p className="text-sm font-semibold text-red-900">Impact:</p>
                <p className="mt-1 text-sm text-red-800">{useCase.problem.impact}</p>
              </div>
            </section>

            {/* Solution */}
            <section className="mb-8 rounded-xl border border-[#003057]/15 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-2xl font-extrabold text-[#003057]">Proposed Solution</h2>
              <p className="mb-4 text-[#003057]/80">{useCase.solution.overview}</p>
              <div className="mt-4">
                <p className="mb-3 text-sm font-semibold text-[#003057]">Key Features:</p>
                <ul className="space-y-2">
                  {useCase.solution.keyFeatures.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#B3A369]" />
                      <span className="text-[#003057]/80">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            {/* Tech Stack */}
            <section className="mb-8 rounded-xl border border-[#003057]/15 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-2">
                <Code className="h-6 w-6 text-[#B3A369]" />
                <h2 className="text-2xl font-extrabold text-[#003057]">Tech Stack</h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {useCase.techStack.map((tech, index) => (
                  <span
                    key={index}
                    className="rounded-full bg-[#003057]/10 px-3 py-1 text-sm font-semibold text-[#003057]"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </section>

            {/* Example Implementation */}
            <section className="mb-8 rounded-xl border border-[#003057]/15 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-2xl font-extrabold text-[#003057]">Example Implementation</h2>
              <p className="mb-4 text-[#003057]/80">{useCase.exampleImplementation.overview}</p>
              <div className="mt-4">
                <p className="mb-3 text-sm font-semibold text-[#003057]">Key Components:</p>
                <ul className="space-y-2">
                  {useCase.exampleImplementation.keyComponents.map((component, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Code className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#B3A369]" />
                      <span className="text-[#003057]/80">{component}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            {/* AI Prompts */}
            {useCase.aiPrompts && Array.isArray(useCase.aiPrompts) && useCase.aiPrompts.length > 0 && (
              <section className="mb-8 rounded-xl border border-[#003057]/15 bg-white p-6 shadow-sm">
                <div className="mb-4 flex items-center gap-2">
                  <Sparkles className="h-6 w-6 text-[#B3A369]" />
                  <h2 className="text-2xl font-extrabold text-[#003057]">AI Prompts</h2>
                </div>
                <p className="mb-4 text-sm text-[#003057]/70">
                  Copy and paste these prompts directly into your AI tool to develop and execute this idea.
                </p>
                <div className="space-y-4">
                  {useCase.aiPrompts.map((prompt, index) => (
                    <CopyablePrompt
                      key={index}
                      title={prompt.title}
                      prompt={prompt.prompt}
                      description={prompt.description}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* AI Tools */}
            {useCase.aiTools && Array.isArray(useCase.aiTools) && useCase.aiTools.length > 0 && (
              <section className="mb-8 rounded-xl border border-[#003057]/15 bg-white p-6 shadow-sm">
                <div className="mb-4 flex items-center gap-2">
                  <Bot className="h-6 w-6 text-[#B3A369]" />
                  <h2 className="text-2xl font-extrabold text-[#003057]">Recommended AI Tools</h2>
                </div>
                <p className="mb-4 text-sm text-[#003057]/70">
                  Use these AI tools to execute and implement this solution.
                </p>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {useCase.aiTools.map((tool) => (
                    <AIToolCard key={tool.id} tool={tool} />
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Impact Metrics */}
            <section className="mb-8 rounded-xl border border-[#003057]/15 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-2">
                <BarChart3 className="h-6 w-6 text-[#B3A369]" />
                <h2 className="text-xl font-extrabold text-[#003057]">Impact & Metrics</h2>
              </div>
              <div className="mb-6">
                <p className="mb-3 text-sm font-semibold text-[#003057]">Key Metrics:</p>
                <ul className="space-y-2">
                  {useCase.impact.metrics.map((metric, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <TrendingUp className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-600" />
                      <span className="text-sm text-[#003057]/80">{metric}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="mb-3 text-sm font-semibold text-[#003057]">Benefits:</p>
                <ul className="space-y-2">
                  {useCase.impact.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#B3A369]" />
                      <span className="text-sm text-[#003057]/80">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            {/* Tags */}
            <section className="mb-8 rounded-xl border border-[#003057]/15 bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-lg font-extrabold text-[#003057]">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {useCase.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-[#B3A369]/15 px-3 py-1 text-xs font-semibold text-[#003057]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </section>

            {/* CTA */}
            <section className="rounded-xl border border-[#003057]/15 bg-gradient-to-br from-[#003057] to-[#022d52] p-6 text-white shadow-sm">
              <h3 className="mb-2 text-lg font-extrabold">Ready to implement?</h3>
              <p className="mb-4 text-sm text-white/80">
                Get started with this solution or book a demo to learn more.
              </p>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => {
                    // Track click
                    fetch("/api/use-cases/analytics", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ useCaseId: useCase.id, action: "cta_click" }),
                    }).catch(() => {});
                    // Navigate or show modal
                    alert("Contact us to implement this solution!");
                  }}
                  className="rounded-md bg-[#B3A369] px-4 py-2 text-sm font-semibold text-[#003057] transition-colors hover:bg-[#B3A369]/90"
                >
                  Try Solution
                </button>
                <button
                  onClick={() => {
                    fetch("/api/use-cases/analytics", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ useCaseId: useCase.id, action: "demo_click" }),
                    }).catch(() => {});
                    alert("Book a demo to learn more!");
                  }}
                  className="rounded-md border border-white/30 bg-transparent px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-white/10"
                >
                  Book Demo
                </button>
              </div>
            </section>
          </div>
        </div>

        {/* Related Use Cases */}
        {relatedUseCases.length > 0 && (
          <section className="mt-12">
            <h2 className="mb-6 text-2xl font-extrabold text-[#003057]">Related Use Cases</h2>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {relatedUseCases.map((uc) => (
                <UseCaseCard key={uc.id} useCase={uc} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

