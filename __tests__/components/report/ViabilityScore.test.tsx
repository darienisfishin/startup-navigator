import { render, screen } from "@testing-library/react";
import ViabilityScore from "@/components/report/ViabilityScore";
import type { ViabilityAssessment } from "@/lib/types";

function makeViability(overrides: Partial<ViabilityAssessment> = {}): ViabilityAssessment {
  return {
    overallScore: 75,
    competitionDensity: 60,
    localDemand: 80,
    startupComplexity: 65,
    pricingFeasibility: 70,
    differentiationScore: 85,
    verdict: "This is a strong business concept with clear differentiation.",
    topStrengths: ["Dedicated GF facility", "Growing market demand"],
    topRisks: ["High startup costs", "Competitive market"],
    criticalFirstSteps: ["Register LLC", "Find commercial kitchen", "Apply for permits"],
    ...overrides,
  };
}

describe("ViabilityScore", () => {
  describe("score display", () => {
    it("renders the overall score as a percentage", () => {
      render(<ViabilityScore viability={makeViability({ overallScore: 75 })} />);
      expect(screen.getByText("75%")).toBeInTheDocument();
    });

    it("renders score of 0%", () => {
      render(<ViabilityScore viability={makeViability({ overallScore: 0 })} />);
      expect(screen.getByText("0%")).toBeInTheDocument();
    });

    it("renders score of 100%", () => {
      render(<ViabilityScore viability={makeViability({ overallScore: 100 })} />);
      expect(screen.getByText("100%")).toBeInTheDocument();
    });

    it("renders score of 50%", () => {
      render(<ViabilityScore viability={makeViability({ overallScore: 50 })} />);
      expect(screen.getByText("50%")).toBeInTheDocument();
    });

    it("shows 'Viability' label below the score", () => {
      render(<ViabilityScore viability={makeViability()} />);
      expect(screen.getByText("Viability")).toBeInTheDocument();
    });
  });

  describe("section heading", () => {
    it("renders the section title", () => {
      render(<ViabilityScore viability={makeViability()} />);
      expect(screen.getByText("Startup Viability Assessment")).toBeInTheDocument();
    });
  });

  describe("sub-scores", () => {
    it("renders all five sub-score labels", () => {
      render(<ViabilityScore viability={makeViability()} />);
      expect(screen.getByText("Local Demand")).toBeInTheDocument();
      expect(screen.getByText("Pricing Feasibility")).toBeInTheDocument();
      expect(screen.getByText("Differentiation")).toBeInTheDocument();
      expect(screen.getByText("Competition Density")).toBeInTheDocument();
      expect(screen.getByText("Startup Complexity")).toBeInTheDocument();
    });

    it("renders sub-score values as percentages", () => {
      render(<ViabilityScore viability={makeViability({
        localDemand: 80,
        pricingFeasibility: 70,
        differentiationScore: 85,
        competitionDensity: 60,
        startupComplexity: 65,
      })} />);
      expect(screen.getByText("80%")).toBeInTheDocument();
      expect(screen.getByText("70%")).toBeInTheDocument();
      expect(screen.getByText("85%")).toBeInTheDocument();
      expect(screen.getByText("60%")).toBeInTheDocument();
      expect(screen.getByText("65%")).toBeInTheDocument();
    });
  });

  describe("verdict", () => {
    it("renders the verdict text", () => {
      const verdict = "This is a strong business concept with clear differentiation.";
      render(<ViabilityScore viability={makeViability({ verdict })} />);
      expect(screen.getByText(verdict)).toBeInTheDocument();
    });
  });

  describe("strengths and risks", () => {
    it("renders Top Strengths section", () => {
      render(<ViabilityScore viability={makeViability()} />);
      expect(screen.getByText("Top Strengths")).toBeInTheDocument();
    });

    it("renders Key Risks section", () => {
      render(<ViabilityScore viability={makeViability()} />);
      expect(screen.getByText("Key Risks")).toBeInTheDocument();
    });

    it("renders each strength", () => {
      render(<ViabilityScore viability={makeViability({
        topStrengths: ["Dedicated GF facility", "Growing market demand"],
      })} />);
      expect(screen.getByText("Dedicated GF facility")).toBeInTheDocument();
      expect(screen.getByText("Growing market demand")).toBeInTheDocument();
    });

    it("renders each risk", () => {
      render(<ViabilityScore viability={makeViability({
        topRisks: ["High startup costs", "Competitive market"],
      })} />);
      expect(screen.getByText("High startup costs")).toBeInTheDocument();
      expect(screen.getByText("Competitive market")).toBeInTheDocument();
    });

    it("renders empty lists gracefully", () => {
      render(<ViabilityScore viability={makeViability({ topStrengths: [], topRisks: [] })} />);
      expect(screen.getByText("Top Strengths")).toBeInTheDocument();
      expect(screen.getByText("Key Risks")).toBeInTheDocument();
    });
  });

  describe("critical first steps", () => {
    it("renders Critical First Steps section", () => {
      render(<ViabilityScore viability={makeViability()} />);
      expect(screen.getByText("Critical First Steps")).toBeInTheDocument();
    });

    it("renders each critical step", () => {
      render(<ViabilityScore viability={makeViability({
        criticalFirstSteps: ["Register LLC", "Find commercial kitchen", "Apply for permits"],
      })} />);
      expect(screen.getByText("Register LLC")).toBeInTheDocument();
      expect(screen.getByText("Find commercial kitchen")).toBeInTheDocument();
      expect(screen.getByText("Apply for permits")).toBeInTheDocument();
    });

    it("renders step numbers starting from 1", () => {
      render(<ViabilityScore viability={makeViability({
        criticalFirstSteps: ["First step", "Second step"],
      })} />);
      expect(screen.getByText("1")).toBeInTheDocument();
      expect(screen.getByText("2")).toBeInTheDocument();
    });
  });
});
