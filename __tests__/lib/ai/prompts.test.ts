import {
  buildIntakeNormalizerPrompt,
  buildBusinessAnalystPrompt,
  buildLocalCompliancePrompt,
  buildCompetitorAnalysisPrompt,
  buildBrandingCritiquePrompt,
  buildRoadmapPrompt,
  buildPartnerRecommendationPrompt,
  buildViabilityAssessmentPrompt,
} from "@/lib/ai/prompts";
import type { IntakeFormData } from "@/lib/types";

const mockIntake: IntakeFormData = {
  userName: "Jane Smith",
  businessName: "Sunny Side Bakery",
  businessIdea: "A specialty bakery focusing on gluten-free and vegan baked goods in downtown Austin, serving health-conscious customers who struggle to find quality allergen-free options.",
  productOrService: "product",
  industry: "Bakery / Desserts",
  city: "Austin",
  county: "Travis",
  state: "Texas",
  knowsCompetitors: true,
  competitors: "Whole Foods bakery section, local gluten-free bakeries",
  differentiator: "100% dedicated gluten-free facility with vegan options, no cross-contamination risk",
  hasLogo: false,
  logoFile: null,
  hasWebsite: false,
  websiteUrl: "",
  stage: "planning",
  capitalRange: "$10,000 - $25,000",
};

describe("buildIntakeNormalizerPrompt", () => {
  it("returns a non-empty string", () => {
    const prompt = buildIntakeNormalizerPrompt(mockIntake);
    expect(typeof prompt).toBe("string");
    expect(prompt.length).toBeGreaterThan(0);
  });

  it("includes user-provided business details in the prompt", () => {
    const prompt = buildIntakeNormalizerPrompt(mockIntake);
    expect(prompt).toContain("Jane Smith");
    expect(prompt).toContain("Sunny Side Bakery");
    expect(prompt).toContain("Austin");
    expect(prompt).toContain("Texas");
  });

  it("instructs to return JSON with expected fields", () => {
    const prompt = buildIntakeNormalizerPrompt(mockIntake);
    expect(prompt).toContain("isLegitimate");
    expect(prompt).toContain("industryCategory");
    expect(prompt).toContain("customerType");
    expect(prompt).toContain("businessModel");
    expect(prompt).toContain("regulatoryComplexity");
  });

  it("uses 'Not provided' for missing optional fields", () => {
    const intakeNoCounty: IntakeFormData = { ...mockIntake, county: "", businessName: "" };
    const prompt = buildIntakeNormalizerPrompt(intakeNoCounty);
    expect(prompt).toContain("Not provided");
  });
});

describe("buildBusinessAnalystPrompt", () => {
  const normalizedProfile = '{"industryCategory":"Bakery","customerType":"B2C"}';

  it("returns a non-empty string", () => {
    const prompt = buildBusinessAnalystPrompt(mockIntake, normalizedProfile);
    expect(typeof prompt).toBe("string");
    expect(prompt.length).toBeGreaterThan(0);
  });

  it("includes the business idea and normalized profile", () => {
    const prompt = buildBusinessAnalystPrompt(mockIntake, normalizedProfile);
    expect(prompt).toContain(mockIntake.businessIdea);
    expect(prompt).toContain(normalizedProfile);
  });

  it("instructs to return JSON with scoring fields", () => {
    const prompt = buildBusinessAnalystPrompt(mockIntake, normalizedProfile);
    expect(prompt).toContain("marketDemand");
    expect(prompt).toContain("competitionLevel");
    expect(prompt).toContain("differentiationStrength");
    expect(prompt).toContain("ideaScore");
    expect(prompt).toContain("strengths");
    expect(prompt).toContain("risks");
    expect(prompt).toContain("recommendations");
  });

  it("includes scoring rules about score meanings", () => {
    const prompt = buildBusinessAnalystPrompt(mockIntake, normalizedProfile);
    expect(prompt).toContain("7+");
    expect(prompt).toContain("5-6");
  });
});

describe("buildLocalCompliancePrompt", () => {
  const normalizedProfile = '{"industryCategory":"Bakery","regulatoryComplexity":"medium"}';

  it("returns a non-empty string", () => {
    const prompt = buildLocalCompliancePrompt(mockIntake, normalizedProfile);
    expect(typeof prompt).toBe("string");
    expect(prompt.length).toBeGreaterThan(0);
  });

  it("includes location details", () => {
    const prompt = buildLocalCompliancePrompt(mockIntake, normalizedProfile);
    expect(prompt).toContain("Austin");
    expect(prompt).toContain("Texas");
  });

  it("instructs to return requirements array with expected fields", () => {
    const prompt = buildLocalCompliancePrompt(mockIntake, normalizedProfile);
    expect(prompt).toContain('"requirements"');
    expect(prompt).toContain('"task"');
    expect(prompt).toContain('"confidence"');
    expect(prompt).toContain('"category"');
  });

  it("specifies confidence levels", () => {
    const prompt = buildLocalCompliancePrompt(mockIntake, normalizedProfile);
    expect(prompt).toContain("verified");
    expect(prompt).toContain("likely");
    expect(prompt).toContain("verify");
  });
});

describe("buildCompetitorAnalysisPrompt", () => {
  const normalizedProfile = '{"industryCategory":"Bakery"}';

  it("returns a non-empty string", () => {
    const prompt = buildCompetitorAnalysisPrompt(mockIntake, normalizedProfile);
    expect(typeof prompt).toBe("string");
    expect(prompt.length).toBeGreaterThan(0);
  });

  it("includes user-listed competitors", () => {
    const prompt = buildCompetitorAnalysisPrompt(mockIntake, normalizedProfile);
    expect(prompt).toContain("Whole Foods bakery section");
  });

  it("instructs to return competitive landscape with expected fields", () => {
    const prompt = buildCompetitorAnalysisPrompt(mockIntake, normalizedProfile);
    expect(prompt).toContain('"competitorTypes"');
    expect(prompt).toContain('"marketGaps"');
    expect(prompt).toContain('"positioningAssessment"');
  });
});

describe("buildBrandingCritiquePrompt", () => {
  it("returns a non-empty string", () => {
    const prompt = buildBrandingCritiquePrompt(mockIntake);
    expect(typeof prompt).toBe("string");
    expect(prompt.length).toBeGreaterThan(0);
  });

  it("includes the business name", () => {
    const prompt = buildBrandingCritiquePrompt(mockIntake);
    expect(prompt).toContain("Sunny Side Bakery");
  });

  it("instructs to return nameAnalysis with scoring fields", () => {
    const prompt = buildBrandingCritiquePrompt(mockIntake);
    expect(prompt).toContain('"nameAnalysis"');
    expect(prompt).toContain('"memorability"');
    expect(prompt).toContain('"clarity"');
    expect(prompt).toContain('"relevance"');
    expect(prompt).toContain('"pronunciation"');
    expect(prompt).toContain('"distinctiveness"');
  });

  it("sets logoAnalysis to null when no logo", () => {
    const prompt = buildBrandingCritiquePrompt({ ...mockIntake, hasLogo: false });
    expect(prompt).toContain('"logoAnalysis": null');
  });

  it("includes logo guidance when hasLogo is true", () => {
    const prompt = buildBrandingCritiquePrompt({ ...mockIntake, hasLogo: true });
    // When hasLogo is true, the template includes a logo analysis object with placeholder values
    expect(prompt).toContain('"logoAnalysis"');
    expect(prompt).toContain('"readability"');
  });

  it("uses 'NOT PROVIDED' when no business name given", () => {
    const prompt = buildBrandingCritiquePrompt({ ...mockIntake, businessName: "" });
    expect(prompt).toContain("NOT PROVIDED");
  });
});

describe("buildRoadmapPrompt", () => {
  const normalizedProfile = '{"industryCategory":"Bakery"}';
  const ideaAnalysis = '{"ideaScore":7}';
  const localRequirements = '{"requirements":[]}';

  it("returns a non-empty string", () => {
    const prompt = buildRoadmapPrompt(mockIntake, normalizedProfile, ideaAnalysis, localRequirements);
    expect(typeof prompt).toBe("string");
    expect(prompt.length).toBeGreaterThan(0);
  });

  it("includes all previous analysis results", () => {
    const prompt = buildRoadmapPrompt(mockIntake, normalizedProfile, ideaAnalysis, localRequirements);
    expect(prompt).toContain(normalizedProfile);
    expect(prompt).toContain(ideaAnalysis);
    expect(prompt).toContain(localRequirements);
  });

  it("instructs to return roadmap and 90-day plan", () => {
    const prompt = buildRoadmapPrompt(mockIntake, normalizedProfile, ideaAnalysis, localRequirements);
    expect(prompt).toContain('"roadmap"');
    expect(prompt).toContain('"ninetyDayPlan"');
    expect(prompt).toContain('"weekOne"');
    expect(prompt).toContain('"monthOne"');
    expect(prompt).toContain('"monthTwo"');
    expect(prompt).toContain('"monthThree"');
  });

  it("specifies priority and category values", () => {
    const prompt = buildRoadmapPrompt(mockIntake, normalizedProfile, ideaAnalysis, localRequirements);
    expect(prompt).toContain("critical");
    expect(prompt).toContain("important");
    expect(prompt).toContain("recommended");
    expect(prompt).toContain("legal");
    expect(prompt).toContain("branding");
  });
});

describe("buildPartnerRecommendationPrompt", () => {
  const normalizedProfile = '{"industryCategory":"Bakery"}';

  it("returns a non-empty string", () => {
    const prompt = buildPartnerRecommendationPrompt(mockIntake, normalizedProfile);
    expect(typeof prompt).toBe("string");
    expect(prompt.length).toBeGreaterThan(0);
  });

  it("includes partner categories", () => {
    const prompt = buildPartnerRecommendationPrompt(mockIntake, normalizedProfile);
    expect(prompt).toContain("Business Formation");
    expect(prompt).toContain("Accounting");
    expect(prompt).toContain("Payments");
  });

  it("instructs to return partners array", () => {
    const prompt = buildPartnerRecommendationPrompt(mockIntake, normalizedProfile);
    expect(prompt).toContain('"partners"');
    expect(prompt).toContain('"name"');
    expect(prompt).toContain('"category"');
    expect(prompt).toContain('"why"');
    expect(prompt).toContain('"url"');
  });
});

describe("buildViabilityAssessmentPrompt", () => {
  const normalizedProfile = '{"industryCategory":"Bakery"}';
  const ideaAnalysis = '{"ideaScore":7}';
  const competitorAnalysis = '{"competitors":[]}';

  it("returns a non-empty string", () => {
    const prompt = buildViabilityAssessmentPrompt(mockIntake, normalizedProfile, ideaAnalysis, competitorAnalysis);
    expect(typeof prompt).toBe("string");
    expect(prompt.length).toBeGreaterThan(0);
  });

  it("includes all previous analysis", () => {
    const prompt = buildViabilityAssessmentPrompt(mockIntake, normalizedProfile, ideaAnalysis, competitorAnalysis);
    expect(prompt).toContain(normalizedProfile);
    expect(prompt).toContain(ideaAnalysis);
    expect(prompt).toContain(competitorAnalysis);
  });

  it("instructs to return overallScore 0-100 with sub-scores", () => {
    const prompt = buildViabilityAssessmentPrompt(mockIntake, normalizedProfile, ideaAnalysis, competitorAnalysis);
    expect(prompt).toContain('"overallScore"');
    expect(prompt).toContain('"competitionDensity"');
    expect(prompt).toContain('"localDemand"');
    expect(prompt).toContain('"startupComplexity"');
    expect(prompt).toContain('"pricingFeasibility"');
    expect(prompt).toContain('"differentiationScore"');
  });

  it("includes scoring guidelines", () => {
    const prompt = buildViabilityAssessmentPrompt(mockIntake, normalizedProfile, ideaAnalysis, competitorAnalysis);
    expect(prompt).toContain("80-100");
    expect(prompt).toContain("60-79");
    expect(prompt).toContain("0-19");
  });
});
