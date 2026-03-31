import type { CompetitiveLandscape } from "@/lib/types";

const SATURATION_LABELS: Record<string, { label: string; color: string }> = {
  low: { label: "Low", color: "text-green-600 bg-green-50 border-green-200" },
  moderate: { label: "Moderate", color: "text-yellow-700 bg-yellow-50 border-yellow-200" },
  high: { label: "High", color: "text-orange-600 bg-orange-50 border-orange-200" },
  "very high": { label: "Very High", color: "text-red-600 bg-red-50 border-red-200" },
};

export default function CompetitorSnapshot({
  landscape,
}: {
  landscape: CompetitiveLandscape;
}) {
  const saturation = SATURATION_LABELS[landscape.saturationLevel] || SATURATION_LABELS.moderate;

  return (
    <div className="bg-white rounded-2xl border border-orange-100 shadow-md p-8 sm:p-10 animate-fade-in-up">
      {/* Section header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center flex-shrink-0">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h2
            className="text-3xl font-bold text-primary-900"
            style={{ fontFamily: "var(--font-accent)" }}
          >
            Competitive Landscape
          </h2>
        </div>
        <div className="h-1 w-24 rounded-full bg-gradient-to-r from-orange-400 to-amber-500 ml-15 mt-2" />
        <p className="text-text-muted text-sm mt-3">
          How your market looks and where the opportunities are.
        </p>
      </div>

      {/* Overview + Saturation */}
      <div className="p-5 rounded-2xl bg-orange-50 border border-orange-100 mb-8">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs font-semibold text-text-muted uppercase tracking-wide">Market Saturation:</span>
          <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${saturation.color}`}>
            {saturation.label}
          </span>
        </div>
        <p className="text-sm text-primary-900 leading-relaxed">{landscape.overview}</p>
      </div>

      {/* Competitor Types */}
      {landscape.competitorTypes.length > 0 && (
        <div className="mb-8">
          <h3 className="text-base font-bold text-primary-900 mb-4 flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center text-xs">⚔️</span>
            Who You&apos;re Up Against
          </h3>
          <div className="space-y-3 stagger-children">
            {landscape.competitorTypes.map((ct, i) => (
              <div key={i} className="p-4 rounded-xl bg-surface border border-border hover:border-orange-200 transition-colors">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h4 className="text-sm font-bold text-primary-900">{ct.type}</h4>
                  <span className="text-xs text-text-muted flex-shrink-0 bg-gray-100 px-2 py-0.5 rounded-full">{ct.prevalence}</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {ct.typicalStrengths.map((s, j) => (
                    <span key={j} className="px-2 py-0.5 rounded-full bg-orange-100 text-orange-700 text-xs font-medium">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Market Gaps */}
      {landscape.marketGaps.length > 0 && (
        <div className="mb-8">
          <h3 className="text-base font-bold text-primary-900 mb-4 flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-green-100 text-green-600 flex items-center justify-center text-xs">🎯</span>
            Market Gaps &amp; Opportunities
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {landscape.marketGaps.map((gap, i) => (
              <div key={i} className="flex items-start gap-2.5 p-3.5 rounded-xl bg-green-50 border border-green-100">
                <span className="text-green-500 font-bold mt-0.5 flex-shrink-0">+</span>
                <span className="text-sm text-green-900">{gap}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Positioning Assessment */}
      {landscape.positioningAssessment && (
        <div className="p-5 rounded-2xl bg-primary-50 border border-primary-100 mb-8">
          <h3 className="text-sm font-bold text-primary-800 mb-2 flex items-center gap-2">
            <span>🧭</span> Your Positioning
          </h3>
          <p className="text-sm text-primary-900 leading-relaxed">{landscape.positioningAssessment}</p>
        </div>
      )}

      {/* Advice */}
      {landscape.advice.length > 0 && (
        <div>
          <h3 className="text-base font-bold text-primary-900 mb-4 flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-primary-100 text-primary-600 flex items-center justify-center text-xs">💡</span>
            Strategic Advice
          </h3>
          <div className="space-y-3">
            {landscape.advice.map((a, i) => (
              <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-surface border border-border">
                <div className="w-7 h-7 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                  {i + 1}
                </div>
                <span className="text-sm text-text leading-relaxed">{a}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
