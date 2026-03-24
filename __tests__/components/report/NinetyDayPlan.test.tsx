import { render, screen } from "@testing-library/react";
import NinetyDayPlan from "@/components/report/NinetyDayPlan";
import type { NinetyDayPlan as NinetyDayPlanType } from "@/lib/types";

const mockPlan: NinetyDayPlanType = {
  weekOne: [
    "File LLC with Texas Secretary of State",
    "Open a dedicated business bank account",
    "Research commercial kitchen options",
    "Apply for EIN from the IRS",
    "Create a basic business plan outline",
  ],
  monthOne: [
    "Complete LLC registration",
    "Secure commercial kitchen space",
    "Apply for food handler permits",
    "Design initial menu",
    "Set up accounting software",
    "Create social media profiles",
    "Build a basic website",
  ],
  monthTwo: [
    "Begin test baking production runs",
    "Develop pricing strategy",
    "Create marketing materials",
    "Set up online ordering system",
    "Schedule health inspection",
    "Hire first employee",
    "Launch pre-sale campaign",
  ],
  monthThree: [
    "Soft launch at local farmers market",
    "Gather customer feedback",
    "Refine menu based on feedback",
    "Launch full marketing campaign",
    "Evaluate financial performance",
    "Plan catering partnerships",
    "Prepare for brick-and-mortar expansion",
  ],
};

describe("NinetyDayPlan", () => {
  it("renders the section title", () => {
    render(<NinetyDayPlan plan={mockPlan} />);
    expect(screen.getByText("90-Day Launch Plan")).toBeInTheDocument();
  });

  it("renders the section subtitle", () => {
    render(<NinetyDayPlan plan={mockPlan} />);
    expect(screen.getByText(/go from idea to launched business/i)).toBeInTheDocument();
  });

  it("renders all four phase headings", () => {
    render(<NinetyDayPlan plan={mockPlan} />);
    expect(screen.getByText("Week 1")).toBeInTheDocument();
    expect(screen.getByText("Month 1")).toBeInTheDocument();
    expect(screen.getByText("Month 2")).toBeInTheDocument();
    expect(screen.getByText("Month 3")).toBeInTheDocument();
  });

  it("renders Week 1 items", () => {
    render(<NinetyDayPlan plan={mockPlan} />);
    expect(screen.getByText("File LLC with Texas Secretary of State")).toBeInTheDocument();
    expect(screen.getByText("Open a dedicated business bank account")).toBeInTheDocument();
  });

  it("renders Month 1 items", () => {
    render(<NinetyDayPlan plan={mockPlan} />);
    expect(screen.getByText("Complete LLC registration")).toBeInTheDocument();
    expect(screen.getByText("Set up accounting software")).toBeInTheDocument();
  });

  it("renders Month 2 items", () => {
    render(<NinetyDayPlan plan={mockPlan} />);
    expect(screen.getByText("Begin test baking production runs")).toBeInTheDocument();
    expect(screen.getByText("Launch pre-sale campaign")).toBeInTheDocument();
  });

  it("renders Month 3 items", () => {
    render(<NinetyDayPlan plan={mockPlan} />);
    expect(screen.getByText("Soft launch at local farmers market")).toBeInTheDocument();
    expect(screen.getByText("Prepare for brick-and-mortar expansion")).toBeInTheDocument();
  });

  it("renders phase abbreviation icons (1, 1, 2, 3)", () => {
    render(<NinetyDayPlan plan={mockPlan} />);
    // Phase labels: "Week 1", "Month 1", "Month 2", "Month 3"
    // The icon shows: split()[1] => "1", "1", "2", "3"
    const ones = screen.getAllByText("1");
    expect(ones.length).toBeGreaterThanOrEqual(2); // Week 1 and Month 1
    expect(screen.getAllByText("2").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("3").length).toBeGreaterThanOrEqual(1);
  });

  it("renders empty phases gracefully", () => {
    const emptyPlan: NinetyDayPlanType = {
      weekOne: [],
      monthOne: [],
      monthTwo: [],
      monthThree: [],
    };
    render(<NinetyDayPlan plan={emptyPlan} />);
    expect(screen.getByText("Week 1")).toBeInTheDocument();
    expect(screen.getByText("Month 1")).toBeInTheDocument();
    expect(screen.getByText("Month 2")).toBeInTheDocument();
    expect(screen.getByText("Month 3")).toBeInTheDocument();
    // No list items
    expect(screen.queryByText("File LLC")).not.toBeInTheDocument();
  });

  it("renders all Week 1 items (5 items)", () => {
    render(<NinetyDayPlan plan={mockPlan} />);
    for (const item of mockPlan.weekOne) {
      expect(screen.getByText(item)).toBeInTheDocument();
    }
  });
});
