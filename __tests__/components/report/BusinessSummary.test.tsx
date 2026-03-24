import { render, screen } from "@testing-library/react";
import BusinessSummary from "@/components/report/BusinessSummary";
import type { IntakeFormData, BusinessProfile } from "@/lib/types";

const mockIntake: IntakeFormData = {
  userName: "Jane Smith",
  businessName: "Sunny Side Bakery",
  businessIdea: "A specialty gluten-free bakery serving health-conscious customers in downtown Austin.",
  productOrService: "product",
  industry: "Bakery / Desserts",
  city: "Austin",
  county: "Travis",
  state: "Texas",
  knowsCompetitors: true,
  competitors: "Local bakeries",
  differentiator: "Dedicated gluten-free facility",
  hasLogo: false,
  logoFile: null,
  hasWebsite: false,
  websiteUrl: "",
  stage: "planning",
  capitalRange: "$10,000 - $25,000",
};

const mockProfile: BusinessProfile = {
  industryCategory: "Bakery",
  customerType: "B2C",
  businessModel: "Retail direct-to-consumer",
  regulatoryComplexity: "medium",
  startupCostEstimate: "$15,000 - $25,000",
  likelyBusinessType: "LLC",
};

describe("BusinessSummary", () => {
  it("renders the section title", () => {
    render(<BusinessSummary intake={mockIntake} profile={mockProfile} />);
    expect(screen.getByText("Business Concept Summary")).toBeInTheDocument();
  });

  it("renders the business idea text", () => {
    render(<BusinessSummary intake={mockIntake} profile={mockProfile} />);
    expect(screen.getByText(mockIntake.businessIdea)).toBeInTheDocument();
  });

  it("renders the business name", () => {
    render(<BusinessSummary intake={mockIntake} profile={mockProfile} />);
    expect(screen.getByText("Sunny Side Bakery")).toBeInTheDocument();
  });

  it("shows 'Not yet decided' when business name is empty", () => {
    render(<BusinessSummary intake={{ ...mockIntake, businessName: "" }} profile={mockProfile} />);
    expect(screen.getByText("Not yet decided")).toBeInTheDocument();
  });

  it("renders the industry category from profile", () => {
    render(<BusinessSummary intake={mockIntake} profile={mockProfile} />);
    expect(screen.getByText("Bakery")).toBeInTheDocument();
  });

  it("renders the product/service type", () => {
    render(<BusinessSummary intake={mockIntake} profile={mockProfile} />);
    // "product" is rendered as-is
    expect(screen.getByText("product")).toBeInTheDocument();
  });

  it("renders 'Product & Service' when both are selected", () => {
    render(<BusinessSummary intake={{ ...mockIntake, productOrService: "both" }} profile={mockProfile} />);
    expect(screen.getByText("Product & Service")).toBeInTheDocument();
  });

  it("renders the target customer type", () => {
    render(<BusinessSummary intake={mockIntake} profile={mockProfile} />);
    expect(screen.getByText("B2C")).toBeInTheDocument();
  });

  it("renders the business model", () => {
    render(<BusinessSummary intake={mockIntake} profile={mockProfile} />);
    expect(screen.getByText("Retail direct-to-consumer")).toBeInTheDocument();
  });

  it("renders the recommended entity type", () => {
    render(<BusinessSummary intake={mockIntake} profile={mockProfile} />);
    expect(screen.getByText("LLC")).toBeInTheDocument();
  });

  it("renders the location with city, county, and state", () => {
    render(<BusinessSummary intake={mockIntake} profile={mockProfile} />);
    expect(screen.getByText("Austin, Travis, Texas")).toBeInTheDocument();
  });

  it("renders the location without county when not provided", () => {
    render(<BusinessSummary intake={{ ...mockIntake, county: "" }} profile={mockProfile} />);
    expect(screen.getByText("Austin, Texas")).toBeInTheDocument();
  });

  it("renders the regulatory complexity", () => {
    render(<BusinessSummary intake={mockIntake} profile={mockProfile} />);
    expect(screen.getByText("medium")).toBeInTheDocument();
  });

  it("renders the startup cost estimate", () => {
    render(<BusinessSummary intake={mockIntake} profile={mockProfile} />);
    expect(screen.getByText("$15,000 - $25,000")).toBeInTheDocument();
  });

  it("renders the business stage", () => {
    render(<BusinessSummary intake={mockIntake} profile={mockProfile} />);
    expect(screen.getByText("planning")).toBeInTheDocument();
  });

  it("renders all field labels", () => {
    render(<BusinessSummary intake={mockIntake} profile={mockProfile} />);
    expect(screen.getByText("Business Name")).toBeInTheDocument();
    expect(screen.getByText("Industry")).toBeInTheDocument();
    expect(screen.getByText("Type")).toBeInTheDocument();
    expect(screen.getByText("Target Customer")).toBeInTheDocument();
    expect(screen.getByText("Business Model")).toBeInTheDocument();
    expect(screen.getByText("Recommended Entity")).toBeInTheDocument();
    expect(screen.getByText("Location")).toBeInTheDocument();
    expect(screen.getByText("Regulatory Complexity")).toBeInTheDocument();
    expect(screen.getByText("Estimated Startup Cost")).toBeInTheDocument();
    expect(screen.getByText("Current Stage")).toBeInTheDocument();
  });
});
