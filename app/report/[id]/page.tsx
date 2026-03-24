"use client";

import { useEffect, useRef, useState } from "react";
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

const NAV_SECTIONS = [
  { id: "viability", label: "Viability" },
  { id: "summary", label: "Summary" },
  { id: "analysis", label: "Analysis" },
  { id: "roadmap", label: "Roadmap" },
  { id: "requirements", label: "Requirements" },
  { id: "competitors", label: "Competitors" },
  { id: "branding", label: "Branding" },
  { id: "plan", label: "90-Day Plan" },
  { id: "partners", label: "Tools" },
];

type EmailModalState = "closed" | "open" | "sending" | "success" | "error";

export default function ReportPage() {
  const params = useParams();
  const id = params.id as string;
  const [report, setReport] = useState<StartupReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState("viability");

  // Email modal state
  const [emailModal, setEmailModal] = useState<EmailModalState>("closed");
  const [emailInput, setEmailInput] = useState("");
  const [emailError, setEmailError] = useState("");
  const emailInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem(`report_${id}`);
    if (stored) {
      setReport(JSON.parse(stored));
    }
    setLoading(false);
  }, [id]);

  // Focus email input when modal opens
  useEffect(() => {
    if (emailModal === "open") {
      setTimeout(() => emailInputRef.current?.focus(), 50);
    }
  }, [emailModal]);

  async function handleSendEmail(e: React.FormEvent) {
    e.preventDefault();
    setEmailError("");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailInput)) {
      setEmailError("Please enter a valid email address.");
      return;
    }

    setEmailModal("sending");

    try {
      const res = await fetch("/api/email/send-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recipientEmail: emailInput, reportData: report }),
      });

      if (!res.ok) {
        const { error } = await res.json();
        throw new Error(error ?? "Failed to send email");
      }

      setEmailModal("success");
    } catch (err) {
      setEmailError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setEmailModal("error");
    }
  }

  function openEmailModal() {
    setEmailError("");
    setEmailModal("open");
  }

  function closeEmailModal() {
    setEmailModal("closed");
    setEmailInput("");
    setEmailError("");
  }

  useEffect(() => {
    if (!report) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.2, rootMargin: "-100px 0px -60% 0px" }
    );

    NAV_SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [report]);

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
      {/* Report header — lighter, friendlier */}
      <div className="bg-white border-b border-border py-8 sm:py-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-start justify-between gap-4">
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
            <Link
              href="/start"
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-border text-sm font-medium text-text-muted hover:bg-surface transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New Analysis
            </Link>
          </div>
        </div>
      </div>

      {/* Sticky section nav */}
      <div className="sticky top-16 z-40 bg-white/90 backdrop-blur-md border-b border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-0.5 overflow-x-auto py-2 scrollbar-none">
            {NAV_SECTIONS.map(({ id, label }) => (
              <a
                key={id}
                href={`#${id}`}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                  activeSection === id
                    ? "bg-primary-50 text-primary-700"
                    : "text-text-muted hover:text-text hover:bg-gray-50"
                }`}
              >
                {label}
              </a>
            ))}
          </nav>
        </div>
      </div>

      {/* Report sections */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Disclaimer */}
        <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-100">
          <p className="text-xs text-amber-700 text-center">
            AI-generated planning tool — not a substitute for legal, tax, or professional advice.
          </p>
        </div>

        <div id="viability">
          <ViabilityScore viability={report.viability} />
        </div>

        <div id="summary">
          <BusinessSummary intake={report.intake} profile={report.profile} />
        </div>

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
          <CompetitorSnapshot competitors={report.competitors} />
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

        {/* Footer actions */}
        <div className="text-center py-6">
          <p className="text-text-muted text-sm mb-4">
            You have your plan. Now go make it happen.
          </p>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-border text-sm font-medium text-text-muted hover:bg-white transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              Print
            </button>
            <button
              onClick={openEmailModal}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-border text-sm font-medium text-text-muted hover:bg-white transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Email Report
            </button>
            <Link
              href="/start"
              className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-primary-600 text-white text-sm font-semibold hover:bg-primary-700 transition-colors"
            >
              Analyze Another Idea
            </Link>
          </div>
        </div>
      </div>

      {/* Email report modal */}
      {emailModal !== "closed" && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
          onClick={(e) => { if (e.target === e.currentTarget) closeEmailModal(); }}
        >
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
            {emailModal === "success" ? (
              <div className="text-center py-2">
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-primary-900 mb-1">Report Sent!</h3>
                <p className="text-sm text-text-muted mb-5">
                  Check <strong>{emailInput}</strong> for your report summary.
                </p>
                <button
                  onClick={closeEmailModal}
                  className="w-full py-2.5 rounded-xl bg-primary-600 text-white text-sm font-semibold hover:bg-primary-700 transition-colors"
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleSendEmail}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-semibold text-primary-900">Email This Report</h3>
                  <button
                    type="button"
                    onClick={closeEmailModal}
                    className="text-text-muted hover:text-text transition-colors p-1 rounded-lg hover:bg-gray-100"
                    aria-label="Close"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <p className="text-sm text-text-muted mb-4">
                  We&apos;ll send a summary of your report with key highlights and your viability score.
                </p>

                <label className="block text-xs font-medium text-text mb-1.5" htmlFor="report-email">
                  Email address
                </label>
                <input
                  ref={emailInputRef}
                  id="report-email"
                  type="email"
                  value={emailInput}
                  onChange={(e) => { setEmailInput(e.target.value); setEmailError(""); }}
                  placeholder="you@example.com"
                  disabled={emailModal === "sending"}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent disabled:opacity-50 disabled:bg-surface mb-1"
                />
                {(emailModal === "error" && emailError) && (
                  <p className="text-xs text-accent-600 mb-3">{emailError}</p>
                )}
                {emailModal !== "error" && <div className="mb-3" />}

                <button
                  type="submit"
                  disabled={emailModal === "sending"}
                  className="w-full py-2.5 rounded-xl bg-primary-600 text-white text-sm font-semibold hover:bg-primary-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {emailModal === "sending" ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Sending…
                    </>
                  ) : (
                    "Send Report"
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
