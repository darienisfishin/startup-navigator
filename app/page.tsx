import Link from "next/link";
import ScrollReveal from "@/components/ScrollReveal";
import SampleReport from "@/components/SampleReport";

const FEATURES = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
    title: "Viability Score",
    description: "Your idea scored 0–100 on market demand, competition, pricing feasibility, and differentiation. Know exactly where you stand before you spend a dime.",
    bg: "bg-primary-50",
    text: "text-primary-600",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
      </svg>
    ),
    title: "Step-by-Step Checklist",
    description: "Register your LLC, get your EIN, apply for permits — every step in the right order for your state. No more Googling at 2am.",
    bg: "bg-green-50",
    text: "text-green-600",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    title: "Local Requirements",
    description: "Licenses, registrations, tax filings, and zoning rules for YOUR city and state. Not generic advice — real, location-specific guidance.",
    bg: "bg-accent-50",
    text: "text-accent-600",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    ),
    title: "Competitive Landscape",
    description: "Who you're up against, how saturated the market is, and the gaps you can exploit. Position yourself to win from day one.",
    bg: "bg-purple-50",
    text: "text-purple-600",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
      </svg>
    ),
    title: "Brand Critique",
    description: "Your business name scored on memorability, clarity, and uniqueness. Logo checked for signs, shirts, and screens. First impressions matter.",
    bg: "bg-pink-50",
    text: "text-pink-600",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    title: "90-Day Action Plan",
    description: "Week-by-week breakdown of exactly what to do for your first 3 months. No guesswork. No overwhelm. Just clear next steps.",
    bg: "bg-cyan-50",
    text: "text-cyan-600",
  },
];

const STEPS = [
  {
    num: "1",
    title: "Tell Us Your Idea",
    description: "Business name, industry, target city, and what makes you different. Takes about 3 minutes.",
    emoji: "💡",
  },
  {
    num: "2",
    title: "AI Does the Heavy Lifting",
    description: "8 specialized AI modules analyze your market, competition, licensing, brand, and more — all at once.",
    emoji: "⚡",
  },
  {
    num: "3",
    title: "Get Your Launch Plan",
    description: "A personalized, scored, step-by-step report delivered in under 2 minutes. Ready to act on immediately.",
    emoji: "🚀",
  },
];

export default function HomePage() {
  return (
    <>
      {/* ─── 1. HERO ─── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-24 -right-24 w-[500px] h-[500px] bg-primary-500 rounded-full blur-[120px] opacity-30 animate-float" />
          <div className="absolute -bottom-32 -left-32 w-[400px] h-[400px] bg-accent-500 rounded-full blur-[120px] opacity-20" style={{ animationDelay: "1.5s" }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-400 rounded-full blur-[150px] opacity-10" />
        </div>
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-24 pb-16 sm:pb-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-sm text-white/90 mb-6 animate-fade-in-up backdrop-blur-sm">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                Trusted by entrepreneurs in all 50 states
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.1] tracking-tight text-white animate-fade-in-up">
                Stop dreaming.{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-300 via-accent-400 to-accent-300 animate-gradient">
                  Start launching.
                </span>
              </h1>
              <p className="mt-6 text-lg sm:text-xl text-white/80 leading-relaxed max-w-xl animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
                Get a <strong className="text-white">personalized startup roadmap</strong> in under 5 minutes — viability score, local licensing, market analysis, brand critique, and a 90-day action plan. <strong className="text-white">Everything you need to go from idea to action.</strong>
              </p>
              <div className="mt-8 flex flex-col sm:flex-row items-center lg:items-start gap-3 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
                <Link
                  href="/start"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-accent-500 to-accent-600 text-white text-lg font-bold hover:from-accent-600 hover:to-accent-700 transition-all shadow-xl shadow-accent-500/25 animate-pulse-glow"
                >
                  Start My Plan — It&apos;s Fast
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
                <Link
                  href="/#sample"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl border border-white/20 text-white text-lg font-medium hover:bg-white/10 transition-colors backdrop-blur-sm"
                >
                  See Sample Report
                </Link>
              </div>
              <div className="mt-6 flex items-center justify-center lg:justify-start gap-6 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
                <div className="flex items-center gap-2 text-sm text-white/70">
                  <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  No account needed
                </div>
                <div className="flex items-center gap-2 text-sm text-white/70">
                  <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  Results in minutes
                </div>
              </div>
            </div>
            <div className="hidden lg:block animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
              <div className="bg-white/95 backdrop-blur-sm rounded-2xl border border-white/20 shadow-2xl p-6 transform rotate-1 hover:rotate-0 transition-transform">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-xs font-semibold text-green-700">Analysis Complete</span>
                </div>
                <div className="flex items-center gap-4 mb-4">
                  <div className="relative w-16 h-16 flex-shrink-0">
                    <svg width="64" height="64" className="-rotate-90">
                      <circle cx="32" cy="32" r="26" stroke="#e2e8f0" strokeWidth="6" fill="none" />
                      <circle cx="32" cy="32" r="26" stroke="#22c55e" strokeWidth="6" fill="none" strokeLinecap="round" strokeDasharray="163.36" strokeDashoffset="31" />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-sm font-bold text-green-600">81%</span>
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-bold text-primary-900">Sunny Side Bakery</div>
                    <div className="text-xs text-text-muted">Bakery &middot; Birmingham, AL</div>
                  </div>
                </div>
                <div className="space-y-2">
                  {[
                    { label: "Local Demand", value: 78, color: "#22c55e" },
                    { label: "Differentiation", value: 85, color: "#6366f1" },
                    { label: "Competition", value: 62, color: "#f97316" },
                  ].map((item) => (
                    <div key={item.label}>
                      <div className="flex justify-between text-xs mb-0.5">
                        <span className="text-text-muted">{item.label}</span>
                        <span className="font-semibold">{item.value}%</span>
                      </div>
                      <div className="h-1.5 bg-gray-100 rounded-full">
                        <div className="h-full rounded-full" style={{ width: `${item.value}%`, backgroundColor: item.color }} />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-3 border-t border-gray-100">
                  <div className="text-xs font-semibold text-primary-800 mb-1.5">Next Steps</div>
                  <div className="space-y-1">
                    {["Register LLC in Alabama", "Apply for food service permit", "Get EIN from IRS"].map((s, i) => (
                      <div key={i} className="flex items-center gap-1.5 text-xs text-text-muted">
                        <div className="w-4 h-4 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center text-[10px] font-bold flex-shrink-0">{i + 1}</div>
                        {s}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" className="w-full h-auto">
            <path d="M0 60V30C360 0 1080 60 1440 30V60H0Z" fill="white" />
          </svg>
        </div>
      </section>

      {/* ─── 2. SOCIAL PROOF BAR ─── */}
      <section className="py-8 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
            {[
              { stat: "All 50", label: "States Covered", icon: "🇺🇸" },
              { stat: "< 5 min", label: "To Complete", icon: "⚡" },
              { stat: "8", label: "AI Modules", icon: "🤖" },
              { stat: "$9.99", label: "Starting Price", icon: "💰" },
            ].map((item) => (
              <div key={item.label} className="flex flex-col items-center">
                <span className="text-2xl mb-1">{item.icon}</span>
                <span className="text-xl sm:text-2xl font-extrabold text-primary-900">{item.stat}</span>
                <span className="text-xs text-text-muted font-medium">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 3. VALUE PROP BANNER ─── */}
      <section className="py-4 bg-gradient-to-r from-primary-600 via-primary-500 to-accent-500">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-white font-semibold text-sm sm:text-base">
            Most new businesses fail because they skip the planning phase. <strong>Don&apos;t be most businesses.</strong>
          </p>
        </div>
      </section>

      {/* ─── 4. HOW IT WORKS ─── */}
      <section id="how-it-works" className="py-20 sm:py-24 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="text-center mb-14">
              <span className="inline-block px-4 py-1.5 rounded-full bg-primary-50 text-primary-600 text-sm font-semibold mb-4">
                Simple 3-Step Process
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-primary-900">
                From Idea to Action Plan in Minutes
              </h2>
              <p className="mt-3 text-text-muted max-w-lg mx-auto text-lg">
                No research. No guesswork. Just answers.
              </p>
            </div>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-10">
            {STEPS.map((step, i) => (
              <ScrollReveal key={step.num} delay={i * 100}>
                <div className="text-center relative">
                  {i < STEPS.length - 1 && (
                    <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-[2px] bg-gradient-to-r from-primary-200 to-transparent" />
                  )}
                  <div className="text-4xl mb-3">{step.emoji}</div>
                  <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 text-white text-sm font-bold mb-4 shadow-lg shadow-primary-200">
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

      {/* ─── 5. FEATURES (what's in your report) ─── */}
      <section id="features" className="py-20 sm:py-24 bg-surface">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="text-center mb-14">
              <span className="inline-block px-4 py-1.5 rounded-full bg-accent-50 text-accent-600 text-sm font-semibold mb-4">
                Packed With Insights
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-primary-900">
                Everything You Need to Launch With Confidence
              </h2>
              <p className="mt-3 text-text-muted max-w-2xl mx-auto text-lg">
                Every section is personalized to your idea, industry, and location. This isn&apos;t generic advice — it&apos;s <strong className="text-primary-900">your plan</strong>.
              </p>
            </div>
          </ScrollReveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((feature, i) => (
              <ScrollReveal key={feature.title} delay={i * 60}>
                <div className="bg-white rounded-2xl p-6 border border-border h-full hover:shadow-lg hover:-translate-y-1 transition-all duration-200 group">
                  <div className={`w-11 h-11 rounded-xl ${feature.bg} ${feature.text} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
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

      {/* ─── 6. PRICING (moved up — strike while desire is hot) ─── */}
      <section id="pricing" className="py-20 sm:py-24 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="text-center mb-14">
              <span className="inline-block px-4 py-1.5 rounded-full bg-green-50 text-green-600 text-sm font-semibold mb-4">
                Invest in Your Idea
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-primary-900">
                Less Than Lunch. More Than a Consultant.
              </h2>
              <p className="mt-3 text-text-muted max-w-lg mx-auto text-lg">
                One questionnaire. One payment. Your personalized launch plan — <strong className="text-primary-900">delivered instantly.</strong>
              </p>
            </div>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {/* Starter */}
            <ScrollReveal>
              <div className="bg-white rounded-2xl border border-border p-8 h-full flex flex-col hover:shadow-lg transition-shadow">
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-primary-900">Starter Report</h3>
                  <p className="text-sm text-text-muted mt-1">Perfect for a quick gut check</p>
                </div>
                <div className="mb-6">
                  <span className="text-4xl font-extrabold text-primary-900">$9.99</span>
                  <span className="text-text-muted text-sm ml-1">one-time</span>
                </div>
                <ul className="space-y-3 mb-8 flex-1">
                  {[
                    { text: "Viability score (0–100)", highlight: true },
                    { text: "Top 5 action steps", highlight: true },
                    { text: "Idea analysis summary", highlight: false },
                    { text: "Market landscape overview", highlight: false },
                  ].map((item) => (
                    <li key={item.text} className="flex items-start gap-2.5 text-sm">
                      <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className={item.highlight ? "font-semibold text-primary-900" : "text-text"}>
                        {item.text}
                      </span>
                    </li>
                  ))}
                </ul>
                <a
                  href="https://launchpilot.buildr.bet/checkout/afc5afd9-6080-4967-a2df-33a2e10219a1"
                  className="block w-full text-center px-6 py-3.5 rounded-xl border-2 border-primary-600 text-primary-600 font-bold hover:bg-primary-50 transition-colors"
                >
                  Get Starter Report
                </a>
              </div>
            </ScrollReveal>

            {/* Full Report */}
            <ScrollReveal delay={100}>
              <div className="bg-white rounded-2xl border-2 border-primary-500 p-8 h-full flex flex-col relative shadow-xl shadow-primary-100">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-primary-500 to-accent-500 text-white text-xs font-bold shadow-md">
                  Most Popular
                </div>
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-primary-900">Full Report</h3>
                  <p className="text-sm text-text-muted mt-1">Your complete startup launch playbook</p>
                </div>
                <div className="mb-6">
                  <span className="text-4xl font-extrabold text-primary-900">$24.99</span>
                  <span className="text-text-muted text-sm ml-1">one-time</span>
                  <div className="mt-1">
                    <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">Save vs $2,000+ consultant</span>
                  </div>
                </div>
                <ul className="space-y-3 mb-8 flex-1">
                  {[
                    { text: "Everything in Starter", highlight: false },
                    { text: "90-day week-by-week plan", highlight: true },
                    { text: "Local licensing checklist", highlight: true },
                    { text: "Full competitive landscape", highlight: true },
                    { text: "Brand name & logo critique", highlight: false },
                    { text: "Partner tool recommendations", highlight: false },
                    { text: "VIP Founders Community access", highlight: true },
                    { text: "Email delivery + PDF export", highlight: false },
                  ].map((item) => (
                    <li key={item.text} className="flex items-start gap-2.5 text-sm">
                      <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className={item.highlight ? "font-semibold text-primary-900" : "text-text"}>
                        {item.text}
                      </span>
                    </li>
                  ))}
                </ul>
                <a
                  href="https://launchpilot.buildr.bet/checkout/4adcea4b-dacf-40ac-b04e-051449a9c6cb"
                  className="block w-full text-center px-6 py-3.5 rounded-xl bg-gradient-to-r from-primary-600 to-accent-500 text-white font-bold hover:from-primary-700 hover:to-accent-600 transition-all shadow-lg shadow-primary-200"
                >
                  Get Full Report
                </a>
              </div>
            </ScrollReveal>
          </div>
          <ScrollReveal delay={200}>
            <p className="text-center text-sm text-text-muted mt-8">
              🔒 Secure checkout. Your idea stays private. No subscriptions, no hidden fees.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* ─── 7. SAMPLE REPORT (proof for those who need convincing) ─── */}
      <section id="sample" className="py-20 sm:py-24 bg-surface">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="text-center mb-10">
              <span className="inline-block px-4 py-1.5 rounded-full bg-green-50 text-green-600 text-sm font-semibold mb-4">
                Real Example
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-primary-900">
                Still Not Sure? See Exactly What You&apos;ll Get
              </h2>
              <p className="mt-3 text-text-muted max-w-lg mx-auto text-lg">
                Here&apos;s a real sample report for a bakery in Birmingham, Alabama. <strong className="text-primary-900">Yours will be just as detailed.</strong>
              </p>
            </div>
          </ScrollReveal>
          <SampleReport />
          <ScrollReveal delay={200}>
            <div className="text-center mt-10">
              <Link
                href="/start"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-primary-600 to-primary-700 text-white text-lg font-bold hover:from-primary-700 hover:to-primary-800 transition-all shadow-lg shadow-primary-200"
              >
                Build My Report
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <p className="mt-3 text-sm text-text-muted">Your report will be personalized to your specific idea and location</p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ─── 8. COMPARISON TABLE (overcome objections) ─── */}
      <section className="py-20 sm:py-24 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="text-center mb-14">
              <span className="inline-block px-4 py-1.5 rounded-full bg-red-50 text-red-600 text-sm font-semibold mb-4">
                The Real Comparison
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-primary-900">
                Why Not Just Use ChatGPT?
              </h2>
              <p className="mt-3 text-text-muted max-w-lg mx-auto text-lg">
                Spoiler: ChatGPT gives you a wall of generic text. <strong className="text-primary-900">LaunchPilot gives you a plan.</strong>
              </p>
            </div>
          </ScrollReveal>
          <ScrollReveal>
            <div className="overflow-x-auto -mx-4 px-4">
              <table className="w-full bg-white rounded-2xl border border-border overflow-hidden shadow-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left p-4 sm:p-5 text-sm font-medium text-text-muted w-[30%]" />
                    <th className="p-4 sm:p-5 text-center">
                      <div className="text-sm text-text-muted font-medium">ChatGPT</div>
                    </th>
                    <th className="p-4 sm:p-5 text-center bg-gradient-to-b from-primary-50 to-primary-100/50">
                      <div className="text-sm font-bold text-primary-600">LaunchPilot</div>
                    </th>
                    <th className="p-4 sm:p-5 text-center">
                      <div className="text-sm text-text-muted font-medium">Consultant</div>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {[
                    { feature: "Personalized to your city & state", chatgpt: false, launchpilot: true, consultant: true },
                    { feature: "Viability score with real metrics", chatgpt: false, launchpilot: true, consultant: "maybe" },
                    { feature: "Local licensing checklist", chatgpt: false, launchpilot: true, consultant: true },
                    { feature: "Competitive landscape analysis", chatgpt: false, launchpilot: true, consultant: true },
                    { feature: "Structured, actionable report", chatgpt: false, launchpilot: true, consultant: true },
                    { feature: "90-day week-by-week plan", chatgpt: false, launchpilot: true, consultant: "maybe" },
                    { feature: "Brand name & logo critique", chatgpt: false, launchpilot: true, consultant: "maybe" },
                    { feature: "Ready in under 5 minutes", chatgpt: true, launchpilot: true, consultant: false },
                    { feature: "Cost", chatgpt: "$20/mo", launchpilot: "$9.99", consultant: "$2,000+" },
                  ].map((row) => (
                    <tr key={row.feature} className="hover:bg-gray-50/50 transition-colors">
                      <td className="p-4 sm:p-5 text-sm font-medium text-primary-900">{row.feature}</td>
                      <td className="p-4 sm:p-5 text-center">
                        {row.chatgpt === true ? (
                          <svg className="w-5 h-5 text-green-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                        ) : row.chatgpt === false ? (
                          <svg className="w-5 h-5 text-red-300 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        ) : (
                          <span className="text-sm text-text-muted">{row.chatgpt}</span>
                        )}
                      </td>
                      <td className="p-4 sm:p-5 text-center bg-gradient-to-b from-primary-50/50 to-primary-100/30">
                        {row.launchpilot === true ? (
                          <svg className="w-5 h-5 text-green-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                        ) : (
                          <span className="text-sm font-bold text-primary-600">{row.launchpilot}</span>
                        )}
                      </td>
                      <td className="p-4 sm:p-5 text-center">
                        {row.consultant === true ? (
                          <svg className="w-5 h-5 text-green-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                        ) : row.consultant === false ? (
                          <svg className="w-5 h-5 text-red-300 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        ) : row.consultant === "maybe" ? (
                          <span className="text-xs text-text-muted">Varies</span>
                        ) : (
                          <span className="text-sm text-text-muted">{row.consultant}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="text-center mt-8 p-6 rounded-2xl bg-gradient-to-r from-primary-50 to-accent-50 border border-primary-100">
              <p className="text-base font-semibold text-primary-900">
                Get consultant-quality insights for the price of a coffee.
              </p>
              <p className="text-sm text-text-muted mt-1">
                ChatGPT gives you a conversation. A consultant takes weeks. LaunchPilot gives you a structured, localized plan <strong className="text-primary-900">in minutes</strong>.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ─── 9. FOUNDER (trust & credibility) ─── */}
      <section className="py-20 sm:py-24 bg-surface">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="text-center mb-8">
              <span className="inline-block px-4 py-1.5 rounded-full bg-accent-50 text-accent-600 text-sm font-semibold mb-4">
                Built by a Founder, for Founders
              </span>
            </div>
            <div className="bg-white rounded-2xl border border-border shadow-md p-8 sm:p-10">
              <div className="flex flex-col sm:flex-row items-start gap-6">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center flex-shrink-0 text-white text-2xl sm:text-3xl font-bold shadow-lg">
                  DC
                </div>
                <div>
                  <h3 className="text-xl font-bold text-primary-900 mb-1">Built by Darien Craig</h3>
                  <p className="text-sm text-primary-600 font-semibold mb-4">
                    Founder of Y&apos;all Sweet Tea &middot; $20M+ in Revenue &middot; Real Entrepreneur
                  </p>
                  <p className="text-sm text-text-muted leading-relaxed mb-4">
                    The #1 question I get asked is <em className="text-primary-900 font-medium">&ldquo;I have a business idea — how do I actually get started?&rdquo;</em> After answering it hundreds of times, I realized the advice is always the same: validate your idea, check your local requirements, understand your competition, and build a step-by-step plan. So I built a tool that does it all in minutes.
                  </p>
                  <p className="text-sm text-text-muted leading-relaxed">
                    LaunchPilot is the resource I wish I had when I started my first business. It won&apos;t guarantee success — nothing can — but it gives you the <strong className="text-primary-900">structured, honest starting point</strong> that most first-time founders never get.
                  </p>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ─── 10. FAQ (remove final friction) ─── */}
      <section id="faq" className="py-20 sm:py-24 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="text-center mb-14">
              <span className="inline-block px-4 py-1.5 rounded-full bg-primary-50 text-primary-600 text-sm font-semibold mb-4">
                Got Questions?
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-primary-900">
                Frequently Asked Questions
              </h2>
            </div>
          </ScrollReveal>
          <div className="space-y-3">
            {[
              {
                q: "Is this just ChatGPT with a wrapper?",
                a: "Not even close. LaunchPilot runs your idea through 8 specialized AI modules in parallel — each focused on local compliance, market analysis, brand critique, or roadmap generation. The result is a structured, scored report personalized to your exact city, state, and industry. ChatGPT gives you a conversation. We give you a plan you can act on today.",
              },
              {
                q: "How accurate is the licensing information?",
                a: "We provide state and county-level guidance based on your industry and location. Every requirement is tagged with a confidence level (verified, likely, or verify). We always recommend confirming details with your local government offices before filing — this is a planning tool, not legal advice.",
              },
              {
                q: "What if I don't have a business name yet?",
                a: "That's totally fine! The business name field is optional. We'll focus the report on your idea, location, and market. Come back anytime once you've picked a name for the brand critique section.",
              },
              {
                q: "Can I get a refund?",
                a: "Since reports are generated instantly and delivered digitally, we can't offer refunds. But you can preview your viability score and business summary for free before purchasing — so you know exactly what you're getting before you pay.",
              },
              {
                q: "Is my business idea kept private?",
                a: "100%. We don't store your submissions, save your report data, or share your idea with anyone. Your inputs are processed in real time and discarded. Your idea is yours alone.",
              },
              {
                q: "What's the difference between Starter and Full Report?",
                a: "Starter ($9.99) gives you the viability score, idea analysis, top action steps, and market overview — great for a quick gut check. Full Report ($24.99) adds the 90-day week-by-week plan, local licensing checklist, competitive landscape deep-dive, brand critique, partner tool recommendations, and PDF export. Most people go with the Full Report.",
              },
              {
                q: "How long does it take to get my report?",
                a: "The questionnaire takes 3-5 minutes. Your report is generated in under 2 minutes after that. You'll have your complete, personalized launch plan within 10 minutes of starting.",
              },
            ].map((faq, i) => (
              <ScrollReveal key={i} delay={i * 50}>
                <details className="group bg-white rounded-xl border border-border overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <summary className="flex items-center justify-between p-5 cursor-pointer hover:bg-surface transition-colors">
                    <span className="text-sm font-semibold text-primary-900 pr-4">{faq.q}</span>
                    <svg className="w-5 h-5 text-primary-400 flex-shrink-0 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <div className="px-5 pb-5 pt-0">
                    <p className="text-sm text-text-muted leading-relaxed">{faq.a}</p>
                  </div>
                </details>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 11. FINAL CTA (close the deal) ─── */}
      <section className="relative py-20 sm:py-24 overflow-hidden bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-accent-500 rounded-full blur-[120px] opacity-20" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-primary-400 rounded-full blur-[120px] opacity-20" />
        </div>
        <div className="relative max-w-2xl mx-auto px-4 text-center">
          <ScrollReveal>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight">
              Your idea is worth more than a Google search.
            </h2>
            <p className="mt-6 text-lg text-white/80 max-w-xl mx-auto">
              Stop overthinking. Stop Googling. Get a <strong className="text-white">real plan</strong> built for your specific idea, in your specific city, with actionable steps you can start today.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/start"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-accent-500 to-accent-600 text-white text-lg font-bold hover:from-accent-600 hover:to-accent-700 transition-all shadow-xl shadow-accent-500/25"
              >
                Start My Plan Now
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>
            <div className="mt-6 flex items-center justify-center gap-6">
              <span className="flex items-center gap-2 text-sm text-white/70">
                <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                3-minute questionnaire
              </span>
              <span className="flex items-center gap-2 text-sm text-white/70">
                <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                Report in under 2 minutes
              </span>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
