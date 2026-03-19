import Anthropic from "@anthropic-ai/sdk";
import type {
  StartupReport,
  IntakeFormData,
  BusinessProfile,
  IdeaAnalysis,
  LocalRequirement,
  Competitor,
  BrandingFeedback,
  RoadmapStep,
  NinetyDayPlan,
  PartnerRecommendation,
  ViabilityAssessment,
} from "@/lib/types";
import {
  buildIntakeNormalizerPrompt,
  buildBusinessAnalystPrompt,
  buildLocalCompliancePrompt,
  buildCompetitorAnalysisPrompt,
  buildBrandingCritiquePrompt,
  buildRoadmapPrompt,
  buildPartnerRecommendationPrompt,
  buildViabilityAssessmentPrompt,
} from "./prompts";

const anthropic = new Anthropic();
const MODEL = "claude-sonnet-4-20250514";

// ============================================================
// CORE: Call Claude and parse JSON response
// ============================================================

async function callClaude(prompt: string, moduleName: string): Promise<string> {
  console.log(`[Pipeline] Running module: ${moduleName}...`);
  const start = Date.now();

  const response = await anthropic.messages.create({
    model: MODEL,
    max_tokens: 4096,
    messages: [{ role: "user", content: prompt }],
  });

  const text =
    response.content[0].type === "text" ? response.content[0].text : "";

  const elapsed = Date.now() - start;
  console.log(`[Pipeline] ${moduleName} completed in ${elapsed}ms`);

  // Extract JSON from response (handle markdown code blocks)
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error(`${moduleName} did not return valid JSON`);
  }

  return jsonMatch[0];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function safeParseJSON(raw: string, moduleName: string): Record<string, any> | null {
  try {
    return JSON.parse(raw);
  } catch (e) {
    console.error(`[Pipeline] Failed to parse ${moduleName} JSON:`, e);
    return null;
  }
}

// ============================================================
// PIPELINE: Run all modules and assemble report
// ============================================================

export async function runAIPipeline(
  intake: IntakeFormData
): Promise<StartupReport> {
  const reportId = `rpt_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
  console.log(`[Pipeline] Starting analysis for report ${reportId}`);

  // ── Module 1: Intake Normalizer ──
  const normalizerRaw = await callClaude(
    buildIntakeNormalizerPrompt(intake),
    "Intake Normalizer"
  );
  const normalizedData = safeParseJSON(normalizerRaw, "Intake Normalizer");

  const profile: BusinessProfile = {
    industryCategory: normalizedData?.industryCategory || intake.industry || "Unspecified",
    customerType: normalizedData?.customerType || "B2C",
    businessModel: normalizedData?.businessModel || "Not determined",
    regulatoryComplexity: normalizedData?.regulatoryComplexity || "medium",
    startupCostEstimate: normalizedData?.startupCostEstimate || intake.capitalRange || "Not specified",
    likelyBusinessType: normalizedData?.likelyBusinessType || "LLC",
  };

  // ── Module 2 & 3 & 4 & 5: Run in parallel (independent of each other) ──
  const [ideaRaw, complianceRaw, competitorRaw, brandingRaw] =
    await Promise.all([
      callClaude(
        buildBusinessAnalystPrompt(intake, normalizerRaw),
        "Business Analyst"
      ),
      callClaude(
        buildLocalCompliancePrompt(intake, normalizerRaw),
        "Local Compliance"
      ),
      callClaude(
        buildCompetitorAnalysisPrompt(intake, normalizerRaw),
        "Competitor Analysis"
      ),
      callClaude(buildBrandingCritiquePrompt(intake), "Branding Critique"),
    ]);

  // Parse Module 2: Idea Analysis
  const ideaParsed = safeParseJSON(ideaRaw, "Business Analyst");
  const ideaAnalysis: IdeaAnalysis = {
    marketDemand: ideaParsed?.marketDemand || "moderate",
    competitionLevel: ideaParsed?.competitionLevel || "moderate",
    differentiationStrength: ideaParsed?.differentiationStrength || "moderate",
    startupDifficulty: ideaParsed?.startupDifficulty || "moderate",
    profitPotential: ideaParsed?.profitPotential || "moderate",
    ideaScore: ideaParsed?.ideaScore ?? 5,
    summary: ideaParsed?.summary || "Analysis could not be completed.",
    strengths: ideaParsed?.strengths || [],
    risks: ideaParsed?.risks || [],
    recommendations: ideaParsed?.recommendations || [],
  };

  // Parse Module 3: Local Requirements
  const complianceParsed = safeParseJSON(complianceRaw, "Local Compliance");
  const localRequirements: LocalRequirement[] = (
    complianceParsed?.requirements || []
  ).map(
    (r: { task?: string; description?: string; link?: string; confidence?: string; category?: string }) => ({
      task: r.task || "Unknown requirement",
      description: r.description || "",
      link: r.link || undefined,
      confidence: (r.confidence as "verified" | "likely" | "verify") || "likely",
      category: (r.category as LocalRequirement["category"]) || "other",
    })
  );

  // Parse Module 4: Competitors
  const competitorParsed = safeParseJSON(competitorRaw, "Competitor Analysis");
  const competitors: Competitor[] = (competitorParsed?.competitors || []).map(
    (c: { name?: string; rating?: number; reviewCount?: number; distance?: string; website?: string; instagram?: string; strengths?: string[] }) => ({
      name: c.name || "Unknown",
      rating: c.rating || 0,
      reviewCount: c.reviewCount || 0,
      distance: c.distance || undefined,
      website: c.website || undefined,
      instagram: c.instagram || undefined,
      strengths: c.strengths || [],
    })
  );

  // Parse Module 5: Branding
  const brandingParsed = safeParseJSON(brandingRaw, "Branding Critique");
  const branding: BrandingFeedback = {
    nameAnalysis: {
      memorability: brandingParsed?.nameAnalysis?.memorability ?? 0,
      clarity: brandingParsed?.nameAnalysis?.clarity ?? 0,
      relevance: brandingParsed?.nameAnalysis?.relevance ?? 0,
      pronunciation: brandingParsed?.nameAnalysis?.pronunciation ?? 0,
      distinctiveness: brandingParsed?.nameAnalysis?.distinctiveness ?? 0,
      overallScore: brandingParsed?.nameAnalysis?.overallScore ?? 0,
      feedback: brandingParsed?.nameAnalysis?.feedback || "Name analysis unavailable.",
      suggestions: brandingParsed?.nameAnalysis?.suggestions || [],
    },
    logoAnalysis: brandingParsed?.logoAnalysis || undefined,
  };

  // ── Module 6: Roadmap (depends on modules 2 & 3) ──
  const roadmapRaw = await callClaude(
    buildRoadmapPrompt(intake, normalizerRaw, ideaRaw, complianceRaw),
    "Roadmap Generator"
  );
  const roadmapParsed = safeParseJSON(roadmapRaw, "Roadmap Generator");

  const roadmap: RoadmapStep[] = (roadmapParsed?.roadmap || []).map(
    (s: { step?: number; title?: string; description?: string; timeframe?: string; priority?: string; category?: string }, i: number) => ({
      step: s.step || i + 1,
      title: s.title || `Step ${i + 1}`,
      description: s.description || "",
      timeframe: s.timeframe || "",
      priority: (s.priority as RoadmapStep["priority"]) || "important",
      category: (s.category as RoadmapStep["category"]) || "operations",
    })
  );

  const ninetyDayPlan: NinetyDayPlan = {
    weekOne: roadmapParsed?.ninetyDayPlan?.weekOne || [],
    monthOne: roadmapParsed?.ninetyDayPlan?.monthOne || [],
    monthTwo: roadmapParsed?.ninetyDayPlan?.monthTwo || [],
    monthThree: roadmapParsed?.ninetyDayPlan?.monthThree || [],
  };

  // ── Module 7: Partners (depends on module 1) ──
  // ── Module 8: Viability (depends on modules 1, 2, 4) ──
  const [partnerRaw, viabilityRaw] = await Promise.all([
    callClaude(
      buildPartnerRecommendationPrompt(intake, normalizerRaw),
      "Partner Recommendations"
    ),
    callClaude(
      buildViabilityAssessmentPrompt(intake, normalizerRaw, ideaRaw, competitorRaw),
      "Viability Assessment"
    ),
  ]);

  // Parse Module 7: Partners
  const partnerParsed = safeParseJSON(partnerRaw, "Partner Recommendations");
  const partners: PartnerRecommendation[] = (
    partnerParsed?.partners || []
  ).map(
    (p: { name?: string; category?: string; description?: string; why?: string; url?: string }) => ({
      name: p.name || "Unknown",
      category: p.category || "Other",
      description: p.description || "",
      why: p.why || "",
      url: p.url || "#",
    })
  );

  // Parse Module 8: Viability
  const viabilityParsed = safeParseJSON(viabilityRaw, "Viability Assessment");
  const viability: ViabilityAssessment = {
    overallScore: viabilityParsed?.overallScore ?? 50,
    competitionDensity: viabilityParsed?.competitionDensity ?? 50,
    localDemand: viabilityParsed?.localDemand ?? 50,
    startupComplexity: viabilityParsed?.startupComplexity ?? 50,
    pricingFeasibility: viabilityParsed?.pricingFeasibility ?? 50,
    differentiationScore: viabilityParsed?.differentiationScore ?? 50,
    verdict: viabilityParsed?.verdict || "Viability assessment could not be completed.",
    topStrengths: viabilityParsed?.topStrengths || [],
    topRisks: viabilityParsed?.topRisks || [],
    criticalFirstSteps: viabilityParsed?.criticalFirstSteps || [],
  };

  console.log(`[Pipeline] Analysis complete for report ${reportId}`);

  return {
    id: reportId,
    createdAt: new Date().toISOString(),
    intake,
    profile,
    ideaAnalysis,
    localRequirements,
    competitors,
    branding,
    roadmap,
    ninetyDayPlan,
    partners,
    viability,
  };
}
