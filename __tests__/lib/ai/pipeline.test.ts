import type { IntakeFormData } from "@/lib/types";

// ─── Mock the Anthropic SDK before importing pipeline ───────────────────────
// Use `var` so the declaration is hoisted and accessible inside the jest.mock factory
// eslint-disable-next-line no-var
var mockCreate: jest.Mock;

jest.mock("@anthropic-ai/sdk", () => {
  // `mockCreate` var is hoisted so assignment here works correctly
  mockCreate = jest.fn();
  return {
    __esModule: true,
    default: jest.fn(() => ({
      messages: { create: mockCreate },
    })),
  };
});

// ─── Mock prompt builders so we can verify they are called ──────────────────
jest.mock("@/lib/ai/prompts", () => ({
  buildIntakeNormalizerPrompt: jest.fn(() => "mock-normalizer-prompt"),
  buildBusinessAnalystPrompt: jest.fn(() => "mock-analyst-prompt"),
  buildLocalCompliancePrompt: jest.fn(() => "mock-compliance-prompt"),
  buildCompetitorAnalysisPrompt: jest.fn(() => "mock-competitor-prompt"),
  buildBrandingCritiquePrompt: jest.fn(() => "mock-branding-prompt"),
  buildRoadmapPrompt: jest.fn(() => "mock-roadmap-prompt"),
  buildPartnerRecommendationPrompt: jest.fn(() => "mock-partner-prompt"),
  buildViabilityAssessmentPrompt: jest.fn(() => "mock-viability-prompt"),
}));

import { runAIPipeline } from "@/lib/ai/pipeline";
import * as prompts from "@/lib/ai/prompts";

const mockIntake: IntakeFormData = {
  userName: "Jane Smith",
  businessName: "Sunny Side Bakery",
  businessIdea: "A specialty bakery offering gluten-free baked goods.",
  productOrService: "product",
  industry: "Bakery / Desserts",
  city: "Austin",
  county: "Travis",
  state: "Texas",
  knowsCompetitors: true,
  competitors: "Local competitors",
  differentiator: "Dedicated gluten-free facility",
  hasLogo: false,
  logoFile: null,
  hasWebsite: false,
  websiteUrl: "",
  stage: "planning",
  capitalRange: "$10,000 - $25,000",
};

// Helper: produce a mock Claude text response with embedded JSON
function makeClaudeResponse(json: object) {
  return {
    content: [{ type: "text", text: JSON.stringify(json) }],
  };
}

const normalizerResponse = makeClaudeResponse({
  isLegitimate: true,
  industryCategory: "Bakery",
  customerType: "B2C",
  businessModel: "Retail",
  regulatoryComplexity: "medium",
  startupCostEstimate: "$15,000",
  likelyBusinessType: "LLC",
});

const analystResponse = makeClaudeResponse({
  marketDemand: "high",
  competitionLevel: "moderate",
  differentiationStrength: "strong",
  startupDifficulty: "moderate",
  profitPotential: "high",
  ideaScore: 8,
  summary: "Solid idea with clear differentiation.",
  strengths: ["Dedicated facility", "Growing market"],
  risks: ["High rent costs"],
  recommendations: ["Start with farmers markets"],
});

const complianceResponse = makeClaudeResponse({
  requirements: [
    {
      task: "Register LLC",
      description: "Register with Texas SOS.",
      link: "https://sos.state.tx.us",
      confidence: "verified",
      category: "registration",
    },
  ],
});

const competitorResponse = makeClaudeResponse({
  competitors: [
    {
      name: "Local Bakeries",
      rating: 4.2,
      reviewCount: 150,
      strengths: ["Established brand"],
    },
  ],
  marketGaps: ["No dedicated GF facility nearby"],
  positioningAssessment: "Strong differentiation.",
  competitiveAdvice: ["Emphasize certification"],
});

const brandingResponse = makeClaudeResponse({
  nameAnalysis: {
    memorability: 8,
    clarity: 7,
    relevance: 9,
    pronunciation: 9,
    distinctiveness: 7,
    overallScore: 8.0,
    feedback: "Strong bakery name with clear imagery.",
    suggestions: ["Add tagline"],
  },
});

const roadmapResponse = makeClaudeResponse({
  roadmap: [
    {
      step: 1,
      title: "Register Business",
      description: "File LLC with Texas SOS.",
      timeframe: "Week 1",
      priority: "critical",
      category: "legal",
    },
  ],
  ninetyDayPlan: {
    weekOne: ["File LLC"],
    monthOne: ["Open bank account"],
    monthTwo: ["Set up POS system"],
    monthThree: ["Launch marketing"],
  },
});

const partnerResponse = makeClaudeResponse({
  partners: [
    {
      name: "ZenBusiness",
      category: "Business Formation",
      description: "LLC formation service.",
      why: "Affordable and fast for Texas LLCs.",
      url: "https://zenbusiness.com",
    },
  ],
});

const viabilityResponse = makeClaudeResponse({
  overallScore: 78,
  competitionDensity: 60,
  localDemand: 80,
  startupComplexity: 65,
  pricingFeasibility: 75,
  differentiationScore: 85,
  verdict: "Strong viability with clear market gap.",
  topStrengths: ["Dedicated GF facility"],
  topRisks: ["High startup costs"],
  criticalFirstSteps: ["Register LLC", "Find commercial kitchen"],
});

// Helper to set up all 8 mock responses in order
function setupAllMockResponses() {
  mockCreate
    .mockResolvedValueOnce(normalizerResponse)   // Module 1
    .mockResolvedValueOnce(analystResponse)      // Module 2 (parallel)
    .mockResolvedValueOnce(complianceResponse)   // Module 3 (parallel)
    .mockResolvedValueOnce(competitorResponse)   // Module 4 (parallel)
    .mockResolvedValueOnce(brandingResponse)     // Module 5 (parallel)
    .mockResolvedValueOnce(roadmapResponse)      // Module 6
    .mockResolvedValueOnce(partnerResponse)      // Module 7 (parallel)
    .mockResolvedValueOnce(viabilityResponse);   // Module 8 (parallel)
}

describe("runAIPipeline", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("module execution count", () => {
    it("calls Claude exactly 8 times (8 modules)", async () => {
      setupAllMockResponses();
      await runAIPipeline(mockIntake);
      expect(mockCreate).toHaveBeenCalledTimes(8);
    });
  });

  describe("module execution order", () => {
    it("calls Module 1 (normalizer) before the parallel modules 2-5", async () => {
      const callOrder: string[] = [];

      mockCreate.mockImplementation(async ({ messages }: { messages: Array<{ content: string }> }) => {
        const prompt = messages[0].content as string;
        if (prompt === "mock-normalizer-prompt") callOrder.push("normalizer");
        else if (prompt === "mock-analyst-prompt") callOrder.push("analyst");
        else if (prompt === "mock-compliance-prompt") callOrder.push("compliance");
        else if (prompt === "mock-competitor-prompt") callOrder.push("competitor");
        else if (prompt === "mock-branding-prompt") callOrder.push("branding");
        else if (prompt === "mock-roadmap-prompt") callOrder.push("roadmap");
        else if (prompt === "mock-partner-prompt") callOrder.push("partner");
        else if (prompt === "mock-viability-prompt") callOrder.push("viability");

        if (prompt === "mock-normalizer-prompt") return normalizerResponse;
        if (prompt === "mock-analyst-prompt") return analystResponse;
        if (prompt === "mock-compliance-prompt") return complianceResponse;
        if (prompt === "mock-competitor-prompt") return competitorResponse;
        if (prompt === "mock-branding-prompt") return brandingResponse;
        if (prompt === "mock-roadmap-prompt") return roadmapResponse;
        if (prompt === "mock-partner-prompt") return partnerResponse;
        return viabilityResponse;
      });

      await runAIPipeline(mockIntake);

      expect(callOrder[0]).toBe("normalizer");

      const roadmapIndex = callOrder.indexOf("roadmap");
      const analystIndex = callOrder.indexOf("analyst");
      const complianceIndex = callOrder.indexOf("compliance");
      expect(roadmapIndex).toBeGreaterThan(analystIndex);
      expect(roadmapIndex).toBeGreaterThan(complianceIndex);
    });
  });

  describe("return value shape", () => {
    beforeEach(setupAllMockResponses);

    it("returns a StartupReport with a rpt_ prefixed id", async () => {
      const report = await runAIPipeline(mockIntake);
      expect(report.id).toMatch(/^rpt_/);
    });

    it("returns a valid ISO createdAt timestamp", async () => {
      const report = await runAIPipeline(mockIntake);
      expect(new Date(report.createdAt).toISOString()).toBe(report.createdAt);
    });

    it("returns the intake data unchanged", async () => {
      const report = await runAIPipeline(mockIntake);
      expect(report.intake).toEqual(mockIntake);
    });

    it("returns profile from Module 1 with correct fields", async () => {
      const report = await runAIPipeline(mockIntake);
      expect(report.profile.industryCategory).toBe("Bakery");
      expect(report.profile.customerType).toBe("B2C");
      expect(report.profile.regulatoryComplexity).toBe("medium");
      expect(report.profile.likelyBusinessType).toBe("LLC");
    });

    it("returns ideaAnalysis from Module 2 with score and arrays", async () => {
      const report = await runAIPipeline(mockIntake);
      expect(report.ideaAnalysis.ideaScore).toBe(8);
      expect(report.ideaAnalysis.marketDemand).toBe("high");
      expect(Array.isArray(report.ideaAnalysis.strengths)).toBe(true);
      expect(Array.isArray(report.ideaAnalysis.risks)).toBe(true);
    });

    it("returns localRequirements array from Module 3", async () => {
      const report = await runAIPipeline(mockIntake);
      expect(Array.isArray(report.localRequirements)).toBe(true);
      expect(report.localRequirements[0].task).toBe("Register LLC");
      expect(report.localRequirements[0].confidence).toBe("verified");
      expect(report.localRequirements[0].category).toBe("registration");
    });

    it("returns competitors array from Module 4", async () => {
      const report = await runAIPipeline(mockIntake);
      expect(Array.isArray(report.competitors)).toBe(true);
      expect(report.competitors[0].name).toBe("Local Bakeries");
      expect(report.competitors[0].rating).toBe(4.2);
    });

    it("returns branding.nameAnalysis from Module 5", async () => {
      const report = await runAIPipeline(mockIntake);
      expect(report.branding.nameAnalysis.memorability).toBe(8);
      expect(report.branding.nameAnalysis.overallScore).toBe(8.0);
      expect(typeof report.branding.nameAnalysis.feedback).toBe("string");
    });

    it("returns roadmap steps from Module 6", async () => {
      const report = await runAIPipeline(mockIntake);
      expect(Array.isArray(report.roadmap)).toBe(true);
      expect(report.roadmap[0].title).toBe("Register Business");
      expect(report.roadmap[0].priority).toBe("critical");
      expect(report.roadmap[0].category).toBe("legal");
    });

    it("returns ninetyDayPlan with all four phases", async () => {
      const report = await runAIPipeline(mockIntake);
      expect(Array.isArray(report.ninetyDayPlan.weekOne)).toBe(true);
      expect(Array.isArray(report.ninetyDayPlan.monthOne)).toBe(true);
      expect(Array.isArray(report.ninetyDayPlan.monthTwo)).toBe(true);
      expect(Array.isArray(report.ninetyDayPlan.monthThree)).toBe(true);
      expect(report.ninetyDayPlan.weekOne).toContain("File LLC");
    });

    it("returns partners array from Module 7", async () => {
      const report = await runAIPipeline(mockIntake);
      expect(Array.isArray(report.partners)).toBe(true);
      expect(report.partners[0].name).toBe("ZenBusiness");
      expect(report.partners[0].url).toBe("https://zenbusiness.com");
    });

    it("returns viability assessment from Module 8", async () => {
      const report = await runAIPipeline(mockIntake);
      expect(report.viability.overallScore).toBe(78);
      expect(report.viability.differentiationScore).toBe(85);
      expect(Array.isArray(report.viability.criticalFirstSteps)).toBe(true);
    });
  });

  describe("prompt builder invocation", () => {
    beforeEach(setupAllMockResponses);

    it("calls buildIntakeNormalizerPrompt with intake data", async () => {
      await runAIPipeline(mockIntake);
      expect(prompts.buildIntakeNormalizerPrompt).toHaveBeenCalledWith(mockIntake);
    });

    it("calls buildBusinessAnalystPrompt with intake and normalized raw string", async () => {
      await runAIPipeline(mockIntake);
      expect(prompts.buildBusinessAnalystPrompt).toHaveBeenCalledWith(
        mockIntake,
        expect.any(String)
      );
    });

    it("calls buildBrandingCritiquePrompt with only intake (no normalizer output)", async () => {
      await runAIPipeline(mockIntake);
      expect(prompts.buildBrandingCritiquePrompt).toHaveBeenCalledWith(mockIntake);
    });

    it("calls buildRoadmapPrompt with four arguments", async () => {
      await runAIPipeline(mockIntake);
      expect(prompts.buildRoadmapPrompt).toHaveBeenCalledWith(
        mockIntake,
        expect.any(String), // normalizedRaw
        expect.any(String), // ideaRaw
        expect.any(String)  // complianceRaw
      );
    });

    it("calls buildViabilityAssessmentPrompt with four arguments", async () => {
      await runAIPipeline(mockIntake);
      expect(prompts.buildViabilityAssessmentPrompt).toHaveBeenCalledWith(
        mockIntake,
        expect.any(String), // normalizedRaw
        expect.any(String), // ideaRaw
        expect.any(String)  // competitorRaw
      );
    });
  });

  describe("fallback defaults on JSON parse failures", () => {
    it("throws when Claude returns non-JSON response for Module 1", async () => {
      mockCreate.mockResolvedValue({
        content: [{ type: "text", text: "This is not JSON at all" }],
      });
      await expect(runAIPipeline(mockIntake)).rejects.toThrow(
        "Intake Normalizer did not return valid JSON"
      );
    });

    it("uses fallback default values when JSON fields are missing", async () => {
      // Return empty objects for all modules
      mockCreate.mockResolvedValue(makeClaudeResponse({}));

      const report = await runAIPipeline(mockIntake);

      // Profile fallbacks
      expect(report.profile.customerType).toBe("B2C");
      expect(report.profile.regulatoryComplexity).toBe("medium");
      // IdeaAnalysis fallback score
      expect(report.ideaAnalysis.ideaScore).toBe(5);
      expect(report.ideaAnalysis.marketDemand).toBe("moderate");
      // Viability fallback score
      expect(report.viability.overallScore).toBe(50);
      // Arrays should be empty
      expect(report.localRequirements).toEqual([]);
      expect(report.competitors).toEqual([]);
      expect(report.partners).toEqual([]);
    });
  });
});
