import type { BrandingFeedback as BrandingFeedbackType } from "@/lib/types";

function ScoreBar({ label, score, max = 10 }: { label: string; score: number; max?: number }) {
  const pct = (score / max) * 100;
  const color = pct >= 70 ? "from-green-400 to-green-500" : pct >= 40 ? "from-accent-400 to-accent-500" : "from-red-400 to-red-500";
  return (
    <div>
      <div className="flex justify-between text-sm mb-1.5">
        <span className="text-text-muted">{label}</span>
        <span className="font-bold">{score}/{max}</span>
      </div>
      <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export default function BrandingFeedback({
  branding,
}: {
  branding: BrandingFeedbackType;
}) {
  const { nameAnalysis, logoAnalysis } = branding;

  return (
    <div className="bg-white rounded-2xl border border-purple-100 shadow-md p-8 sm:p-10 animate-fade-in-up">
      {/* Section header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center flex-shrink-0">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
            </svg>
          </div>
          <h2
            className="text-3xl font-bold text-primary-900"
            style={{ fontFamily: "var(--font-accent)" }}
          >
            Brand &amp; Name Analysis
          </h2>
        </div>
        <div className="h-1 w-24 rounded-full bg-gradient-to-r from-purple-400 to-violet-500 ml-15 mt-2" />
        <p className="text-text-muted text-sm mt-3">Honest, constructive feedback on your brand identity.</p>
      </div>

      {/* Name analysis */}
      <div className="mb-10">
        <div className="flex items-center gap-4 mb-6 p-5 rounded-2xl bg-purple-50 border border-purple-100">
          <div className={`text-5xl font-bold ${
            nameAnalysis.overallScore >= 7 ? "text-green-600" :
            nameAnalysis.overallScore >= 4 ? "text-accent-600" :
            nameAnalysis.overallScore > 0 ? "text-red-600" :
            "text-gray-400"
          }`} style={{ fontFamily: "var(--font-accent)" }}>
            {nameAnalysis.overallScore > 0 ? nameAnalysis.overallScore : "–"}
          </div>
          <div>
            <div className="text-sm font-bold text-primary-800">Name Score</div>
            <div className="text-xs text-text-muted">/10</div>
            <div className="mt-1">
              {nameAnalysis.overallScore >= 7 ? (
                <span className="text-xs font-bold text-green-600 bg-green-100 px-2.5 py-0.5 rounded-full">Strong foundation</span>
              ) : nameAnalysis.overallScore >= 4 ? (
                <span className="text-xs font-bold text-amber-600 bg-amber-100 px-2.5 py-0.5 rounded-full">Needs improvement</span>
              ) : nameAnalysis.overallScore > 0 ? (
                <span className="text-xs font-bold text-red-600 bg-red-100 px-2.5 py-0.5 rounded-full">Significant issues</span>
              ) : (
                <span className="text-xs font-bold text-gray-500 bg-gray-100 px-2.5 py-0.5 rounded-full">No name provided</span>
              )}
            </div>
          </div>
        </div>

        {nameAnalysis.overallScore > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <ScoreBar label="Memorability" score={nameAnalysis.memorability} />
            <ScoreBar label="Clarity" score={nameAnalysis.clarity} />
            <ScoreBar label="Industry Relevance" score={nameAnalysis.relevance} />
            <ScoreBar label="Pronunciation" score={nameAnalysis.pronunciation} />
            <ScoreBar label="Distinctiveness" score={nameAnalysis.distinctiveness} />
          </div>
        )}

        <p className="text-sm text-text leading-relaxed p-5 rounded-xl bg-surface border border-border mb-5">
          {nameAnalysis.feedback}
        </p>

        <div className="p-5 rounded-xl bg-purple-50 border border-purple-100">
          <h3 className="text-sm font-bold text-purple-800 mb-3">Action Items</h3>
          <ul className="space-y-2">
            {nameAnalysis.suggestions.map((s, i) => (
              <li key={i} className="text-sm text-purple-900 flex items-start gap-2">
                <span className="text-purple-500 mt-0.5 flex-shrink-0">&rarr;</span>
                {s}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Logo analysis */}
      {logoAnalysis && (
        <div className="pt-8 border-t border-purple-100">
          <h3
            className="text-2xl font-bold text-primary-900 mb-2"
            style={{ fontFamily: "var(--font-accent)" }}
          >
            Logo Analysis
          </h3>
          <div className="h-0.5 w-16 rounded-full bg-gradient-to-r from-purple-400 to-violet-500 mb-4" />
          <p className="text-text-muted text-sm mb-7">
            Your logo will appear on screens, print materials, signage, apparel, and promotional items. Each has different technical requirements.
          </p>

          {/* Design quality scores */}
          <div className="mb-7">
            <h4 className="text-sm font-bold text-primary-800 mb-4">Design Quality</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <ScoreBar label="Readability" score={logoAnalysis.readability} />
              <ScoreBar label="Color Balance" score={logoAnalysis.colorBalance} />
              <ScoreBar label="Industry Fit" score={logoAnalysis.categoryFit} />
              <ScoreBar label="Scalability" score={logoAnalysis.scalability} />
              <ScoreBar label="Uniqueness" score={logoAnalysis.uniqueness} />
            </div>
          </div>

          {/* Production readiness */}
          <div className="mb-7">
            <h4 className="text-sm font-bold text-primary-800 mb-4 flex items-center gap-1.5">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Production Readiness
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <ScoreBar label="Screen Printing" score={logoAnalysis.screenPrintability} />
              <ScoreBar label="Embroidery" score={logoAnalysis.embroideryFriendly} />
              <ScoreBar label="Color Count (fewer = better)" score={logoAnalysis.colorCount} />
              <ScoreBar label="Favicon / App Icon" score={logoAnalysis.faviconReady} />
              <ScoreBar label="Signage & Vehicle Wrap" score={logoAnalysis.signageReady} />
            </div>
          </div>

          <p className="text-sm text-text leading-relaxed p-5 rounded-xl bg-surface border border-border mb-5">
            {logoAnalysis.feedback}
          </p>

          {/* Critical improvements */}
          <div className="p-5 rounded-xl bg-red-50 border border-red-100">
            <h4 className="text-sm font-bold text-red-700 mb-3 flex items-center gap-1.5">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              Critical Improvements
            </h4>
            <ul className="space-y-2">
              {logoAnalysis.improvements.map((imp, i) => (
                <li key={i} className="text-sm text-red-900 flex items-start gap-2">
                  <span className="text-red-500 mt-0.5 flex-shrink-0 font-bold">!</span>
                  {imp}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
