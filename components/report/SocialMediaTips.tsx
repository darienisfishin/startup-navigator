const TIPS = [
  {
    number: 1,
    icon: "📖",
    platform: "Storytelling",
    tip: "Post your 'Day 1' story. People love following a journey from the beginning. Share why you're starting this business.",
    color: "bg-blue-50 border-blue-200",
    badge: "bg-blue-100 text-blue-700",
  },
  {
    number: 2,
    icon: "📸",
    platform: "Content Format",
    tip: "Use before-and-after content. Show the problem your business solves, then show the solution. This format gets 2x more engagement.",
    color: "bg-pink-50 border-pink-200",
    badge: "bg-pink-100 text-pink-700",
  },
  {
    number: 3,
    icon: "💬",
    platform: "Community",
    tip: "Respond to every comment in your first 90 days. Early community building is what separates businesses that grow from ones that don't.",
    color: "bg-purple-50 border-purple-200",
    badge: "bg-purple-100 text-purple-700",
  },
  {
    number: 4,
    icon: "📅",
    platform: "Consistency",
    tip: "Post at least 3 times per week. Consistency beats quality when you're starting out. You can polish later.",
    color: "bg-emerald-50 border-emerald-200",
    badge: "bg-emerald-100 text-emerald-700",
  },
  {
    number: 5,
    icon: "#️⃣",
    platform: "Branding",
    tip: "Create a branded hashtag for your business from day one. Even if no one uses it yet — it builds brand recognition over time.",
    color: "bg-orange-50 border-orange-200",
    badge: "bg-orange-100 text-orange-700",
  },
];

export default function SocialMediaTips() {
  return (
    <div className="bg-white rounded-2xl border border-border shadow-md p-8 sm:p-10 animate-fade-in-up">
      {/* Section header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0 text-2xl">
            📱
          </div>
          <h2
            className="text-3xl font-bold text-primary-900"
            style={{ fontFamily: "var(--font-accent)" }}
          >
            Social Media Playbook
          </h2>
        </div>
        <div className="h-1 w-24 rounded-full bg-gradient-to-r from-blue-400 to-violet-500 ml-15 mt-2" />
        <p className="text-text-muted text-sm mt-3">
          5 actionable tips to grow your audience from day one.
        </p>
      </div>

      <div className="space-y-4 stagger-children">
        {TIPS.map((tip) => (
          <div
            key={tip.number}
            className={`flex items-start gap-4 p-5 rounded-2xl border ${tip.color} card-hover`}
          >
            {/* Number + icon */}
            <div className="flex flex-col items-center gap-1 flex-shrink-0">
              <div className={`w-9 h-9 rounded-xl ${tip.badge} flex items-center justify-center text-sm font-bold`}>
                {tip.number}
              </div>
              <span className="text-xl">{tip.icon}</span>
            </div>

            <div className="flex-1 min-w-0">
              <div className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${tip.badge} mb-2`}>
                {tip.platform}
              </div>
              <p className="text-sm text-primary-900 leading-relaxed">{tip.tip}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
