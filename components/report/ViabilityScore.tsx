"use client";

import { useEffect, useState } from "react";
import type { ViabilityAssessment } from "@/lib/types";

export default function ViabilityScore({ viability }: { viability: ViabilityAssessment }) {
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 300);
    return () => clearTimeout(t);
  }, []);

  const score = viability.overallScore;
  const circumference = 2 * Math.PI * 58;
  const offset = circumference - (circumference * (animated ? score : 0)) / 100;

  const scoreColor =
    score >= 70 ? "text-green-500" : score >= 40 ? "text-accent-500" : "text-red-500";
  const strokeColor =
    score >= 70 ? "#22c55e" : score >= 40 ? "#f97316" : "#ef4444";

  return (
    <div className="bg-white rounded-2xl border border-border shadow-sm p-8">
      <h2 className="text-xl font-bold text-primary-900 mb-6 flex items-center gap-2">
        <svg className="w-6 h-6 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        Startup Viability Assessment
      </h2>

      <div className="flex flex-col md:flex-row items-center gap-8">
        {/* Score ring */}
        <div className="relative flex-shrink-0">
          <svg width="140" height="140" className="-rotate-90">
            <circle cx="70" cy="70" r="58" stroke="#e2e8f0" strokeWidth="10" fill="none" />
            <circle
              cx="70"
              cy="70"
              r="58"
              stroke={strokeColor}
              strokeWidth="10"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              className="score-ring"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-3xl font-bold ${scoreColor}`}>{score}%</span>
            <span className="text-xs text-text-muted">Viability</span>
          </div>
        </div>

        {/* Sub-scores */}
        <div className="flex-1 w-full space-y-3">
          {[
            { label: "Local Demand", value: viability.localDemand },
            { label: "Pricing Feasibility", value: viability.pricingFeasibility },
            { label: "Differentiation", value: viability.differentiationScore },
            { label: "Competition Density", value: viability.competitionDensity },
            { label: "Startup Complexity", value: viability.startupComplexity },
          ].map((item) => (
            <div key={item.label}>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-text-muted">{item.label}</span>
                <span className="font-medium">{item.value}%</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-1000 ease-out"
                  style={{
                    width: animated ? `${item.value}%` : "0%",
                    backgroundColor: item.value >= 65 ? "#22c55e" : item.value >= 40 ? "#f97316" : "#ef4444",
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Verdict */}
      <div className="mt-8 p-5 rounded-xl bg-surface border border-border">
        <p className="text-sm text-text leading-relaxed">{viability.verdict}</p>
      </div>

      {/* Strengths & Risks */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
        <div>
          <h3 className="text-sm font-semibold text-green-700 mb-3 flex items-center gap-1.5">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Top Strengths
          </h3>
          <ul className="space-y-2">
            {viability.topStrengths.map((s, i) => (
              <li key={i} className="text-sm text-text flex items-start gap-2">
                <span className="text-green-500 mt-0.5">+</span>
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
            Key Risks
          </h3>
          <ul className="space-y-2">
            {viability.topRisks.map((r, i) => (
              <li key={i} className="text-sm text-text flex items-start gap-2">
                <span className="text-red-500 mt-0.5">!</span>
                {r}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Critical first steps */}
      <div className="mt-6">
        <h3 className="text-sm font-semibold text-primary-800 mb-3">Critical First Steps</h3>
        <ol className="space-y-2">
          {viability.criticalFirstSteps.map((s, i) => (
            <li key={i} className="text-sm text-text flex items-start gap-2">
              <span className="w-5 h-5 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center flex-shrink-0 text-xs font-bold mt-0.5">
                {i + 1}
              </span>
              {s}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
