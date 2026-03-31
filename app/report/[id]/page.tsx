"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
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
import BusinessTip from "@/components/report/BusinessTip";
import FunFacts from "@/components/report/FunFacts";
import SocialMediaTips from "@/components/report/SocialMediaTips";
import { useAuth } from "@/components/auth/AuthProvider";
import { createClient } from "@/lib/supabase/client";
import CheckoutButton from "@/components/CheckoutButton";
import LoginModal from "@/components/auth/LoginModal";
import { PRICING_TIERS } from "@/lib/pricing";

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

type EmailModalState = "closed" | "open" | "sending" | "success" | "error";

export default function ReportPage() {
  const params = useParams();
  const id = params.id as string;
  const searchParams = useSearchParams();
  const { user } = useAuth();

  const [report, setReport] = useState<StartupReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPaid, setIsPaid] = useState(false);
  const [tier, setTier] = useState<string | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);

  // Supabase report ID (may differ from local sessionStorage ID)
  const [supabaseId, setSupabaseId] = useState<string | null>(null);
  const [savedToDb, setSavedToDb] = useState(false);
  const saveAttempted = useRef(false);

  // Share state
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [sharing, setSharing] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);

  // Active nav section
  const [activeSection, setActiveSection] = useState<string>("viability");

  // Email modal state
  const [emailModal, setEmailModal] = useState<EmailModalState>("closed");
  const [emailInput, setEmailInput] = useState("");
  const [emailError, setEmailError] = useState("");
  const emailInputRef = useRef<HTMLInputElement>(null);

  // Download state
  const [downloadingChecklist, setDownloadingChecklist] = useState(false);
  const [downloadingGuide, setDownloadingGuide] = useState(false);

  // ── Load report ──────────────────────────────────────────────
  useEffect(() => {
    const loadReport = async () => {
      // Check sessionStorage for a paid flag set by the success page redirect
      if (sessionStorage.getItem(`paid_${id}`) === "true") {
        setIsPaid(true);
      }

      // Restore tier from sessionStorage
      const storedTier = sessionStorage.getItem(`tier_${id}`);
      if (storedTier) setTier(storedTier);

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

      // 3. Try Supabase by ID (covers "My Reports" navigation and post-payment redirects)
      const supabase = createClient();
      const { data } = await supabase
        .from("reports")
        .select("id, report_data, paid, tier")
        .eq("id", id)
        .maybeSingle();

      if (data?.report_data) {
        setReport(data.report_data as StartupReport);
        setSupabaseId(data.id);
        setSavedToDb(true);
        if (data.paid) setIsPaid(true);
        if (data.tier) setTier(data.tier);
      }

      setLoading(false);
    };

    loadReport();
  }, [id]);

  // ── Verify payment via Stripe session_id ──────────────────────
  useEffect(() => {
    const sessionId = searchParams?.get("session_id");
    if (!sessionId || isPaid) return;

    fetch(`/api/checkout/session?session_id=${sessionId}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.paymentStatus === "paid") {
          setIsPaid(true);
          sessionStorage.setItem(`paid_${id}`, "true");
          if (data.tierId) {
            setTier(data.tierId);
            sessionStorage.setItem(`tier_${id}`, data.tierId);
          }
        }
      })
      .catch(() => {});
  }, [searchParams, id, isPaid]);

  // ── Auto-save to Supabase when logged in ─────────────────────
  useEffect(() => {
    if (!report || !user || saveAttempted.current || savedToDb) return;
    saveAttempted.current = true;

    const cachedDbId = sessionStorage.getItem(`report_supabase_id_${id}`);
    if (cachedDbId) {
      setSupabaseId(cachedDbId);
      setSavedToDb(true);
      return;
    }

    const save = async () => {
      const supabase = createClient();
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

  // ── Focus email input when modal opens ───────────────────────
  useEffect(() => {
    if (emailModal === "open") {
      setTimeout(() => emailInputRef.current?.focus(), 50);
    }
  }, [emailModal]);

  // ── Email handlers ────────────────────────────────────────────
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

  // ── Download handlers ─────────────────────────────────────────
  async function handleDownload(endpoint: string, filename: string, setLoading: (v: boolean) => void) {
    if (!report) return;
    setLoading(true);
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reportData: report }),
      });
      if (!res.ok) throw new Error("Download failed");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      // silently fail — user can retry
    } finally {
      setLoading(false);
    }
  }

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

  const businessName = report.intake.businessName
    ? report.intake.businessName
    : `${report.intake.userName}'s Plan`;

  const isProTier = tier === "pro";

  return (
    <div className="min-h-screen bg-surface">
      {/* Report header */}
      <div className="bg-white border-b border-border py-8 sm:py-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm text-primary-500 font-semibold mb-1 uppercase tracking-wide">Your Launch Plan</p>
              <h1
                className="text-3xl sm:text-4xl font-bold text-primary-900"
                style={{ fontFamily: "var(--font-accent)" }}
              >
                {businessName}
              </h1>
              <p className="text-text-muted mt-1.5 text-sm flex items-center gap-2">
                <span>{report.intake.industry}</span>
                <span className="text-border">·</span>
                <span>{report.intake.city}, {report.intake.state}</span>
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 shrink-0">
              {/* Save indicator */}
              {user && savedToDb && (
                <span className="inline-flex items-center gap-1 text-xs text-emerald-600 font-medium">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Saved
                </span>
              )}

              {/* Email Report button */}
              <button
                onClick={openEmailModal}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-xs font-medium text-text-muted hover:bg-surface transition-colors"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Email Report
              </button>

              {/* Share button */}
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

      {/* Report content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex gap-8">
          {/* Sticky sidebar nav — desktop only */}
          <aside className="hidden lg:block w-40 flex-shrink-0">
            <nav className="sticky top-20 space-y-0.5">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted px-3 pb-2">Sections</p>
              {NAV_SECTIONS.map(({ id, label }) => (
                <a
                  key={id}
                  href={`#${id}`}
                  className={`block px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    activeSection === id
                      ? "bg-primary-50 text-primary-700"
                      : "text-text-muted hover:text-primary-700 hover:bg-gray-50"
                  }`}
                >
                  {label}
                </a>
              ))}
            </nav>
          </aside>

          {/* Main report content */}
          <div className="flex-1 min-w-0 space-y-6">
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

            <BusinessTip tip="Businesses that score above 70 on viability have a 3x higher success rate in their first year. You're off to a great start — now execute!" />

            <div id="summary">
              <BusinessSummary intake={report.intake} profile={report.profile} />
            </div>

            <BusinessTip tip="Save this report — revisit it every 30 days to track how your actual progress compares to the plan." />

            {/* PAID SECTIONS */}
            <div className={isPaid ? "" : "relative"}>
              <div className={isPaid ? "space-y-6" : "blur-sm select-none pointer-events-none opacity-60 space-y-6"}>
                <div id="analysis">
                  <IdeaAnalysis analysis={report.ideaAnalysis} />
                </div>

                {isPaid && (
                  <BusinessTip tip="Your differentiation score matters most. The #1 reason startups fail isn't funding — it's launching something people don't need." />
                )}

                <div id="roadmap">
                  <StartupRoadmap roadmap={report.roadmap} />
                </div>

                {isPaid && (
                  <BusinessTip tip="The most successful founders work on their roadmap 1 step at a time. Don't try to do everything in week one." />
                )}

                <div id="requirements">
                  <LocalRequirements requirements={report.localRequirements} />
                </div>

                {isPaid && (
                  <BusinessTip tip="Apply for your business license first. Everything else (bank account, insurance, vendor contracts) requires it." />
                )}

                <div id="competitors">
                  <CompetitorSnapshot landscape={report.competitiveLandscape} />
                </div>

                {isPaid && (
                  <BusinessTip tip="Don't try to beat competitors on everything. Pick 2–3 things you'll be the best at and own them completely." />
                )}

                <div id="branding">
                  <BrandingFeedback branding={report.branding} />
                </div>

                {isPaid && (
                  <BusinessTip tip="Your business name is your first impression. Test it with 10 people before committing — ask them what they think you sell." />
                )}

                <div id="plan">
                  <NinetyDayPlan plan={report.ninetyDayPlan} />
                </div>

                {isPaid && (
                  <BusinessTip tip="Week 1 is the hardest. If you can execute your first 3 action items, you're already ahead of 80% of aspiring founders." />
                )}

                <div id="partners">
                  <PartnerRecommendations partners={report.partners} />
                </div>

                {isPaid && (
                  <BusinessTip tip="Most of these tools offer free trials. Start with free tiers and upgrade only when you have revenue." />
                )}

                {/* Premium Downloads — Pro tier only */}
                {isPaid && isProTier && (
                  <div className="bg-white rounded-2xl border border-primary-200 shadow-md p-8 sm:p-10 animate-fade-in-up">
                    <div className="mb-6">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-500 to-indigo-600 text-white flex items-center justify-center flex-shrink-0 text-xl">
                          ⬇️
                        </div>
                        <div>
                          <h2
                            className="text-2xl font-bold text-primary-900"
                            style={{ fontFamily: "var(--font-accent)" }}
                          >
                            Premium Downloads
                          </h2>
                          <span className="inline-flex items-center gap-1 text-xs font-bold text-primary-600 bg-primary-100 px-2.5 py-0.5 rounded-full">
                            Pro Exclusive
                          </span>
                        </div>
                      </div>
                      <div className="h-1 w-20 rounded-full bg-gradient-to-r from-primary-400 to-indigo-500 ml-15 mt-2" />
                      <p className="text-text-muted text-sm mt-3">
                        Printable resources personalized to {businessName}.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Checklist */}
                      <div className="p-6 rounded-2xl bg-indigo-50 border border-indigo-200">
                        <div className="text-3xl mb-3">✅</div>
                        <h3 className="text-base font-bold text-primary-900 mb-1">Startup Checklist + Budget</h3>
                        <p className="text-sm text-text-muted mb-4 leading-relaxed">
                          Printable checklist covering legal setup, branding, operations, and your personalized budget overview.
                        </p>
                        <button
                          onClick={() =>
                            handleDownload(
                              "/api/downloads/checklist",
                              `${businessName.replace(/[^a-z0-9]/gi, "_")}_Startup_Checklist.html`,
                              setDownloadingChecklist
                            )
                          }
                          disabled={downloadingChecklist}
                          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary-600 text-white text-sm font-semibold hover:bg-primary-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                          {downloadingChecklist ? (
                            <>
                              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                              Generating...
                            </>
                          ) : (
                            <>
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                              Download Checklist
                            </>
                          )}
                        </button>
                      </div>

                      {/* Social Guide */}
                      <div className="p-6 rounded-2xl bg-purple-50 border border-purple-200">
                        <div className="text-3xl mb-3">📱</div>
                        <h3 className="text-base font-bold text-primary-900 mb-1">First Month Social Guide</h3>
                        <p className="text-sm text-text-muted mb-4 leading-relaxed">
                          Facebook &amp; Instagram strategy, week-by-week posting calendar, and hashtag starter kit for your business.
                        </p>
                        <button
                          onClick={() =>
                            handleDownload(
                              "/api/downloads/social-guide",
                              `${businessName.replace(/[^a-z0-9]/gi, "_")}_Social_Media_Guide.html`,
                              setDownloadingGuide
                            )
                          }
                          disabled={downloadingGuide}
                          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 text-white text-sm font-semibold hover:bg-purple-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                          {downloadingGuide ? (
                            <>
                              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                              Generating...
                            </>
                          ) : (
                            <>
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                              Download Social Guide
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    <p className="mt-4 text-xs text-text-muted">
                      Files download as HTML — open in your browser and use File → Print → Save as PDF for a print-ready version.
                    </p>
                  </div>
                )}

                {/* Fun Facts & Social Tips — shown after full report */}
                {isPaid && (
                  <>
                    <FunFacts />
                    <SocialMediaTips />
                  </>
                )}
              </div>

              {/* Paywall overlay — only shown when not paid */}
              {!isPaid && (
                <div className="absolute inset-0 flex items-start justify-center bg-gradient-to-b from-white/30 via-white/90 to-white pt-16 sm:pt-24">
                  <div className="max-w-2xl w-full mx-4">
                    <div className="bg-white rounded-2xl border border-border shadow-xl p-8 sm:p-10 text-center">
                      <div className="w-14 h-14 rounded-2xl bg-primary-100 text-primary-600 flex items-center justify-center mx-auto mb-4 text-2xl">
                        🔓
                      </div>
                      <h2
                        className="text-2xl font-bold text-primary-900 mb-2"
                        style={{ fontFamily: "var(--font-accent)" }}
                      >
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
                          {!user ? (
                            <button
                              onClick={() => setShowLoginModal(true)}
                              className="block w-full text-center px-4 py-2.5 rounded-xl border-2 border-primary-600 text-primary-600 text-sm font-semibold hover:bg-primary-50 transition-colors"
                            >
                              Sign in to pay — $9.99
                            </button>
                          ) : !supabaseId ? (
                            <button
                              disabled
                              className="block w-full text-center px-4 py-2.5 rounded-xl border-2 border-primary-300 text-primary-400 text-sm font-semibold cursor-not-allowed flex items-center justify-center gap-2"
                            >
                              <span className="w-3.5 h-3.5 border-2 border-primary-300 border-t-primary-500 rounded-full animate-spin" />
                              Saving report…
                            </button>
                          ) : (
                            <CheckoutButton
                              priceId={PRICING_TIERS[0].stripePriceId}
                              tierId="starter"
                              reportId={supabaseId}
                              className="block w-full text-center px-4 py-2.5 rounded-xl border-2 border-primary-600 text-primary-600 text-sm font-semibold hover:bg-primary-50 transition-colors"
                            >
                              Get Starter — $9.99
                            </CheckoutButton>
                          )}
                        </div>

                        {/* Pro */}
                        <div className="border-2 border-primary-500 rounded-xl p-5 text-left relative">
                          <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-primary-500 text-white text-[10px] font-semibold">
                            Best Value
                          </div>
                          <h3 className="text-base font-bold text-primary-900">Pro</h3>
                          <div className="mt-1 mb-3">
                            <span className="text-2xl font-bold text-primary-900">$29</span>
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
                          {!user ? (
                            <button
                              onClick={() => setShowLoginModal(true)}
                              className="block w-full text-center px-4 py-2.5 rounded-xl bg-primary-600 text-white text-sm font-semibold hover:bg-primary-700 transition-colors shadow-md shadow-primary-200"
                            >
                              Sign in to pay — $29
                            </button>
                          ) : !supabaseId ? (
                            <button
                              disabled
                              className="block w-full text-center px-4 py-2.5 rounded-xl bg-primary-300 text-white text-sm font-semibold cursor-not-allowed flex items-center justify-center gap-2"
                            >
                              <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                              Saving report…
                            </button>
                          ) : (
                            <CheckoutButton
                              priceId={PRICING_TIERS[1].stripePriceId}
                              tierId="pro"
                              reportId={supabaseId}
                              className="block w-full text-center px-4 py-2.5 rounded-xl bg-primary-600 text-white text-sm font-semibold hover:bg-primary-700 transition-colors shadow-md shadow-primary-200"
                            >
                              Get Pro — $29
                            </CheckoutButton>
                          )}
                        </div>
                      </div>

                      <p className="text-xs text-text-muted">
                        Secure checkout powered by Stripe. Your idea stays private.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Login modal */}
      {showLoginModal && (
        <LoginModal onClose={() => setShowLoginModal(false)} />
      )}

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
