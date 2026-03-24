export default function SampleReport() {
  return (
    <div className="bg-white rounded-2xl border border-border shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-white border-b border-border px-6 py-5">
        <div className="flex items-center gap-2 text-xs text-green-600 font-medium mb-2">
          <div className="w-2 h-2 rounded-full bg-green-400" />
          Sample Report
        </div>
        <h3 className="text-lg font-bold text-primary-900">Sunny Side Bakery — Launch Plan</h3>
        <p className="text-sm text-text-muted">Bakery / Desserts &middot; Birmingham, Alabama</p>
      </div>

      <div className="p-6 space-y-6">
        {/* Viability score */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <div className="relative flex-shrink-0">
            <svg width="100" height="100" className="-rotate-90">
              <circle cx="50" cy="50" r="40" stroke="#e2e8f0" strokeWidth="8" fill="none" />
              <circle cx="50" cy="50" r="40" stroke="#22c55e" strokeWidth="8" fill="none" strokeLinecap="round" strokeDasharray="251.33" strokeDashoffset="47.75" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-xl font-bold text-green-600">81%</span>
              <span className="text-[10px] text-text-muted">Viability</span>
            </div>
          </div>
          <div className="flex-1 w-full space-y-2">
            {[
              { label: "Local Demand", value: 78 },
              { label: "Pricing Feasibility", value: 82 },
              { label: "Differentiation", value: 85 },
              { label: "Competition Density", value: 62 },
            ].map((item) => (
              <div key={item.label}>
                <div className="flex justify-between text-xs mb-0.5">
                  <span className="text-text-muted">{item.label}</span>
                  <span className="font-medium">{item.value}%</span>
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${item.value}%`,
                      backgroundColor: item.value >= 65 ? "#22c55e" : item.value >= 40 ? "#f97316" : "#ef4444",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Strengths & Risks */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-green-50/50 border border-green-100">
            <h4 className="text-xs font-semibold text-green-700 mb-2">Top Strengths</h4>
            <ul className="space-y-1.5">
              {["Growing demand for artisan bakeries in Birmingham", "Low startup cost compared to full restaurant", "Strong foot traffic near proposed downtown location"].map((s, i) => (
                <li key={i} className="text-xs text-text flex items-start gap-1.5">
                  <span className="text-green-500 mt-0.5">+</span>{s}
                </li>
              ))}
            </ul>
          </div>
          <div className="p-4 rounded-xl bg-red-50/50 border border-red-100">
            <h4 className="text-xs font-semibold text-red-700 mb-2">Key Risks</h4>
            <ul className="space-y-1.5">
              {["6 established bakeries within 5 miles", "Health department inspections can delay opening by 2-4 weeks", "Profit margins tight in first 6 months without catering revenue"].map((r, i) => (
                <li key={i} className="text-xs text-text flex items-start gap-1.5">
                  <span className="text-red-500 mt-0.5">!</span>{r}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Roadmap preview */}
        <div>
          <h4 className="text-sm font-bold text-primary-900 mb-3">First 5 Steps</h4>
          <div className="space-y-2">
            {[
              { step: 1, title: "Register your LLC with the Alabama Secretary of State", tag: "legal", tagColor: "bg-purple-100 text-purple-700" },
              { step: 2, title: "Get an EIN from the IRS (free, takes 5 minutes online)", tag: "legal", tagColor: "bg-purple-100 text-purple-700" },
              { step: 3, title: "Apply for Birmingham business license ($100–$200)", tag: "licensing", tagColor: "bg-blue-100 text-blue-700" },
              { step: 4, title: "Schedule Jefferson County health department inspection", tag: "health", tagColor: "bg-green-100 text-green-700" },
              { step: 5, title: "Open a business bank account and set up accounting", tag: "financial", tagColor: "bg-yellow-100 text-yellow-700" },
            ].map((item) => (
              <div key={item.step} className="flex items-start gap-3 p-3 rounded-lg bg-surface border border-gray-100">
                <div className="w-6 h-6 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                  {item.step}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-primary-900">{item.title}</p>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium flex-shrink-0 ${item.tagColor}`}>
                  {item.tag}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Blurred sections to tease more */}
        <div className="relative">
          <div className="blur-sm select-none pointer-events-none space-y-3 opacity-60">
            <h4 className="text-sm font-bold text-primary-900">Competitive Landscape</h4>
            <div className="grid grid-cols-2 gap-3">
              {["Market saturation: Moderate", "3 competitor types identified", "4 market gaps found", "Positioning advice included"].map((c, i) => (
                <div key={i} className="p-3 rounded-lg bg-surface border border-gray-100 text-xs">{c}</div>
              ))}
            </div>
            <h4 className="text-sm font-bold text-primary-900 mt-4">Brand Critique &middot; 90-Day Plan &middot; Partner Tools</h4>
          </div>
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-white via-white/80 to-transparent">
            <div className="text-center">
              <p className="text-sm font-semibold text-primary-900 mb-1">Plus 4 more sections</p>
              <p className="text-xs text-text-muted">Market analysis, brand critique, 90-day plan, and recommended tools</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
