import { render, screen } from "@testing-library/react";
import StartupRoadmap from "@/components/report/StartupRoadmap";
import type { RoadmapStep } from "@/lib/types";

const mockRoadmap: RoadmapStep[] = [
  {
    step: 1,
    title: "Register Your LLC",
    description: "File your LLC with the Texas Secretary of State to establish legal identity.",
    timeframe: "Week 1",
    priority: "critical",
    category: "legal",
  },
  {
    step: 2,
    title: "Open Business Bank Account",
    description: "Separate personal and business finances from day one.",
    timeframe: "Week 1-2",
    priority: "important",
    category: "financial",
  },
  {
    step: 3,
    title: "Build Your Website",
    description: "Create a simple website to establish your online presence.",
    timeframe: "Week 3-4",
    priority: "recommended",
    category: "digital",
  },
];

describe("StartupRoadmap", () => {
  it("renders the section title", () => {
    render(<StartupRoadmap roadmap={mockRoadmap} />);
    expect(screen.getByText("Startup Roadmap")).toBeInTheDocument();
  });

  it("renders the section subtitle", () => {
    render(<StartupRoadmap roadmap={mockRoadmap} />);
    expect(screen.getByText(/personalized step-by-step action plan/i)).toBeInTheDocument();
  });

  it("renders all roadmap steps", () => {
    render(<StartupRoadmap roadmap={mockRoadmap} />);
    expect(screen.getByText("Register Your LLC")).toBeInTheDocument();
    expect(screen.getByText("Open Business Bank Account")).toBeInTheDocument();
    expect(screen.getByText("Build Your Website")).toBeInTheDocument();
  });

  it("renders step numbers", () => {
    render(<StartupRoadmap roadmap={mockRoadmap} />);
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
  });

  it("renders step descriptions", () => {
    render(<StartupRoadmap roadmap={mockRoadmap} />);
    expect(screen.getByText(/File your LLC with the Texas Secretary of State/)).toBeInTheDocument();
    expect(screen.getByText(/Separate personal and business finances/)).toBeInTheDocument();
  });

  it("renders timeframes", () => {
    render(<StartupRoadmap roadmap={mockRoadmap} />);
    expect(screen.getByText("Week 1")).toBeInTheDocument();
    expect(screen.getByText("Week 1-2")).toBeInTheDocument();
    expect(screen.getByText("Week 3-4")).toBeInTheDocument();
  });

  it("renders priority badges", () => {
    render(<StartupRoadmap roadmap={mockRoadmap} />);
    expect(screen.getByText("critical")).toBeInTheDocument();
    expect(screen.getByText("important")).toBeInTheDocument();
    expect(screen.getByText("recommended")).toBeInTheDocument();
  });

  it("renders category badges", () => {
    render(<StartupRoadmap roadmap={mockRoadmap} />);
    expect(screen.getByText("legal")).toBeInTheDocument();
    expect(screen.getByText("financial")).toBeInTheDocument();
    expect(screen.getByText("digital")).toBeInTheDocument();
  });

  it("renders an empty list gracefully", () => {
    render(<StartupRoadmap roadmap={[]} />);
    expect(screen.getByText("Startup Roadmap")).toBeInTheDocument();
    // No step items rendered
    expect(screen.queryByText("critical")).not.toBeInTheDocument();
  });

  it("renders a single step correctly", () => {
    render(<StartupRoadmap roadmap={[mockRoadmap[0]]} />);
    expect(screen.getByText("Register Your LLC")).toBeInTheDocument();
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.queryByText("2")).not.toBeInTheDocument();
  });
});
