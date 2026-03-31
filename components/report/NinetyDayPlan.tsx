import type { NinetyDayPlan as NinetyDayPlanType } from "@/lib/types";

const PHASES = [
  { key: "weekOne" as const, label: "Week 1", emoji: "🔥", color: "from-red-500 to-rose-600", bg: "bg-red-50", border: "border-red-200", text: "text-red-700", checkBorder: "border-red-200" },
  { key: "monthOne" as const, label: "Month 1", emoji: "⚡", color: "from-accent-500 to-orange-600", bg: "bg-accent-50", border: "border-accent-200", text: "text-accent-700", checkBorder: "border-accent-200" },
  { key: "monthTwo" as const, label: "Month 2", emoji: "🚀", color: "from-primary-500 to-indigo-600", bg: "bg-primary-50", border: "border-primary-200", text: "text-primary-700", checkBorder: "border-primary-200" },
  { key: "monthThree" as const, label: "Month 3", emoji: "🏆", color: "from-green-500 to-emerald-600", bg: "bg-green-50", border: "border-green-200", text: "text-green-700", checkBorder: "border-green-200" },
];

export default function NinetyDayPlan({ plan }: { plan: NinetyDayPlanType }) {
  return (
    <div className="bg-white rounded-2xl border border-amber-100 shadow-md p-8 sm:p-10 animate-fade-in-up">
      {/* Section header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center flex-shrink-0">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h2
            className="text-3xl font-bold text-primary-900"
            style={{ fontFamily: "var(--font-accent)" }}
          >
            90-Day Launch Plan
          </h2>
        </div>
        <div className="h-1 w-24 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 ml-15 mt-2" />
        <p className="text-text-muted text-sm mt-3">
          A practical timeline to go from idea to launched business.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {PHASES.map((phase) => {
          const items = plan[phase.key];
          return (
            <div key={phase.key} className={`p-6 rounded-2xl ${phase.bg} border ${phase.border} card-hover`}>
              <div className="flex items-center gap-3 mb-5">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${phase.color} text-white flex flex-col items-center justify-center`}>
                  <span className="text-base leading-none">{phase.emoji}</span>
                  <span className="text-[10px] font-bold leading-none">{phase.label.split(" ")[1]}</span>
                </div>
                <h3
                  className={`text-lg font-bold ${phase.text}`}
                  style={{ fontFamily: "var(--font-accent)" }}
                >
                  {phase.label}
                </h3>
              </div>
              <ul className="space-y-3">
                {items.map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <div className={`w-5 h-5 rounded-md border-2 ${phase.checkBorder} flex-shrink-0 mt-0.5 flex items-center justify-center`}>
                      <div className="w-1.5 h-1.5 rounded-full bg-current opacity-25" />
                    </div>
                    <span className="text-sm text-text leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}
