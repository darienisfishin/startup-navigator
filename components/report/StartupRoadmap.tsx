import type { RoadmapStep } from "@/lib/types";

const PRIORITY_STYLES = {
  critical: "bg-red-50 text-red-700 border-red-200",
  important: "bg-accent-50 text-accent-700 border-accent-200",
  recommended: "bg-blue-50 text-blue-700 border-blue-200",
};

const CATEGORY_COLORS: Record<string, string> = {
  legal: "bg-purple-100 text-purple-700",
  branding: "bg-pink-100 text-pink-700",
  digital: "bg-blue-100 text-blue-700",
  operations: "bg-gray-100 text-gray-700",
  marketing: "bg-green-100 text-green-700",
  financial: "bg-yellow-100 text-yellow-700",
};

export default function StartupRoadmap({ roadmap }: { roadmap: RoadmapStep[] }) {
  return (
    <div className="bg-white rounded-2xl border border-border shadow-sm p-8">
      <h2 className="text-xl font-bold text-primary-900 mb-2 flex items-center gap-2">
        <svg className="w-6 h-6 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
        Startup Roadmap
      </h2>
      <p className="text-text-muted text-sm mb-6">
        Your personalized step-by-step action plan, in the right order.
      </p>

      <div className="space-y-4">
        {roadmap.map((step) => (
          <div
            key={step.step}
            className="flex gap-4 p-5 rounded-xl bg-surface border border-border hover:border-primary-200 transition-colors"
          >
            {/* Step number */}
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
              {step.step}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-3 mb-1">
                <h3 className="text-sm font-bold text-primary-900">{step.title}</h3>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-medium border ${PRIORITY_STYLES[step.priority]}`}
                  >
                    {step.priority}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-medium ${CATEGORY_COLORS[step.category] || "bg-gray-100 text-gray-700"}`}
                  >
                    {step.category}
                  </span>
                </div>
              </div>
              <p className="text-sm text-text-muted leading-relaxed">{step.description}</p>
              <p className="text-xs text-primary-500 font-medium mt-2">{step.timeframe}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
