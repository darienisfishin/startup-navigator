import type { LocalRequirement } from "@/lib/types";

const CONFIDENCE_STYLES = {
  verified: { label: "Verified", className: "confidence-high" },
  likely: { label: "Likely Required", className: "confidence-medium" },
  verify: { label: "Verify with Office", className: "confidence-low" },
};

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  registration: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  ),
  licensing: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  ),
  tax: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  zoning: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    </svg>
  ),
  health: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
  ),
  other: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
};

export default function LocalRequirements({
  requirements,
}: {
  requirements: LocalRequirement[];
}) {
  return (
    <div className="bg-white rounded-2xl border border-teal-100 shadow-md p-8 sm:p-10 animate-fade-in-up">
      {/* Section header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-600 flex items-center justify-center flex-shrink-0">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <h2
            className="text-3xl font-bold text-primary-900"
            style={{ fontFamily: "var(--font-accent)" }}
          >
            Local Startup Requirements
          </h2>
        </div>
        <div className="h-1 w-24 rounded-full bg-gradient-to-r from-teal-400 to-cyan-500 ml-15 mt-2" />
        <p className="text-text-muted text-sm mt-3">
          Location-specific steps based on your city, county, and state.
        </p>
      </div>

      {/* Disclaimer */}
      <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 mb-8">
        <p className="text-xs text-amber-800">
          <strong>Important:</strong> Requirements vary by jurisdiction. Items marked
          &quot;Likely Required&quot; or &quot;Verify&quot; should be confirmed with the relevant
          government office. This is guidance, not legal advice.
        </p>
      </div>

      <div className="space-y-4 stagger-children">
        {requirements.map((req, i) => {
          const conf = CONFIDENCE_STYLES[req.confidence];
          return (
            <div
              key={i}
              className="flex items-start gap-4 p-5 rounded-2xl bg-surface border border-border hover:border-teal-200 hover:bg-teal-50/30 transition-colors card-hover"
            >
              <div className="w-11 h-11 rounded-xl bg-teal-100 text-teal-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                {CATEGORY_ICONS[req.category] || CATEGORY_ICONS.other}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3 mb-1.5">
                  <h3 className="text-sm font-bold text-primary-900">{req.task}</h3>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-medium border flex-shrink-0 ${conf.className}`}
                  >
                    {conf.label}
                  </span>
                </div>
                <p className="text-sm text-text-muted leading-relaxed">
                  {req.description}
                </p>
                {req.link && (
                  <a
                    href={req.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 mt-2 text-xs font-medium text-teal-600 hover:text-teal-700"
                  >
                    Visit website
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
