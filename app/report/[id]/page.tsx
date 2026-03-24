"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import type { StartupReport } from "@/lib/types";
import ViabilityScore from "@/components/report/ViabilityScore";
import BusinessSummary from "@/components/report/BusinessSummary";
import IdeaAnalysis from "@/components/report/IdeaAnalysis";
import LocalRequirements from "@/components/report/LocalRequirements";
import CompetitorSnapshot from "@/components/report/CompetitorSnapshot";
import BrandingFeedback from "@/components/report/BrandingFeedback";
import StartupRoadmap from "@/components/report/StartupRoadmap";
import NinetyDayPlan from "@/components/report/NinetyDayPlan";
import PartnerRecommendations from "@/components/report/PartnerRecommendations";

export default function ReportPage() {
  const params = useParams();
  const id = params.id as string;
  const [report, setReport] = useState<StartupReport | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = sessionStorage.getItem(`report_${id}`);
    if (stored) {
      setReport(JSON.parse(stored));
    }
    setLoading(false);
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-3 border-primary-200 border-t-primary-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-text-muted text-sm">Loading your report...</p>
        </div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="text-center max-w-sm mx-auto px-4">
          <h2 className="text-xl font-bold text-primary-900 mb-2">Report Not Found</h2>
          <p className="text-text-muted text-sm mb-6">
            This report may have expired. Generate a new one to get started.
          </p>
          <Link
            href="/start"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary-600 text-white font-semibold hover:bg-primary-700 transition-colors"
          >
            Start New Analysis
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface">
      {/* Report header */}
      <div className="bg-white border-b border-border py-8 sm:py-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div>
            <p className="text-sm text-primary-500 font-medium mb-1">Your Launch Plan</p>
            <h1 className="text-2xl sm:text-3xl font-bold text-primary-900">
              {report.intake.businessName
                ? report.intake.businessName
                : `${report.intake.userName}'s Plan`}
            </h1>
            <p className="text-text-muted mt-1 text-sm">
              {report.intake.industry} &middot;{" "}
              {report.intake.city}, {report.intake.state}
            </p>
          </div>
        </div>
      </div>

      {/* Report content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Disclaimer */}
        <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-100">
          <p className="text-xs text-amber-700 text-center">
            AI-generated planning tool — not a substitute for legal, tax, or professional advice.
          </p>
        </div>

        {/* FREE PREVIEW: Viability Score + Summary */}
        <div id="viability">
          <ViabilityScore viability={report.viability} />
        </div>

        <div id="summary">
          <BusinessSummary intake={report.intake} profile={report.profile} />
        </div>

        {/* BLURRED: Everything else behind paywall */}
        <div className="relative">
          {/* Blurred report sections */}
          <div className="blur-sm select-none pointer-events-none opacity-60 space-y-6">
            <div id="analysis">
              <IdeaAnalysis analysis={report.ideaAnalysis} />
            </div>

            <div id="roadmap">
              <StartupRoadmap roadmap={report.roadmap} />
            </div>

            <div id="requirements">
              <LocalRequirements requirements={report.localRequirements} />
            </div>

            <div id="competitors">
              <CompetitorSnapshot landscape={report.competitiveLandscape} />
            </div>

            <div id="branding">
              <BrandingFeedback branding={report.branding} />
            </div>

            <div id="plan">
              <NinetyDayPlan plan={report.ninetyDayPlan} />
            </div>

            <div id="partners">
              <PartnerRecommendations partners={report.partners} />
            </div>
          </div>

          {/* Paywall overlay */}
          <div className="absolute inset-0 flex items-start justify-center bg-gradient-to-b from-white/30 via-white/90 to-white pt-16 sm:pt-24">
            <div className="max-w-2xl w-full mx-4">
              <div className="bg-white rounded-2xl border border-border shadow-xl p-8 sm:p-10 text-center">
                <div className="w-12 h-12 rounded-2xl bg-primary-100 text-primary-600 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-primary-900 mb-2">
                  Your full report is ready
                </h2>
                <p className="text-text-muted text-sm mb-8 max-w-md mx-auto">
                  Unlock your complete launch plan — market analysis, local licensing checklist, brand critique, 90-day action plan, and more.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  {/* Starter */}
                  <div className="border border-border rounded-xl p-5 text-left">
                    <h3 className="text-base font-bold text-primary-900">Starter</h3>
                    <div className="mt-1 mb-3">
                      <span className="text-2xl font-bold text-primary-900">$9.99</span>
                      <span className="text-text-muted text-xs ml-1">one-time</span>
                    </div>
                    <ul className="space-y-1.5 mb-4">
                      {[
                        { text: "Viability score", highlight: true },
                        { text: "Top 5 action steps", highlight: true },
                        { text: "Idea analysis", highlight: false },
                        { text: "Market landscape", highlight: false },
                      ].map((item) => (
                        <li key={item.text} className="flex items-center gap-1.5 text-xs">
                          <svg className="w-3.5 h-3.5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className={item.highlight ? "font-semibold text-primary-900" : "text-text-muted"}>
                            {item.text}
                          </span>
                        </li>
                      ))}
                    </ul>
                    <a
                      href="https://launchpilot.buildr.bet/checkout/afc5afd9-6080-4967-a2df-33a2e10219a1"
                      className="block w-full text-center px-4 py-2.5 rounded-xl border-2 border-primary-600 text-primary-600 text-sm font-semibold hover:bg-primary-50 transition-colors"
                    >
                      Get Starter — $9.99
                    </a>
                  </div>

                  {/* Full Report */}
                  <div className="border-2 border-primary-500 rounded-xl p-5 text-left relative">
                    <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-primary-500 text-white text-[10px] font-semibold">
                      Best Value
                    </div>
                    <h3 className="text-base font-bold text-primary-900">Full Report</h3>
                    <div className="mt-1 mb-3">
                      <span className="text-2xl font-bold text-primary-900">$24.99</span>
                      <span className="text-text-muted text-xs ml-1">one-time</span>
                    </div>
                    <ul className="space-y-1.5 mb-4">
                      {[
                        { text: "Everything in Starter", highlight: false },
                        { text: "90-day week-by-week plan", highlight: true },
                        { text: "Local licensing checklist", highlight: true },
                        { text: "Full competitive landscape", highlight: true },
                        { text: "Brand critique", highlight: false },
                        { text: "VIP Founders Community", highlight: true },
                        { text: "Partner tools + PDF export", highlight: false },
                      ].map((item) => (
                        <li key={item.text} className="flex items-center gap-1.5 text-xs">
                          <svg className="w-3.5 h-3.5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className={item.highlight ? "font-semibold text-primary-900" : "text-text-muted"}>
                            {item.text}
                          </span>
                        </li>
                      ))}
                    </ul>
                    <a
                      href="https://launchpilot.buildr.bet/checkout/4adcea4b-dacf-40ac-b04e-051449a9c6cb"
                      className="block w-full text-center px-4 py-2.5 rounded-xl bg-primary-600 text-white text-sm font-semibold hover:bg-primary-700 transition-colors shadow-md shadow-primary-200"
                    >
                      Get Full Report — $24.99
                    </a>
                  </div>
                </div>

                <p className="text-xs text-text-muted">
                  Secure checkout powered by BUILDR. Your idea stays private.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
