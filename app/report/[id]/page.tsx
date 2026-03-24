"use client";

import { useCallback, useEffect, useRef, useState } from "react";
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
import { useAuth } from "@/components/auth/AuthProvider";
import { createClient } from "@/lib/supabase/client";

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

function generateShareToken() {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  return Array.from({ length: 12 }, () =>
    chars[Math.floor(Math.random() * chars.length)]
  ).join("");
}

export default function ReportPage() {
  const params = useParams();
  const id = params.id as string;
  const { user } = useAuth();

  const [report, setReport] = useState<StartupReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState("viability");

  // Supabase report ID (may differ from local sessionStorage ID)
  const [supabaseId, setSupabaseId] = useState<string | null>(null);
  const [savedToDb, setSavedToDb] = useState(false);
  const saveAttempted = useRef(false);

  // Share state
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [sharing, setSharing] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);

  // ── Load report ──────────────────────────────────────────────
  useEffect(() => {
    const loadReport = async () => {
      // 1. Try sessionStorage first (fastest, works for fresh reports)
      const stored = sessionStorage.getItem(`report_${id}`);
      if (stored) {
        setReport(JSON.parse(stored));
        setLoading(false);
        return;
      }

      // 2. Restore saved Supabase ID from sessionStorage mapping
      const cachedDbId = sessionStorage.getItem(`report_supabase_id_${id}`);
      if (cachedDbId) setSupabaseId(cachedDbId);

      // 3. Try Supabase by ID (covers "My Reports" navigation)
      const supabase = createClient();
      const { data } = await supabase
        .from("reports")
        .select("id, report_data")
        .eq("id", id)
        .maybeSingle();

      if (data?.report_data) {
        setReport(data.report_data as StartupReport);
        setSupabaseId(data.id);
        setSavedToDb(true);
      }

      setLoading(false);
    };

    loadReport();
  }, [id]);

  // ── Auto-save to Supabase when logged in ─────────────────────
  useEffect(() => {
    if (!report || !user || saveAttempted.current || savedToDb) return;
    saveAttempted.current = true;

    // Check if we already saved this report
    const cachedDbId = sessionStorage.getItem(`report_supabase_id_${id}`);
    if (cachedDbId) {
      setSupabaseId(cachedDbId);
      setSavedToDb(true);
      return;
    }

    const save = async () => {
      const supabase = createClient();
      // Strip non-serialisable File object before storing
      const { logoFile: _ignored, ...serializableIntake } = report.intake;

      const { data, error } = await supabase
        .from("reports")
        .insert({
          user_id: user.id,
          form_data: serializableIntake,
          report_data: report,
        })
        .select("id")
        .single();

      if (!error && data) {
        sessionStorage.setItem(`report_supabase_id_${id}`, data.id);
        setSupabaseId(data.id);
        setSavedToDb(true);
      }
    };

    save();
  }, [report, user, savedToDb, id]);

  // ── Intersection observer for nav highlight ───────────────────
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

  // ── Share report ──────────────────────────────────────────────
  const handleShare = useCallback(async () => {
    const dbId = supabaseId;
    if (!dbId || !user) return;

    setSharing(true);
    try {
      const supabase = createClient();
      const token = generateShareToken();

      const { error } = await supabase
        .from("reports")
        .update({ is_public: true, share_token: token })
        .eq("id", dbId)
        .eq("user_id", user.id);

      if (!error) {
        const url = `${window.location.origin}/report/share/${token}`;
        setShareUrl(url);
      }
    } finally {
      setSharing(false);
    }
  }, [supabaseId, user]);

  const copyShareUrl = useCallback(() => {
    if (!shareUrl) return;
    navigator.clipboard.writeText(shareUrl);
    setShareCopied(true);
    setTimeout(() => setShareCopied(false), 2000);
  }, [shareUrl]);

  // ── Render states ─────────────────────────────────────────────
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

            <div className="hidden sm:flex items-center gap-2 shrink-0">
              {/* Save indicator */}
              {user && savedToDb && (
                <span className="inline-flex items-center gap-1 text-xs text-emerald-600 font-medium">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Saved
                </span>
              )}

              {/* Share button — only for logged-in users with a saved report */}
              {user && supabaseId && (
                <>
                  {shareUrl ? (
                    <button
                      onClick={copyShareUrl}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-700 text-xs font-medium hover:bg-indigo-100 transition-colors border border-indigo-100"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      {shareCopied ? "Copied!" : "Copy Link"}
                    </button>
                  ) : (
                    <button
                      onClick={handleShare}
                      disabled={sharing}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-xs font-medium text-text-muted hover:bg-surface transition-colors disabled:opacity-50"
                    >
                      {sharing ? (
                        <span className="w-3.5 h-3.5 border border-gray-300 border-t-gray-500 rounded-full animate-spin" />
                      ) : (
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                        </svg>
                      )}
                      Share Report
                    </button>
                  )}
                </>
              )}

              <Link
                href="/start"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-border text-sm font-medium text-text-muted hover:bg-surface transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                New Analysis
              </Link>
            </div>
          </div>

          {/* Share URL banner */}
          {shareUrl && (
            <div className="mt-4 flex items-center gap-3 p-3 rounded-xl bg-indigo-50 border border-indigo-100 animate-fade-in">
              <svg className="w-4 h-4 text-indigo-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
              <p className="text-xs text-indigo-700 font-mono truncate flex-1">{shareUrl}</p>
              <button
                onClick={copyShareUrl}
                className="shrink-0 text-xs text-indigo-700 font-medium hover:underline"
              >
                {shareCopied ? "Copied!" : "Copy"}
              </button>
            </div>
          )}
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
            <Link
              href="/start"
              className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-primary-600 text-white text-sm font-semibold hover:bg-primary-700 transition-colors"
            >
              Analyze Another Idea
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
