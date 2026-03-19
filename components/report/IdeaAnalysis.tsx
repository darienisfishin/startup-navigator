import type { IdeaAnalysis as IdeaAnalysisType } from "@/lib/types";

const LEVEL_COLORS = {
  low: "bg-green-50 text-green-700 border-green-200",
  moderate: "bg-accent-50 text-accent-700 border-accent-200",
  high: "bg-red-50 text-red-700 border-red-200",
  weak: "bg-red-50 text-red-700 border-red-200",
  strong: "bg-green-50 text-green-700 border-green-200",
  easy: "bg-green-50 text-green-700 border-green-200",
  challenging: "bg-red-50 text-red-700 border-red-200",
};

export default function IdeaAnalysis({ analysis }: { analysis: IdeaAnalysisType }) {
  return (
    <div className="bg-white rounded-2xl border border-border shadow-sm p-8">
      <h2 className="text-xl font-bold text-primary-900 mb-2 flex items-center gap-2">
        <svg className="w-6 h-6 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
        Business Idea Analysis
      </h2>
      <p className="text-text-muted text-sm mb-6">AI evaluation of your business concept.</p>

      {/* Idea score */}
      <div className="flex items-center gap-4 p-5 rounded-xl bg-gradient-to-r from-primary-50 to-primary-100 border border-primary-200 mb-6">
        <div className="text-4xl font-bold text-primary-700">{analysis.ideaScore}</div>
        <div>
          <div className="text-sm font-semibold text-primary-800">Idea Strength Score</div>
          <div className="text-xs text-primary-600">out of 10</div>
        </div>
      </div>

      {/* Summary */}
      <p className="text-sm text-text leading-relaxed mb-6">{analysis.summary}</p>

      {/* Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-8">
        {[
          { label: "Market Demand", value: analysis.marketDemand },
          { label: "Competition", value: analysis.competitionLevel },
          { label: "Differentiation", value: analysis.differentiationStrength },
          { label: "Difficulty", value: analysis.startupDifficulty },
          { label: "Profit Potential", value: analysis.profitPotential },
        ].map((m) => (
          <div
            key={m.label}
            className={`px-3 py-2.5 rounded-lg border text-center ${
              LEVEL_COLORS[m.value as keyof typeof LEVEL_COLORS] || "bg-gray-50 text-gray-700 border-gray-200"
            }`}
          >
            <div className="text-xs text-inherit/70 mb-0.5">{m.label}</div>
            <div className="text-sm font-bold capitalize">{m.value}</div>
          </div>
        ))}
      </div>

      {/* Strengths, risks, recommendations */}
      <div className="space-y-6">
        <div>
          <h3 className="text-sm font-semibold text-green-700 mb-3 flex items-center gap-1.5">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Strengths
          </h3>
          <ul className="space-y-2">
            {analysis.strengths.map((s, i) => (
              <li key={i} className="text-sm text-text flex items-start gap-2">
                <span className="text-green-500 mt-0.5 flex-shrink-0">+</span>
                {s}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-red-600 mb-3 flex items-center gap-1.5">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            Risks
          </h3>
          <ul className="space-y-2">
            {analysis.risks.map((r, i) => (
              <li key={i} className="text-sm text-text flex items-start gap-2">
                <span className="text-red-500 mt-0.5 flex-shrink-0">!</span>
                {r}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-primary-700 mb-3 flex items-center gap-1.5">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Recommendations
          </h3>
          <ul className="space-y-2">
            {analysis.recommendations.map((r, i) => (
              <li key={i} className="text-sm text-text flex items-start gap-2">
                <span className="text-primary-500 mt-0.5 flex-shrink-0">&rarr;</span>
                {r}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
