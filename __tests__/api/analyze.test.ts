import type { IntakeFormData } from "@/lib/types";

// ─── Mock dependencies before importing the route ────────────────────────────
// Use `var` so declarations are hoisted and accessible inside jest.mock factories
// eslint-disable-next-line no-var
var mockGenerateMockReport: jest.Mock;
// eslint-disable-next-line no-var
var mockRunAIPipeline: jest.Mock;

jest.mock("@/lib/ai/mock-responses", () => {
  mockGenerateMockReport = jest.fn();
  return { generateMockReport: mockGenerateMockReport };
});

jest.mock("@/lib/ai/pipeline", () => {
  mockRunAIPipeline = jest.fn();
  return { runAIPipeline: mockRunAIPipeline };
});

// Mock NextResponse to work outside the Next.js runtime
jest.mock("next/server", () => ({
  NextResponse: {
    json: (data: unknown, init?: { status?: number }) => ({
      _data: data,
      _status: init?.status ?? 200,
      json: async () => data,
      status: init?.status ?? 200,
    }),
  },
}));

import { POST } from "@/app/api/analyze/route";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function makeRequest(body: unknown): Request {
  return {
    json: async () => body,
  } as unknown as Request;
}

const validIntake: IntakeFormData = {
  userName: "Jane Smith",
  businessName: "Sunny Side Bakery",
  businessIdea: "A specialty gluten-free bakery in downtown Austin.",
  productOrService: "product",
  industry: "Bakery / Desserts",
  city: "Austin",
  county: "Travis",
  state: "Texas",
  knowsCompetitors: true,
  competitors: "Local bakeries",
  differentiator: "Dedicated gluten-free facility with zero cross-contamination.",
  hasLogo: false,
  logoFile: null,
  hasWebsite: false,
  websiteUrl: "",
  stage: "planning",
  capitalRange: "$10,000 - $25,000",
};

const mockReport = {
  id: "rpt_abc123",
  createdAt: new Date().toISOString(),
  intake: validIntake,
  profile: {
    industryCategory: "Bakery",
    customerType: "B2C",
    businessModel: "Retail",
    regulatoryComplexity: "medium",
    startupCostEstimate: "$15k",
    likelyBusinessType: "LLC",
  },
  ideaAnalysis: {
    marketDemand: "high",
    competitionLevel: "moderate",
    differentiationStrength: "strong",
    startupDifficulty: "moderate",
    profitPotential: "high",
    ideaScore: 8,
    summary: "Good idea.",
    strengths: [],
    risks: [],
    recommendations: [],
  },
  localRequirements: [],
  competitors: [],
  branding: {
    nameAnalysis: {
      memorability: 8,
      clarity: 7,
      relevance: 9,
      pronunciation: 9,
      distinctiveness: 7,
      overallScore: 8,
      feedback: "Good name.",
      suggestions: [],
    },
  },
  roadmap: [],
  ninetyDayPlan: { weekOne: [], monthOne: [], monthTwo: [], monthThree: [] },
  partners: [],
  viability: {
    overallScore: 78,
    competitionDensity: 60,
    localDemand: 80,
    startupComplexity: 65,
    pricingFeasibility: 75,
    differentiationScore: 85,
    verdict: "Strong.",
    topStrengths: [],
    topRisks: [],
    criticalFirstSteps: [],
  },
};

// ─── Tests ───────────────────────────────────────────────────────────────────

describe("POST /api/analyze", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    delete process.env.USE_REAL_AI;
    delete process.env.ANTHROPIC_API_KEY;
  });

  describe("request validation", () => {
    it("returns 400 when userName is missing", async () => {
      const body = { ...validIntake, userName: "" };
      const res = await POST(makeRequest(body));
      expect(res._status).toBe(400);
      const data = await res.json();
      expect(data.error).toMatch(/missing required fields/i);
    });

    it("returns 400 when businessIdea is missing", async () => {
      const body = { ...validIntake, businessIdea: "" };
      const res = await POST(makeRequest(body));
      expect(res._status).toBe(400);
      const data = await res.json();
      expect(data.error).toMatch(/missing required fields/i);
    });

    it("returns 400 when state is missing", async () => {
      const body = { ...validIntake, state: "" };
      const res = await POST(makeRequest(body));
      expect(res._status).toBe(400);
      const data = await res.json();
      expect(data.error).toMatch(/missing required fields/i);
    });

    it("returns 400 when all three required fields are missing", async () => {
      const body = { ...validIntake, userName: "", businessIdea: "", state: "" };
      const res = await POST(makeRequest(body));
      expect(res._status).toBe(400);
    });

    it("returns 400 with error message mentioning missing fields", async () => {
      const body = { ...validIntake, userName: "" };
      const res = await POST(makeRequest(body));
      const data = await res.json();
      expect(typeof data.error).toBe("string");
    });
  });

  describe("mock mode (default / USE_REAL_AI not set)", () => {
    it("calls generateMockReport when USE_REAL_AI is not set", async () => {
      mockGenerateMockReport.mockReturnValue(mockReport);
      await POST(makeRequest(validIntake));
      expect(mockGenerateMockReport).toHaveBeenCalledWith(validIntake);
      expect(mockRunAIPipeline).not.toHaveBeenCalled();
    });

    it("returns 200 with the mock report", async () => {
      mockGenerateMockReport.mockReturnValue(mockReport);
      const res = await POST(makeRequest(validIntake));
      expect(res._status).toBe(200);
      const data = await res.json();
      expect(data.id).toBe("rpt_abc123");
    });

    it("calls generateMockReport when USE_REAL_AI is 'false'", async () => {
      process.env.USE_REAL_AI = "false";
      mockGenerateMockReport.mockReturnValue(mockReport);
      await POST(makeRequest(validIntake));
      expect(mockGenerateMockReport).toHaveBeenCalled();
      expect(mockRunAIPipeline).not.toHaveBeenCalled();
    });

    it("uses mock mode when ANTHROPIC_API_KEY is the placeholder value", async () => {
      process.env.USE_REAL_AI = "true";
      process.env.ANTHROPIC_API_KEY = "your-anthropic-api-key-here";
      mockGenerateMockReport.mockReturnValue(mockReport);
      await POST(makeRequest(validIntake));
      expect(mockGenerateMockReport).toHaveBeenCalled();
      expect(mockRunAIPipeline).not.toHaveBeenCalled();
    });

    it("uses mock mode when ANTHROPIC_API_KEY is missing even if USE_REAL_AI=true", async () => {
      process.env.USE_REAL_AI = "true";
      delete process.env.ANTHROPIC_API_KEY;
      mockGenerateMockReport.mockReturnValue(mockReport);
      await POST(makeRequest(validIntake));
      expect(mockGenerateMockReport).toHaveBeenCalled();
    });
  });

  describe("real AI mode", () => {
    beforeEach(() => {
      process.env.USE_REAL_AI = "true";
      process.env.ANTHROPIC_API_KEY = "sk-ant-real-key-here";
    });

    it("calls runAIPipeline when USE_REAL_AI=true and valid API key is set", async () => {
      mockRunAIPipeline.mockResolvedValue(mockReport);
      const res = await POST(makeRequest(validIntake));
      expect(mockRunAIPipeline).toHaveBeenCalledWith(validIntake);
      expect(mockGenerateMockReport).not.toHaveBeenCalled();
      expect(res._status).toBe(200);
    });

    it("passes the full intake body to runAIPipeline", async () => {
      mockRunAIPipeline.mockResolvedValue(mockReport);
      await POST(makeRequest(validIntake));
      expect(mockRunAIPipeline).toHaveBeenCalledWith(
        expect.objectContaining({
          userName: "Jane Smith",
          businessIdea: "A specialty gluten-free bakery in downtown Austin.",
          state: "Texas",
        })
      );
    });

    it("returns the full report from runAIPipeline", async () => {
      mockRunAIPipeline.mockResolvedValue(mockReport);
      const res = await POST(makeRequest(validIntake));
      const data = await res.json();
      expect(data.id).toBe("rpt_abc123");
      expect(data.viability.overallScore).toBe(78);
    });
  });

  describe("error handling", () => {
    it("returns 500 when generateMockReport throws", async () => {
      mockGenerateMockReport.mockImplementation(() => {
        throw new Error("Mock failure");
      });
      const res = await POST(makeRequest(validIntake));
      expect(res._status).toBe(500);
      const data = await res.json();
      expect(data.error).toMatch(/analysis failed/i);
    });

    it("returns 500 when runAIPipeline rejects", async () => {
      process.env.USE_REAL_AI = "true";
      process.env.ANTHROPIC_API_KEY = "sk-ant-real-key-here";
      mockRunAIPipeline.mockRejectedValue(new Error("API error"));
      const res = await POST(makeRequest(validIntake));
      expect(res._status).toBe(500);
      const data = await res.json();
      expect(data.error).toMatch(/analysis failed/i);
    });

    it("returns 500 when request.json() throws", async () => {
      const badReq = {
        json: async () => { throw new Error("Invalid JSON"); },
      } as unknown as Request;
      const res = await POST(badReq);
      expect(res._status).toBe(500);
    });
  });
});
