import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Community — LaunchPilot",
  description:
    "Join the LaunchPilot Founders Community on Discord — connect with entrepreneurs, get feedback on your ideas, and grow together.",
};

const BENEFITS = [
  {
    emoji: "💬",
    title: "Ask Anything, Anytime",
    description:
      "Stuck on a licensing question? Not sure how to price your product? Post it in the community and get answers from founders who've been there.",
  },
  {
    emoji: "🤝",
    title: "Connect With Real Founders",
    description:
      "Network with other startup entrepreneurs across every industry and state. Find co-founders, partners, and people who actually get it.",
  },
  {
    emoji: "📣",
    title: "Get Feedback on Your Idea",
    description:
      "Share your business concept and get honest, constructive feedback from the community before you invest real money.",
  },
  {
    emoji: "🎓",
    title: "Learn From People Ahead of You",
    description:
      "Founders who are 6 months, 1 year, or 5 years ahead share what worked, what didn't, and what they wish they'd known.",
  },
  {
    emoji: "🔥",
    title: "Stay Accountable",
    description:
      "Share your goals, post progress updates, and get encouragement from people who understand the grind of building something from scratch.",
  },
  {
    emoji: "📰",
    title: "Exclusive Resources & Tips",
    description:
      "Get access to founder-only resources, startup templates, tool recommendations, and tips shared directly in the community.",
  },
];

const VIP_PERKS = [
  {
    emoji: "⭐",
    title: "VIP Founders Channel",
    description:
      "Access a private channel for Pro members — deeper discussions, direct Q&A, and a tighter-knit group of serious founders.",
  },
  {
    emoji: "🎯",
    title: "Priority Feedback",
    description:
      "Your questions and idea posts get priority attention from the community and from Darien himself.",
  },
  {
    emoji: "📋",
    title: "Monthly Founder Spotlights",
    description:
      "Get featured in our monthly spotlight — share your story, your progress, and get visibility for your new business.",
  },
  {
    emoji: "🛠️",
    title: "Early Access to New Features",
    description:
      "Be the first to test new LaunchPilot tools, report sections, and features before they go live.",
  },
];

export default function CommunityPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 py-20 sm:py-28">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-24 -right-24 w-[500px] h-[500px] bg-[#5865F2] rounded-full blur-[120px] opacity-20" />
          <div className="absolute -bottom-32 -left-32 w-[400px] h-[400px] bg-accent-500 rounded-full blur-[120px] opacity-15" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-sm text-white/90 mb-6 backdrop-blur-sm">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03z" />
            </svg>
            Join us on Discord
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight">
            Build Your Business.{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-300 to-accent-400">
              Not Alone.
            </span>
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-white/80 leading-relaxed max-w-2xl mx-auto">
            The <strong className="text-white">LaunchPilot Founders Community</strong> is a free Discord server where new entrepreneurs connect, share ideas, ask questions, and grow together. Because starting a business is hard enough — you shouldn&apos;t have to figure it all out by yourself.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            {/* TODO: Replace with real Discord invite link */}
            <a
              href="https://discord.gg/launchpilot"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-[#5865F2] text-white text-lg font-bold hover:bg-[#4752C4] transition-colors shadow-xl"
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03z" />
              </svg>
              Join the Community — Free
            </a>
            <Link
              href="/pricing"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl border border-white/20 text-white text-lg font-medium hover:bg-white/10 transition-colors backdrop-blur-sm"
            >
              Get VIP Access
            </Link>
          </div>
        </div>
      </section>

      {/* What you get */}
      <section className="py-20 sm:py-24 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary-50 text-primary-600 text-sm font-semibold mb-4">
              Free for Everyone
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-primary-900">
              Why Join the LaunchPilot Community?
            </h2>
            <p className="mt-3 text-text-muted max-w-2xl mx-auto text-lg">
              A free Discord community where founders help founders. No gatekeeping. No fluff. Just real people building real businesses.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {BENEFITS.map((benefit) => (
              <div
                key={benefit.title}
                className="bg-white rounded-2xl p-6 border border-border hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
              >
                <div className="text-3xl mb-3">{benefit.emoji}</div>
                <h3 className="text-base font-bold text-primary-900 mb-1.5">
                  {benefit.title}
                </h3>
                <p className="text-text-muted text-sm leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Community channels preview */}
      <section className="py-20 sm:py-24 bg-surface">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="inline-block px-4 py-1.5 rounded-full bg-[#5865F2]/10 text-[#5865F2] text-sm font-semibold mb-4">
              Inside the Server
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-primary-900">
              Channels Built for Founders
            </h2>
            <p className="mt-3 text-text-muted max-w-lg mx-auto text-lg">
              Organized spaces so you can find exactly what you need.
            </p>
          </div>
          <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
            <div className="divide-y divide-border">
              {[
                { channel: "introductions", description: "Introduce yourself and your business idea to the community", icon: "👋" },
                { channel: "idea-feedback", description: "Share your concept and get honest, constructive feedback", icon: "💡" },
                { channel: "general-chat", description: "Talk business, share wins, ask questions — anything goes", icon: "💬" },
                { channel: "licensing-legal", description: "Questions about LLC formation, permits, EINs, and local requirements", icon: "📜" },
                { channel: "marketing-branding", description: "Discuss naming, logos, social media, and getting your first customers", icon: "📣" },
                { channel: "wins-and-milestones", description: "Celebrate your progress — first sale, first customer, first dollar", icon: "🏆" },
                { channel: "resources", description: "Share and discover tools, templates, articles, and courses", icon: "📚" },
                { channel: "accountability-partners", description: "Find a partner to keep you on track with weekly check-ins", icon: "🎯" },
              ].map((ch) => (
                <div key={ch.channel} className="flex items-start gap-4 p-4 hover:bg-surface transition-colors">
                  <span className="text-2xl flex-shrink-0">{ch.icon}</span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-text-muted text-sm">#</span>
                      <span className="text-sm font-semibold text-primary-900">{ch.channel}</span>
                    </div>
                    <p className="text-xs text-text-muted mt-0.5">{ch.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* VIP Access */}
      <section className="py-20 sm:py-24 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="inline-block px-4 py-1.5 rounded-full bg-accent-50 text-accent-600 text-sm font-semibold mb-4">
              Pro Members Only
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-primary-900">
              VIP Founders Access
            </h2>
            <p className="mt-3 text-text-muted max-w-2xl mx-auto text-lg">
              Purchase the <strong className="text-primary-900">Pro ($29)</strong> and unlock exclusive VIP perks in the community. It&apos;s like going from the lobby to the boardroom.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {VIP_PERKS.map((perk) => (
              <div
                key={perk.title}
                className="bg-gradient-to-br from-white to-accent-50/30 rounded-2xl p-6 border border-accent-200 hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
              >
                <div className="text-3xl mb-3">{perk.emoji}</div>
                <h3 className="text-base font-bold text-primary-900 mb-1.5">
                  {perk.title}
                </h3>
                <p className="text-text-muted text-sm leading-relaxed">
                  {perk.description}
                </p>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <a
              href="https://launchpilot.buildr.bet/checkout/4adcea4b-dacf-40ac-b04e-051449a9c6cb"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-primary-600 to-accent-500 text-white text-lg font-bold hover:from-primary-700 hover:to-accent-600 transition-all shadow-lg shadow-primary-200"
            >
              Get Full Report + VIP Access
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </a>
            <p className="mt-3 text-sm text-text-muted">
              One-time payment. Lifetime community access.
            </p>
          </div>
        </div>
      </section>

      {/* Who's it for */}
      <section className="py-20 sm:py-24 bg-surface">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-primary-900">
              This Community Is For You If...
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl mx-auto">
            {[
              "You have a business idea but don't know where to start",
              "You're in the early stages and want honest feedback",
              "You're tired of figuring everything out alone",
              "You want to connect with other first-time founders",
              "You need help with licensing, naming, or marketing",
              "You want accountability to actually follow through",
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-white border border-border">
                <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-sm font-medium text-primary-900">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative py-20 sm:py-24 overflow-hidden bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#5865F2] rounded-full blur-[120px] opacity-20" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-accent-500 rounded-full blur-[120px] opacity-15" />
        </div>
        <div className="relative max-w-2xl mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight">
            Your next business partner might be one message away.
          </h2>
          <p className="mt-6 text-lg text-white/80 max-w-xl mx-auto">
            Join hundreds of entrepreneurs who are building their businesses together. The community is free. The connections are priceless.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            {/* TODO: Replace with real Discord invite link */}
            <a
              href="https://discord.gg/launchpilot"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-[#5865F2] text-white text-lg font-bold hover:bg-[#4752C4] transition-colors shadow-xl"
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03z" />
              </svg>
              Join the Community
            </a>
            <Link
              href="/start"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl border border-white/20 text-white text-lg font-medium hover:bg-white/10 transition-colors backdrop-blur-sm"
            >
              Get My Launch Plan
            </Link>
          </div>
          <p className="mt-6 text-sm text-white/60">
            Free to join. No credit card required.
          </p>
        </div>
      </section>
    </>
  );
}
