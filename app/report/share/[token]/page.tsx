import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
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

interface Props {
  params: Promise<{ token: string }>;
}

export default async function SharedReportPage({ params }: Props) {
  const { token } = await params;

  const supabase = await createClient();
  const { data } = await supabase
    .from("reports")
    .select("report_data, created_at")
    .eq("share_token", token)
    .eq("is_public", true)
    .maybeSingle();

  if (!data?.report_data) {
    notFound();
  }

  const report = data.report_data as StartupReport;

  const createdAt = new Date(data.created_at as string).toLocaleDateString(
    "en-US",
    { month: "long", day: "numeric", year: "numeric" }
  );

  return (
    <div className="min-h-screen bg-surface">
      {/* Shared report banner */}
      <div className="bg-indigo-600 text-white py-2 px-4 text-center text-xs font-medium">
        This is a shared LaunchWise report &mdash;{" "}
        <Link href="/start" className="underline hover:no-underline font-semibold">
          Create your own free analysis →
        </Link>
      </div>

      {/* Report header */}
      <div className="bg-white border-b border-border py-8 sm:py-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm text-primary-500 font-medium mb-1">Shared Launch Plan</p>
              <h1 className="text-2xl sm:text-3xl font-bold text-primary-900">
                {report.intake.businessName
                  ? report.intake.businessName
                  : `${report.intake.userName}'s Plan`}
              </h1>
              <p className="text-text-muted mt-1 text-sm">
                {report.intake.industry} &middot; {report.intake.city},{" "}
                {report.intake.state} &middot; {createdAt}
              </p>
            </div>
            <Link
              href="/start"
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary-600 text-white text-sm font-semibold hover:bg-primary-700 transition-colors"
            >
              Get My Own Plan
            </Link>
          </div>
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

        <ViabilityScore viability={report.viability} />
        <BusinessSummary intake={report.intake} profile={report.profile} />
        <IdeaAnalysis analysis={report.ideaAnalysis} />
        <StartupRoadmap roadmap={report.roadmap} />
        <LocalRequirements requirements={report.localRequirements} />
        <CompetitorSnapshot competitors={report.competitors} />
        <BrandingFeedback branding={report.branding} />
        <NinetyDayPlan plan={report.ninetyDayPlan} />
        <PartnerRecommendations partners={report.partners} />

        {/* CTA */}
        <div className="text-center py-8 border-t border-border">
          <p className="text-lg font-bold text-primary-900 mb-2">
            Ready to analyze your own idea?
          </p>
          <p className="text-text-muted text-sm mb-6">
            Get a free AI-powered startup plan in about 5 minutes.
          </p>
          <Link
            href="/start"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary-600 text-white font-semibold hover:bg-primary-700 transition-colors"
          >
            Start My Plan — It&apos;s Free
          </Link>
        </div>
      </div>
    </div>
  );
}
