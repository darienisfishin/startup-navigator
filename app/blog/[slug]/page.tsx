import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getAllPosts, getPostBySlug } from "@/lib/blog";

// ---------------------------------------------------------------------------
// MDX component overrides — plain styling wrappers (no "use client" needed)
// ---------------------------------------------------------------------------
const mdxComponents = {
  h1: (props: React.ComponentProps<"h1">) => (
    <h1
      className="text-3xl font-bold text-primary-900 mb-4 mt-8 leading-tight"
      {...props}
    />
  ),
  h2: (props: React.ComponentProps<"h2">) => (
    <h2
      className="text-2xl font-bold text-primary-900 mb-3 mt-10 pb-2 border-b border-gray-100 leading-tight"
      {...props}
    />
  ),
  h3: (props: React.ComponentProps<"h3">) => (
    <h3
      className="text-xl font-semibold text-primary-900 mb-2 mt-6 leading-tight"
      {...props}
    />
  ),
  h4: (props: React.ComponentProps<"h4">) => (
    <h4
      className="text-lg font-semibold text-primary-900 mb-2 mt-4"
      {...props}
    />
  ),
  p: (props: React.ComponentProps<"p">) => (
    <p className="text-[#374151] leading-[1.8] mb-5 text-[1.05rem]" {...props} />
  ),
  ul: (props: React.ComponentProps<"ul">) => (
    <ul className="space-y-2 mb-5 text-[#374151] pl-6 list-disc" {...props} />
  ),
  ol: (props: React.ComponentProps<"ol">) => (
    <ol
      className="space-y-2 mb-5 text-[#374151] pl-6 list-decimal"
      {...props}
    />
  ),
  li: (props: React.ComponentProps<"li">) => (
    <li className="leading-relaxed" {...props} />
  ),
  strong: (props: React.ComponentProps<"strong">) => (
    <strong className="font-semibold text-primary-900" {...props} />
  ),
  em: (props: React.ComponentProps<"em">) => (
    <em className="italic text-text-muted" {...props} />
  ),
  a: (props: React.ComponentProps<"a">) => (
    <a
      className="text-primary-600 hover:text-primary-700 underline underline-offset-2 transition-colors"
      {...props}
    />
  ),
  blockquote: (props: React.ComponentProps<"blockquote">) => (
    <blockquote
      className="border-l-4 border-primary-300 pl-5 py-1 italic text-text-muted my-6 bg-primary-50 rounded-r-lg pr-4"
      {...props}
    />
  ),
  code: (props: React.ComponentProps<"code">) => (
    <code
      className="bg-gray-100 px-1.5 py-0.5 rounded text-sm font-mono text-primary-700"
      {...props}
    />
  ),
  pre: (props: React.ComponentProps<"pre">) => (
    <pre
      className="bg-primary-900 text-primary-100 p-5 rounded-xl overflow-x-auto my-6 text-sm leading-relaxed"
      {...props}
    />
  ),
  hr: () => <hr className="border-gray-200 my-10" />,
  table: (props: React.ComponentProps<"table">) => (
    <div className="overflow-x-auto my-6">
      <table
        className="w-full border-collapse text-sm text-[#374151]"
        {...props}
      />
    </div>
  ),
  th: (props: React.ComponentProps<"th">) => (
    <th
      className="border border-gray-200 bg-gray-50 px-4 py-2 text-left font-semibold text-primary-900"
      {...props}
    />
  ),
  td: (props: React.ComponentProps<"td">) => (
    <td className="border border-gray-200 px-4 py-2" {...props} />
  ),
};

// ---------------------------------------------------------------------------
// Static params
// ---------------------------------------------------------------------------
export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

// ---------------------------------------------------------------------------
// Metadata
// ---------------------------------------------------------------------------
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return { title: "Post Not Found — LaunchPilot" };
  }

  return {
    title: `${post.title} — LaunchPilot`,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      url: `https://www.launch-pilot.com/blog/${post.slug}`,
      publishedTime: post.date,
      authors: [post.author],
      tags: post.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
    },
    alternates: {
      canonical: `https://www.launch-pilot.com/blog/${post.slug}`,
    },
  };
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------
export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) notFound();

  const allPosts = getAllPosts();
  const relatedPosts = allPosts
    .filter(
      (p) =>
        p.slug !== post.slug &&
        p.tags.some((t) => post.tags.includes(t))
    )
    .slice(0, 3);

  const formattedDate = new Date(post.date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const postUrl = `https://www.launch-pilot.com/blog/${post.slug}`;

  // JSON-LD Article schema
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.date,
    author: {
      "@type": "Organization",
      name: post.author,
      url: "https://www.launch-pilot.com",
    },
    publisher: {
      "@type": "Organization",
      name: "LaunchPilot",
      url: "https://www.launch-pilot.com",
      logo: {
        "@type": "ImageObject",
        url: "https://www.launch-pilot.com/og-image.png",
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": postUrl,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="min-h-screen bg-[#faf9f7]">
        {/* Article header */}
        <header className="bg-white border-b border-gray-100">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-text-muted mb-6">
              <Link
                href="/blog"
                className="hover:text-primary-600 transition-colors"
              >
                Blog
              </Link>
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
              <span className="truncate max-w-[200px]">{post.title}</span>
            </nav>

            {/* Tags */}
            {post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
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

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary-900 mb-5 leading-tight tracking-tight">
              {post.title}
            </h1>

            <p className="text-lg text-text-muted leading-relaxed mb-6">
              {post.description}
            </p>

            {/* Meta row */}
            <div className="flex items-center flex-wrap gap-x-4 gap-y-2 text-sm text-text-muted border-t border-gray-100 pt-5">
              <span className="font-medium text-text">{post.author}</span>
              <span aria-hidden="true">·</span>
              <time dateTime={post.date}>{formattedDate}</time>
              <span aria-hidden="true">·</span>
              <span>{post.readingTime} min read</span>
            </div>
          </div>
        </header>

        {/* Article body */}
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <article className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-10 mb-10">
            <MDXRemote source={post.content} components={mdxComponents} />
          </article>

          {/* Social sharing */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-10">
            <p className="text-sm font-semibold text-text mb-3">
              Share this article
            </p>
            <div className="flex items-center gap-3">
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(postUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#1DA1F2] text-white text-sm font-medium hover:bg-[#1a8fd1] transition-colors"
                aria-label="Share on X (Twitter)"
              >
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
                Share on X
              </a>
              <a
                href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(postUrl)}&title=${encodeURIComponent(post.title)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#0A66C2] text-white text-sm font-medium hover:bg-[#0958a8] transition-colors"
                aria-label="Share on LinkedIn"
              >
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
                Share on LinkedIn
              </a>
            </div>
          </div>

          {/* Related posts */}
          {relatedPosts.length > 0 && (
            <section className="mb-10">
              <h2 className="text-xl font-bold text-primary-900 mb-4">
                Related Articles
              </h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {relatedPosts.map((related) => (
                  <Link
                    key={related.slug}
                    href={`/blog/${related.slug}`}
                    className="bg-white rounded-xl border border-gray-100 p-5 card-hover group block"
                  >
                    {related.tags.length > 0 && (
                      <span className="inline-block px-2 py-0.5 text-xs font-medium rounded-full bg-primary-50 text-primary-600 border border-primary-100 mb-2">
                        {related.tags[0]}
                      </span>
                    )}
                    <h3 className="text-sm font-semibold text-primary-900 leading-snug mb-1 group-hover:text-primary-600 transition-colors">
                      {related.title}
                    </h3>
                    <p className="text-xs text-text-muted">
                      {related.readingTime} min read
                    </p>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* CTA */}
          <div className="bg-gradient-to-br from-primary-600 to-primary-700 rounded-2xl p-8 sm:p-10 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
              Turn Your Idea Into a Launch Plan
            </h2>
            <p className="text-primary-100 mb-6 max-w-lg mx-auto leading-relaxed">
              LaunchPilot analyzes your specific business idea and location to
              generate a personalized startup roadmap — licensing requirements,
              competitor analysis, viability score, and 90-day action plan.
            </p>
            <Link
              href="/start"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-primary-700 font-semibold hover:bg-primary-50 transition-colors"
            >
              Start My Free Plan
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
        </div>
      </div>
    </>
  );
}
