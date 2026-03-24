import { render, screen, fireEvent } from "@testing-library/react";
import Header from "@/components/Header";

// next/link is auto-mocked by next/jest; rendered as <a> elements
describe("Header", () => {
  describe("brand elements", () => {
    it("renders 'Launch' and 'Wise' as part of the brand name", () => {
      render(<Header />);
      // "LaunchWise" is split across two elements: "Launch" + <span>Wise</span>
      expect(screen.getByText("Launch", { exact: false })).toBeInTheDocument();
      expect(screen.getByText("Wise")).toBeInTheDocument();
    });

    it("renders the logo 'L' icon", () => {
      render(<Header />);
      // The desktop logo L icon
      const lIcons = screen.getAllByText("L");
      expect(lIcons.length).toBeGreaterThanOrEqual(1);
    });

    it("has a link to the home page", () => {
      render(<Header />);
      // The home link contains "L" icon + "Launch" + "Wise" text
      // Query by href attribute since the name is split across elements
      const homeLinks = screen.getAllByRole("link");
      const homeLink = homeLinks.find((l) => l.getAttribute("href") === "/");
      expect(homeLink).toBeInTheDocument();
    });
  });

  describe("desktop navigation", () => {
    it("renders How It Works link", () => {
      render(<Header />);
      const links = screen.getAllByText("How It Works");
      expect(links.length).toBeGreaterThanOrEqual(1);
    });

    it("renders Features link", () => {
      render(<Header />);
      const links = screen.getAllByText("Features");
      expect(links.length).toBeGreaterThanOrEqual(1);
    });

    it("renders Start My Plan link", () => {
      render(<Header />);
      const links = screen.getAllByText("Start My Plan");
      expect(links.length).toBeGreaterThanOrEqual(1);
    });

    it("Start My Plan link points to /start", () => {
      render(<Header />);
      const startLinks = screen.getAllByRole("link", { name: /start my plan/i });
      expect(startLinks[0]).toHaveAttribute("href", "/start");
    });
  });

  describe("mobile menu toggle", () => {
    it("renders the mobile menu toggle button with aria-label", () => {
      render(<Header />);
      const toggleButton = screen.getByRole("button", { name: /toggle menu/i });
      expect(toggleButton).toBeInTheDocument();
    });

    it("mobile menu is initially closed (only one set of nav links)", () => {
      render(<Header />);
      const howItWorksLinks = screen.getAllByText("How It Works");
      expect(howItWorksLinks.length).toBe(1);
    });

    it("opens mobile menu when toggle is clicked", () => {
      render(<Header />);
      const toggleButton = screen.getByRole("button", { name: /toggle menu/i });

      fireEvent.click(toggleButton);

      // After open, both desktop and mobile nav links appear
      const howItWorksLinks = screen.getAllByText("How It Works");
      expect(howItWorksLinks.length).toBeGreaterThanOrEqual(2);
    });

    it("closes mobile menu on second toggle click", () => {
      render(<Header />);
      const toggleButton = screen.getByRole("button", { name: /toggle menu/i });

      fireEvent.click(toggleButton); // open
      fireEvent.click(toggleButton); // close

      const howItWorksLinks = screen.getAllByText("How It Works");
      expect(howItWorksLinks.length).toBe(1);
    });

    it("closes mobile menu when a nav link is clicked", () => {
      render(<Header />);
      const toggleButton = screen.getByRole("button", { name: /toggle menu/i });
      fireEvent.click(toggleButton); // open

      // Click the mobile "Start My Plan" link (last one is in mobile menu)
      const startLinks = screen.getAllByText("Start My Plan");
      fireEvent.click(startLinks[startLinks.length - 1]);

      // Mobile menu should close
      const howItWorksLinks = screen.getAllByText("How It Works");
      expect(howItWorksLinks.length).toBe(1);
    });
  });
});
