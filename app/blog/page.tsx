import type { Metadata } from "next";
import Link from "next/link";
import { getAllPosts } from "@/lib/blog";
import ScrollReveal from "@/components/ScrollReveal";

export const metadata: Metadata = {
  title: "Blog — LaunchPilot | Startup Tips & Business Guides",
  description:
    "Expert guides for entrepreneurs: how to start a business, validate your idea, understand startup costs, choose a business structure, and launch in 90 days.",
  openGraph: {
    title: "Blog — LaunchPilot | Startup Tips & Business Guides",
    description:
      "Expert guides for entrepreneurs: how to start a business, validate your idea, understand startup costs, and more.",
    type: "website",
    url: "https://www.launch-pilot.com/blog",
  },
  alternates: {
    canonical: "https://www.launch-pilot.com/blog",
  },
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <div className="min-h-screen bg-[#faf9f7]">
      {/* Hero */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-50 border border-primary-100 text-primary-600 text-xs font-semibold uppercase tracking-wide mb-4">
              LaunchPilot Blog
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-primary-900 mb-4 tracking-tight">
              Startup Guides for{" "}
              <span className="gradient-text">Real Entrepreneurs</span>
            </h1>
            <p className="text-lg text-text-muted max-w-2xl leading-relaxed">
              Practical, actionable advice to help you validate your idea,
              navigate legal requirements, and launch your business with
              confidence.
            </p>
          </div>
        </div>
      </section>

      {/* Posts */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {posts.length === 0 ? (
          <p className="text-text-muted text-center py-16">
            No posts yet. Check back soon!
          </p>
        ) : (
          <div className="grid gap-6">
            {posts.map((post, i) => (
              <ScrollReveal key={post.slug} delay={i * 60}>
                <article className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 card-hover">
                  {post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {post.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2.5 py-0.5 text-xs font-medium rounded-full bg-primary-50 text-primary-600 border border-primary-100"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  <Link href={`/blog/${post.slug}`} className="group block">
                    <h2 className="text-xl sm:text-2xl font-bold text-primary-900 mb-2 group-hover:text-primary-600 transition-colors leading-tight">
                      {post.title}
                    </h2>
                  </Link>
                  <p className="text-text-muted mb-5 leading-relaxed">
                    {post.description}
                  </p>
                  <div className="flex items-center justify-between flex-wrap gap-3">
                    <div className="flex items-center gap-2 text-sm text-text-muted">
                      <span className="font-medium">{post.author}</span>
                      <span aria-hidden="true">·</span>
                      <time dateTime={post.date}>
                        {new Date(post.date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </time>
                      <span aria-hidden="true">·</span>
                      <span>{post.readingTime} min read</span>
                    </div>
                    <Link
                      href={`/blog/${post.slug}`}
                      className="inline-flex items-center gap-1 text-sm font-semibold text-primary-600 hover:text-primary-700 transition-colors"
                    >
                      Read more
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </Link>
                  </div>
                </article>
              </ScrollReveal>
            ))}
          </div>
        )}
      </section>

      {/* CTA Banner */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <ScrollReveal>
          <div className="bg-gradient-to-br from-primary-600 to-primary-700 rounded-2xl p-8 sm:p-10 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
              Ready to Launch Your Business?
            </h2>
            <p className="text-primary-100 mb-6 max-w-xl mx-auto leading-relaxed">
              Stop reading and start doing. Get your personalized AI-powered
              startup plan in under 5 minutes.
            </p>
            <Link
              href="/start"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-primary-700 font-semibold hover:bg-primary-50 transition-colors"
            >
              Start My Plan — Free
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          </div>
        </ScrollReveal>
      </section>
    </div>
  );
}
