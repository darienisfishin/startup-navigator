import type { BusinessProfile, IntakeFormData } from "@/lib/types";

export default function BusinessSummary({
  intake,
  profile,
}: {
  intake: IntakeFormData;
  profile: BusinessProfile;
}) {
  return (
    <div className="bg-white rounded-2xl border border-border shadow-sm p-8">
      <h2 className="text-xl font-bold text-primary-900 mb-2 flex items-center gap-2">
        <svg className="w-6 h-6 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
        Business Concept Summary
      </h2>
      <p className="text-text-muted text-sm mb-6">Here&apos;s what we understand about your business.</p>

      <div className="bg-surface rounded-xl p-6 mb-6">
        <p className="text-text leading-relaxed">{intake.businessIdea}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          { label: "Business Name", value: intake.businessName || "Not yet decided" },
          { label: "Industry", value: profile.industryCategory },
          { label: "Type", value: intake.productOrService === "both" ? "Product & Service" : intake.productOrService },
          { label: "Target Customer", value: profile.customerType },
          { label: "Business Model", value: profile.businessModel },
          { label: "Recommended Entity", value: profile.likelyBusinessType },
          { label: "Location", value: `${intake.city}${intake.county ? `, ${intake.county}` : ""}, ${intake.state}` },
          { label: "Regulatory Complexity", value: profile.regulatoryComplexity },
          { label: "Estimated Startup Cost", value: profile.startupCostEstimate },
          { label: "Current Stage", value: intake.stage },
        ].map((item) => (
          <div key={item.label} className="flex items-start gap-3 py-2.5 border-b border-gray-50 last:border-0">
            <span className="text-xs font-semibold text-text-muted uppercase tracking-wider w-36 flex-shrink-0 pt-0.5">
              {item.label}
            </span>
            <span className="text-sm text-primary-900 capitalize">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
