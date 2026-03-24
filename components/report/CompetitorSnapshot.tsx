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
    <div className="bg-white rounded-2xl border border-border shadow-sm p-8">
      <h2 className="text-xl font-bold text-primary-900 mb-2 flex items-center gap-2">
        <svg className="w-6 h-6 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        Competitive Landscape
      </h2>
      <p className="text-text-muted text-sm mb-6">
        How your market looks and where the opportunities are.
      </p>

      {/* Overview + Saturation */}
      <div className="p-4 rounded-xl bg-surface border border-border mb-6">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs font-medium text-text-muted">Market Saturation:</span>
          <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${saturation.color}`}>
            {saturation.label}
          </span>
        </div>
        <p className="text-sm text-primary-900 leading-relaxed">{landscape.overview}</p>
      </div>

      {/* Competitor Types */}
      {landscape.competitorTypes.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-bold text-primary-900 mb-3">Who You&apos;re Up Against</h3>
          <div className="space-y-3">
            {landscape.competitorTypes.map((ct, i) => (
              <div key={i} className="p-4 rounded-xl bg-surface border border-border">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h4 className="text-sm font-semibold text-primary-900">{ct.type}</h4>
                  <span className="text-xs text-text-muted flex-shrink-0">{ct.prevalence}</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {ct.typicalStrengths.map((s, j) => (
                    <span key={j} className="px-2 py-0.5 rounded-full bg-gray-100 text-xs text-text-muted">
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
        <div className="mb-6">
          <h3 className="text-sm font-bold text-primary-900 mb-3">Market Gaps &amp; Opportunities</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {landscape.marketGaps.map((gap, i) => (
              <div key={i} className="flex items-start gap-2 p-3 rounded-lg bg-green-50/50 border border-green-100">
                <span className="text-green-500 mt-0.5 flex-shrink-0">+</span>
                <span className="text-sm text-primary-900">{gap}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Positioning Assessment */}
      {landscape.positioningAssessment && (
        <div className="p-4 rounded-xl bg-primary-50/50 border border-primary-100 mb-6">
          <h3 className="text-sm font-bold text-primary-900 mb-2">Your Positioning</h3>
          <p className="text-sm text-primary-900 leading-relaxed">{landscape.positioningAssessment}</p>
        </div>
      )}

      {/* Advice */}
      {landscape.advice.length > 0 && (
        <div>
          <h3 className="text-sm font-bold text-primary-900 mb-3">Strategic Advice</h3>
          <div className="space-y-2">
            {landscape.advice.map((a, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5">
                  {i + 1}
                </div>
                <span className="text-sm text-text">{a}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
