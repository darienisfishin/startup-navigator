import type { PartnerRecommendation } from "@/lib/types";

const CATEGORY_ICONS: Record<string, string> = {
  "Business Formation": "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4",
  "Accounting": "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
  "Domain & Hosting": "M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9",
  "E-commerce Platform": "M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z",
  "Website Builder": "M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4",
  "Payments & POS": "M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z",
  "Payment Processing": "M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z",
  "CRM & Marketing": "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
  "Design & Branding": "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z",
};

export default function PartnerRecommendations({
  partners,
}: {
  partners: PartnerRecommendation[];
}) {
  return (
    <div className="bg-white rounded-2xl border border-emerald-100 shadow-md p-8 sm:p-10 animate-fade-in-up">
      {/* Section header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h2
            className="text-3xl font-bold text-primary-900"
            style={{ fontFamily: "var(--font-accent)" }}
          >
            Recommended Tools &amp; Services
          </h2>
        </div>
        <div className="h-1 w-24 rounded-full bg-gradient-to-r from-emerald-400 to-green-500 ml-15 mt-2" />
        <p className="text-text-muted text-sm mt-3">
          Curated tools matched to your specific business needs.
        </p>
      </div>

      {/* Trust note */}
      <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 mb-8 flex items-start gap-3">
        <span className="text-emerald-600 text-lg flex-shrink-0">✓</span>
        <p className="text-xs text-emerald-800 leading-relaxed">
          Recommendations are based on your industry, business type, and stage. We only suggest
          tools that are genuinely relevant to your situation.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 stagger-children">
        {partners.map((partner, i) => {
          const iconPath = CATEGORY_ICONS[partner.category] || CATEGORY_ICONS["Domain & Hosting"];
          return (
            <div
              key={i}
              className="p-5 rounded-2xl bg-surface border border-border hover:border-emerald-200 hover:bg-emerald-50/20 transition-colors card-hover"
            >
              <div className="flex items-start gap-3 mb-3">
                <div className="w-11 h-11 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={iconPath} />
                  </svg>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-primary-900">{partner.name}</h3>
                  <span className="text-xs text-emerald-600 font-medium">{partner.category}</span>
                </div>
              </div>
              <p className="text-sm text-text-muted mb-2">{partner.description}</p>
              <p className="text-xs text-text italic mb-3">&ldquo;{partner.why}&rdquo;</p>
              <a
                href={partner.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 hover:text-emerald-700"
              >
                Learn more
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          );
        })}
      </div>

      <p className="mt-8 text-xs text-text-muted text-center">
        Some links may be affiliate links. We only recommend tools we believe genuinely help
        founders. See our disclosure policy for details.
      </p>
    </div>
  );
}
