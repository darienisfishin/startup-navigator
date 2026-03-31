"use client";

import { useEffect, useState } from "react";
import type { ViabilityAssessment } from "@/lib/types";

export default function ViabilityScore({ viability }: { viability: ViabilityAssessment }) {
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 400);
    return () => clearTimeout(t);
  }, []);

  const score = viability.overallScore;
  const isHighScore = score >= 70;
  const radius = 75;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (circumference * (animated ? score : 0)) / 100;

  const scoreColor = isHighScore ? "text-green-500" : score >= 40 ? "text-accent-500" : "text-red-500";
  const strokeColor = isHighScore ? "#22c55e" : score >= 40 ? "#f97316" : "#ef4444";
  const glowColor = isHighScore ? "rgba(34,197,94,0.3)" : score >= 40 ? "rgba(249,115,22,0.3)" : "rgba(239,68,68,0.3)";

  return (
    <div className="bg-white rounded-2xl border border-green-100 shadow-md overflow-hidden animate-fade-in-up">
      {/* Achievement banner for high scores */}
      {isHighScore && (
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 px-6 py-3 flex items-center justify-center gap-2">
          <span className="text-white text-sm font-bold">🏆 Strong Viability Score — You're in the top tier!</span>
        </div>
      )}

      <div className="p-8 sm:p-10">
        {/* Section header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-2xl bg-green-100 text-green-600 flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h2
              className="text-3xl font-bold text-primary-900"
              style={{ fontFamily: "var(--font-accent)" }}
            >
              Startup Viability Assessment
            </h2>
          </div>
          <div className="h-1 w-24 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 ml-15 mt-2" />
          <p className="text-text-muted text-sm mt-3">
            Your idea scored across 5 key dimensions of startup success.
          </p>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-10">
          {/* Score ring — larger and more dramatic */}
          <div className="relative flex-shrink-0">
            {/* Glow effect for high scores */}
            {isHighScore && animated && (
              <div
                className="absolute inset-0 rounded-full animate-pulse"
                style={{
                  background: `radial-gradient(circle, ${glowColor} 0%, transparent 70%)`,
                  transform: "scale(1.2)",
                }}
              />
            )}
            <svg width="180" height="180" className="-rotate-90">
              <circle cx="90" cy="90" r={radius} stroke="#e2e8f0" strokeWidth="12" fill="none" />
              <circle
                cx="90"
                cy="90"
                r={radius}
                stroke={strokeColor}
                strokeWidth="12"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                className="score-ring"
                style={{
                  filter: animated && isHighScore ? `drop-shadow(0 0 8px ${glowColor})` : undefined,
                }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={`text-4xl font-bold ${scoreColor}`}>{score}%</span>
              <span className="text-xs text-text-muted font-medium">Viability</span>
              {isHighScore && <span className="text-[10px] text-green-600 font-bold mt-0.5">Excellent</span>}
            </div>

            {/* Sparkles for high scores */}
            {isHighScore && animated && (
              <>
                <div className="absolute -top-2 -right-2 text-2xl animate-bounce-subtle">✨</div>
                <div className="absolute top-4 -left-3 text-lg animate-float" style={{ animationDelay: "0.3s" }}>⭐</div>
                <div className="absolute -bottom-1 right-0 text-xl animate-bounce-subtle" style={{ animationDelay: "0.6s" }}>✨</div>
              </>
            )}
          </div>

          {/* Sub-scores */}
          <div className="flex-1 w-full space-y-4">
            {[
              { label: "Local Demand", value: viability.localDemand, icon: "📍" },
              { label: "Pricing Feasibility", value: viability.pricingFeasibility, icon: "💰" },
              { label: "Differentiation", value: viability.differentiationScore, icon: "⚡" },
              { label: "Competition Density", value: viability.competitionDensity, icon: "🎯" },
              { label: "Startup Complexity", value: viability.startupComplexity, icon: "🔧" },
            ].map((item) => (
              <div key={item.label}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-text-muted flex items-center gap-1.5">
                    <span>{item.icon}</span>
                    {item.label}
                  </span>
                  <span className="font-bold">{item.value}%</span>
                </div>
                <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-1000 ease-out"
                    style={{
                      width: animated ? `${item.value}%` : "0%",
                      backgroundColor:
                        item.value >= 65 ? "#22c55e" : item.value >= 40 ? "#f97316" : "#ef4444",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Verdict */}
        <div className="mt-10 p-6 rounded-2xl bg-surface border border-border">
          <p className="text-sm text-text leading-relaxed">{viability.verdict}</p>
        </div>

        {/* Strengths & Risks */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
          <div className="p-5 rounded-xl bg-green-50 border border-green-100">
            <h3 className="text-sm font-bold text-green-700 mb-3 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Top Strengths
            </h3>
            <ul className="space-y-2">
              {viability.topStrengths.map((s, i) => (
                <li key={i} className="text-sm text-green-900 flex items-start gap-2">
                  <span className="text-green-500 mt-0.5 font-bold flex-shrink-0">+</span>
                  {s}
                </li>
              ))}
            </ul>
          </div>
          <div className="p-5 rounded-xl bg-red-50 border border-red-100">
            <h3 className="text-sm font-bold text-red-600 mb-3 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              Key Risks
            </h3>
            <ul className="space-y-2">
              {viability.topRisks.map((r, i) => (
                <li key={i} className="text-sm text-red-900 flex items-start gap-2">
                  <span className="text-red-500 mt-0.5 font-bold flex-shrink-0">!</span>
                  {r}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Critical first steps */}
        <div className="mt-6 p-5 rounded-xl border border-primary-100 bg-primary-50">
          <h3 className="text-sm font-bold text-primary-800 mb-3 flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Critical First Steps
          </h3>
          <ol className="space-y-2">
            {viability.criticalFirstSteps.map((s, i) => (
              <li key={i} className="text-sm text-primary-900 flex items-start gap-2">
                <span className="w-6 h-6 rounded-full bg-primary-200 text-primary-700 flex items-center justify-center flex-shrink-0 text-xs font-bold mt-0.5">
                  {i + 1}
                </span>
                {s}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}
