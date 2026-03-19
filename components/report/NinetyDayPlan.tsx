import type { NinetyDayPlan as NinetyDayPlanType } from "@/lib/types";

const PHASES = [
  { key: "weekOne" as const, label: "Week 1", color: "from-red-500 to-red-600", bg: "bg-red-50", border: "border-red-200", text: "text-red-700" },
  { key: "monthOne" as const, label: "Month 1", color: "from-accent-500 to-accent-600", bg: "bg-accent-50", border: "border-accent-200", text: "text-accent-700" },
  { key: "monthTwo" as const, label: "Month 2", color: "from-primary-500 to-primary-600", bg: "bg-primary-50", border: "border-primary-200", text: "text-primary-700" },
  { key: "monthThree" as const, label: "Month 3", color: "from-green-500 to-green-600", bg: "bg-green-50", border: "border-green-200", text: "text-green-700" },
];

export default function NinetyDayPlan({ plan }: { plan: NinetyDayPlanType }) {
  return (
    <div className="bg-white rounded-2xl border border-border shadow-sm p-8">
      <h2 className="text-xl font-bold text-primary-900 mb-2 flex items-center gap-2">
        <svg className="w-6 h-6 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        90-Day Launch Plan
      </h2>
      <p className="text-text-muted text-sm mb-6">
        A practical timeline to go from idea to launched business.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {PHASES.map((phase) => {
          const items = plan[phase.key];
          return (
            <div key={phase.key} className={`p-5 rounded-xl ${phase.bg} border ${phase.border}`}>
              <div className="flex items-center gap-2 mb-4">
                <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${phase.color} text-white flex items-center justify-center text-xs font-bold`}>
                  {phase.label.split(" ")[1]}
                </div>
                <h3 className={`text-sm font-bold ${phase.text}`}>{phase.label}</h3>
              </div>
              <ul className="space-y-2.5">
                {items.map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <div className={`w-5 h-5 rounded-full border-2 ${phase.border} flex-shrink-0 mt-0.5 flex items-center justify-center`}>
                      <div className="w-1.5 h-1.5 rounded-full bg-current opacity-30" />
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
