import Link from "next/link";
import ScrollReveal from "@/components/ScrollReveal";

const FEATURES = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
    title: "Idea Analysis",
    description: "Find out if your idea has legs — market demand, competition, and profit potential scored clearly.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
      </svg>
    ),
    title: "Step-by-Step Roadmap",
    description: "A personalized checklist in the right order so you never miss a critical step.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    title: "Local Requirements",
    description: "Licensing, registration, and tax guidance specific to your city and state.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    ),
    title: "Competitor Snapshot",
    description: "See who you're up against and where you can stand out.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
      </svg>
    ),
    title: "Brand Critique",
    description: "Honest feedback on your name and logo — including print and production readiness.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    title: "90-Day Plan",
    description: "Week-by-week action plan so you know exactly what to tackle first.",
  },
];

const STEPS = [
  {
    num: "1",
    title: "Tell Us Your Idea",
    description: "Answer a few simple questions about what you want to build and where.",
  },
  {
    num: "2",
    title: "AI Does the Research",
    description: "We check competitors, local rules, and score your brand — all in minutes.",
  },
  {
    num: "3",
    title: "Get Your Plan",
    description: "A clear, actionable roadmap with everything you need to get started.",
  },
];

export default function HomePage() {
  return (
    <>
      {/* Hero — clean & warm */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary-50 via-white to-white">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary-100 rounded-full blur-3xl opacity-60" />
          <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-accent-100 rounded-full blur-3xl opacity-40" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-24 pb-20 sm:pb-28 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-tight text-primary-900 animate-fade-in-up">
            Your business idea deserves a{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-accent-500">
              real plan
            </span>
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-text-muted leading-relaxed max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
            Answer a few questions about your idea and get a personalized startup
            roadmap — competitors, local requirements, branding feedback, and a
            90-day action plan.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            <Link
              href="/start"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-primary-600 text-white text-lg font-semibold hover:bg-primary-700 transition-colors shadow-lg shadow-primary-200"
            >
              Get Started — It&apos;s Free
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <Link
              href="/#how-it-works"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl border border-border text-text-muted text-lg font-medium hover:bg-surface transition-colors"
            >
              See How It Works
            </Link>
          </div>
          <p className="mt-5 text-sm text-text-muted">
            No account needed. Takes about 5 minutes.
          </p>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-20 sm:py-24 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="text-center mb-14">
              <h2 className="text-3xl sm:text-4xl font-bold text-primary-900">
                How It Works
              </h2>
              <p className="mt-3 text-text-muted max-w-lg mx-auto">
                Three steps from idea to action plan.
              </p>
            </div>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-10">
            {STEPS.map((step, i) => (
              <ScrollReveal key={step.num} delay={i * 100}>
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-primary-100 text-primary-600 text-xl font-bold mb-4">
                    {step.num}
                  </div>
                  <h3 className="text-lg font-bold text-primary-900 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-text-muted text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 sm:py-24 bg-surface">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="text-center mb-14">
              <h2 className="text-3xl sm:text-4xl font-bold text-primary-900">
                What You&apos;ll Get
              </h2>
              <p className="mt-3 text-text-muted max-w-lg mx-auto">
                Your personalized report covers every critical area.
              </p>
            </div>
          </ScrollReveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((feature, i) => (
              <ScrollReveal key={feature.title} delay={i * 60}>
                <div className="bg-white rounded-2xl p-6 border border-border h-full">
                  <div className="w-10 h-10 rounded-xl bg-primary-50 text-primary-500 flex items-center justify-center mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-base font-bold text-primary-900 mb-1.5">
                    {feature.title}
                  </h3>
                  <p className="text-text-muted text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-white">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <ScrollReveal>
            <h2 className="text-3xl sm:text-4xl font-bold text-primary-900">
              Ready to see if your idea can work?
            </h2>
            <p className="mt-4 text-text-muted">
              Stop googling. Get a real plan in minutes.
            </p>
            <Link
              href="/start"
              className="mt-8 inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-primary-600 text-white text-lg font-semibold hover:bg-primary-700 transition-colors shadow-lg shadow-primary-200"
            >
              Start My Plan
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
