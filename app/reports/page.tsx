import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { IntakeFormData, ViabilityAssessment } from "@/lib/types";

interface ReportRow {
  id: string;
  created_at: string;
  is_public: boolean;
  share_token: string | null;
  form_data: Omit<IntakeFormData, "logoFile">;
  report_data: { viability: ViabilityAssessment };
}

function ScoreBadge({ score }: { score: number }) {
  const color =
    score >= 70
      ? "bg-emerald-50 text-emerald-700 border-emerald-100"
      : score >= 45
      ? "bg-amber-50 text-amber-700 border-amber-100"
      : "bg-rose-50 text-rose-700 border-rose-100";
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border ${color}`}>
      {score}/100
    </span>
  );
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default async function ReportsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/");
  }

  const { data: reports, error } = await supabase
    .from("reports")
    .select("id, created_at, is_public, share_token, form_data, report_data")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const rows = (reports ?? []) as ReportRow[];

  return (
    <div className="min-h-screen bg-surface">
      {/* Page header */}
      <div className="bg-white border-b border-border py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm text-primary-500 font-medium mb-1">Your Account</p>
              <h1 className="text-2xl sm:text-3xl font-bold text-primary-900">My Reports</h1>
              <p className="text-text-muted mt-1 text-sm">{user.email}</p>
            </div>
            <Link
              href="/start"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary-600 text-white text-sm font-semibold hover:bg-primary-700 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New Analysis
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-100">
            <p className="text-sm text-rose-600">Failed to load reports. Please refresh the page.</p>
          </div>
        )}

        {rows.length === 0 ? (
          /* Empty state */
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-2xl bg-primary-50 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h2 className="text-lg font-bold text-primary-900 mb-2">No reports yet</h2>
            <p className="text-text-muted text-sm mb-6 max-w-xs mx-auto">
              Generate your first startup analysis to see it saved here.
            </p>
            <Link
              href="/start"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary-600 text-white font-semibold text-sm hover:bg-primary-700 transition-colors"
            >
              Start My Plan
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {rows.map((report) => {
              const fd = report.form_data;
              const businessName = fd.businessName || `${fd.userName}'s Idea`;
              const score = report.report_data?.viability?.overallScore ?? 0;

              return (
                <Link
                  key={report.id}
                  href={`/report/${report.id}`}
                  className="block bg-white rounded-2xl border border-border p-5 hover:shadow-md hover:-translate-y-0.5 transition-all card-hover"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h2 className="font-bold text-primary-900 truncate">{businessName}</h2>
                        {report.is_public && report.share_token && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600 text-xs font-medium border border-indigo-100">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                          </svg>
                            Shared
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-text-muted">
                        {fd.industry} &middot; {fd.city}, {fd.state}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">{formatDate(report.created_at)}</p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <ScoreBadge score={score} />
                      <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
