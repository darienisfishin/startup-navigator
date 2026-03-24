import type { Metadata } from "next";
import Link from "next/link";
import ScrollReveal from "@/components/ScrollReveal";
import { PRICING_TIERS } from "@/lib/pricing";
import PricingCard from "@/components/PricingCard";

export const metadata: Metadata = {
  title: "Pricing — LaunchWise",
  description:
    "Simple, one-time pricing. Get a complete AI-powered startup report — no subscriptions, no surprises.",
};

export default function PricingPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary-50 via-white to-white">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary-100 rounded-full blur-3xl opacity-60" />
          <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-accent-100 rounded-full blur-3xl opacity-40" />
        </div>
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-20 pb-12 text-center">
          <ScrollReveal>
            <span className="inline-block px-3 py-1 rounded-full bg-primary-100 text-primary-700 text-xs font-semibold uppercase tracking-wider mb-4">
              Simple Pricing
            </span>
            <h1 className="text-4xl sm:text-5xl font-bold leading-tight tracking-tight text-primary-900">
              One plan. One payment.{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-accent-500">
                Your whole roadmap.
              </span>
            </h1>
            <p className="mt-5 text-lg text-text-muted leading-relaxed max-w-xl mx-auto">
              No subscriptions. No monthly fees. Pay once, get your personalized
              startup report — and keep it forever.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Pricing cards */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 items-stretch">
            {PRICING_TIERS.map((tier, i) => (
              <ScrollReveal key={tier.id} delay={i * 100}>
                <PricingCard tier={tier} />
              </ScrollReveal>
            ))}
          </div>

          {/* Trust signals */}
          <ScrollReveal delay={200}>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-sm text-text-muted">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Secure checkout via BUILDR
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Instant report delivery
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                No account required
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* FAQ / reassurance */}
      <section className="py-16 sm:py-20 bg-surface">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <h2 className="text-2xl sm:text-3xl font-bold text-primary-900 text-center mb-10">
              Common questions
            </h2>
          </ScrollReveal>
          <div className="space-y-6">
            {[
              {
                q: "What exactly do I get?",
                a: "A full AI-powered startup report covering viability scoring, competitor analysis, local licensing requirements, brand feedback, a step-by-step roadmap, and a 90-day action plan — tailored to your specific idea and location.",
              },
              {
                q: "Is this a subscription?",
                a: "No. Both tiers are one-time payments. Pay once, keep your report forever.",
              },
              {
                q: "How is Pro different from Starter?",
                a: "Pro goes deeper on competitors (10+), adds financial assumptions, a go-to-market strategy, risk assessment, and lets you re-run the analysis as many times as you need.",
              },
              {
                q: "How fast will I get my report?",
                a: "Most reports are ready in under 5 minutes after you complete the intake form.",
              },
            ].map((item, i) => (
              <ScrollReveal key={i} delay={i * 60}>
                <div className="bg-white rounded-2xl border border-border p-6">
                  <h3 className="text-base font-bold text-primary-900 mb-2">{item.q}</h3>
                  <p className="text-sm text-text-muted leading-relaxed">{item.a}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-16 bg-white">
        <div className="max-w-xl mx-auto px-4 text-center">
          <ScrollReveal>
            <h2 className="text-2xl sm:text-3xl font-bold text-primary-900">
              Not ready to pay yet?
            </h2>
            <p className="mt-3 text-text-muted">
              Try the free version first — no credit card required.
            </p>
            <Link
              href="/start"
              className="mt-7 inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-primary-600 text-white font-semibold hover:bg-primary-700 transition-colors shadow-lg shadow-primary-200"
            >
              Get Started Free
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
