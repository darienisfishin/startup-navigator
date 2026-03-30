"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [reportId, setReportId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!sessionId) {
      setLoading(false);
      return;
    }

    fetch(`/api/checkout/session?session_id=${sessionId}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.reportId) setReportId(data.reportId);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [sessionId]);

  // Auto-redirect to the report page once we have the reportId.
  // Pass session_id so the report page can immediately verify payment
  // without waiting for the Stripe webhook to update Supabase.
  useEffect(() => {
    if (!reportId || !sessionId) return;
    const timer = setTimeout(() => {
      window.location.href = `/report/${reportId}?session_id=${sessionId}`;
    }, 1500);
    return () => clearTimeout(timer);
  }, [reportId, sessionId]);

  if (loading) {
    return (
      <div className="w-8 h-8 border-2 border-primary-200 border-t-primary-500 rounded-full animate-spin mx-auto" />
    );
  }

  if (reportId) {
    return (
      <div className="flex flex-col items-center gap-3">
        <p className="text-sm text-text-muted">Redirecting to your report…</p>
        <div className="w-5 h-5 border-2 border-primary-200 border-t-primary-500 rounded-full animate-spin" />
        <a
          href={`/report/${reportId}?session_id=${sessionId}`}
          className="mt-1 text-sm text-primary-600 hover:underline"
        >
          Click here if not redirected
        </a>
      </div>
    );
  }

  // No reportId — user came from the pricing page directly (no report yet)
  return (
    <div className="flex flex-col items-center gap-3">
      <p className="text-sm text-text-muted">
        Your payment was received! Now generate your report to unlock it.
      </p>
      <a
        href="/start"
        className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-primary-600 text-white font-semibold hover:bg-primary-700 transition-colors shadow-lg shadow-primary-200"
      >
        Generate Your Report
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
        </svg>
      </a>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <div className="min-h-screen bg-surface flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* Animated checkmark */}
        <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6 animate-scale-in">
          <svg
            className="w-10 h-10 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        <h1 className="text-3xl font-bold text-primary-900 mb-3">
          Payment successful!
        </h1>
        <p className="text-text-muted mb-8 leading-relaxed">
          Your LaunchPilot report has been unlocked. Everything is ready — dig
          in and start building.
        </p>

        <Suspense
          fallback={
            <div className="w-8 h-8 border-2 border-primary-200 border-t-primary-500 rounded-full animate-spin mx-auto" />
          }
        >
          <SuccessContent />
        </Suspense>

        <p className="mt-6 text-sm text-text-muted">
          Questions?{" "}
          <a
            href="mailto:support@launch-pilot.com"
            className="text-primary-600 hover:underline"
          >
            support@launch-pilot.com
          </a>
        </p>
      </div>
    </div>
  );
}
