import { render, screen } from "@testing-library/react";
import Footer from "@/components/Footer";

describe("Footer", () => {
  it("renders 'Launch' and 'Pilot' as parts of the brand name", () => {
    render(<Footer />);
    // "LaunchPilot" is split across two elements: "Launch" text + <span>Pilot</span>
    // Use getAllByText since "launch" also appears in the description text
    const launchElements = screen.getAllByText("Launch", { exact: false });
    expect(launchElements.length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("Pilot")).toBeInTheDocument();
  });

  it("renders the logo 'L' icon", () => {
    render(<Footer />);
    const lIcons = screen.getAllByText("L");
    expect(lIcons.length).toBeGreaterThanOrEqual(1);
  });

  it("renders the brand description text", () => {
    render(<Footer />);
    expect(
      screen.getByText(/AI-powered startup navigator/i)
    ).toBeInTheDocument();
  });

  it("renders navigation links", () => {
    render(<Footer />);
    expect(screen.getByText("How It Works")).toBeInTheDocument();
    expect(screen.getByText("Features")).toBeInTheDocument();
    expect(screen.getByText("Pricing")).toBeInTheDocument();
  });

  it("renders the Product section heading", () => {
    render(<Footer />);
    expect(screen.getByText("Product")).toBeInTheDocument();
  });

  it("renders the copyright notice with current year", () => {
    render(<Footer />);
    const year = new Date().getFullYear().toString();
    const copyright = screen.getByText(new RegExp(year));
    expect(copyright).toBeInTheDocument();
    expect(copyright.textContent).toContain("LaunchPilot");
  });

  it("renders the legal disclaimer", () => {
    render(<Footer />);
    expect(
      screen.getByText(/Planning tool only — not legal, tax, or professional advice/i)
    ).toBeInTheDocument();
  });

  it("How It Works link points to /#how-it-works", () => {
    render(<Footer />);
    const link = screen.getByRole("link", { name: /how it works/i });
    expect(link).toHaveAttribute("href", "/#how-it-works");
  });

  it("renders the Legal section heading", () => {
    render(<Footer />);
    expect(screen.getByText("Legal")).toBeInTheDocument();
  });

  it("renders Privacy Policy and Terms of Service links", () => {
    render(<Footer />);
    expect(screen.getByText("Privacy Policy")).toBeInTheDocument();
    expect(screen.getByText("Terms of Service")).toBeInTheDocument();
  });
});
