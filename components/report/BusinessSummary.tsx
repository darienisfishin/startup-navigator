import type { BusinessProfile, IntakeFormData } from "@/lib/types";

export default function BusinessSummary({
  intake,
  profile,
}: {
  intake: IntakeFormData;
  profile: BusinessProfile;
}) {
  return (
    <div className="bg-white rounded-2xl border border-indigo-100 shadow-md p-8 sm:p-10 animate-fade-in-up">
      {/* Section header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center flex-shrink-0">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <h2
            className="text-3xl font-bold text-primary-900"
            style={{ fontFamily: "var(--font-accent)" }}
          >
            Business Concept Summary
          </h2>
        </div>
        <div className="h-1 w-24 rounded-full bg-gradient-to-r from-indigo-400 to-primary-500 ml-15 mt-2" />
        <p className="text-text-muted text-sm mt-3">
          Here&apos;s what we understand about your business.
        </p>
      </div>

      {/* Idea description */}
      <div className="bg-gradient-to-br from-indigo-50 to-primary-50 rounded-2xl p-6 mb-8 border border-indigo-100">
        <p className="text-text leading-relaxed text-base">{intake.businessIdea}</p>
      </div>

      {/* Details grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
        {[
          { label: "Business Name", value: intake.businessName || "Not yet decided", icon: "🏷️" },
          { label: "Industry", value: profile.industryCategory, icon: "🏢" },
          { label: "Type", value: intake.productOrService === "both" ? "Product & Service" : intake.productOrService, icon: "📦" },
          { label: "Target Customer", value: profile.customerType, icon: "👤" },
          { label: "Business Model", value: profile.businessModel, icon: "💡" },
          { label: "Recommended Entity", value: profile.likelyBusinessType, icon: "⚖️" },
          { label: "Location", value: `${intake.city}${intake.county ? `, ${intake.county}` : ""}, ${intake.state}`, icon: "📍" },
          { label: "Regulatory Complexity", value: profile.regulatoryComplexity, icon: "📋" },
          { label: "Estimated Startup Cost", value: profile.startupCostEstimate, icon: "💰" },
          { label: "Current Stage", value: intake.stage, icon: "🚀" },
        ].map((item) => (
          <div
            key={item.label}
            className="flex items-start gap-3 py-3 px-4 rounded-xl hover:bg-indigo-50/50 transition-colors"
          >
            <span className="text-lg flex-shrink-0 mt-0.5">{item.icon}</span>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-0.5">
                {item.label}
              </div>
              <div className="text-sm font-medium text-primary-900 capitalize">{item.value}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
