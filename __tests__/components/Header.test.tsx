import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Header from "@/components/Header";
import { AuthProvider } from "@/components/auth/AuthProvider";

// Mock Supabase client to avoid build-time errors
jest.mock("@/lib/supabase/client", () => ({
  createClient: jest.fn(() => ({
    auth: {
      getSession: jest.fn().mockResolvedValue({ data: { session: null } }),
      onAuthStateChange: jest.fn(() => ({
        data: { subscription: { unsubscribe: jest.fn() } },
      })),
      signOut: jest.fn(),
    },
  })),
}));

function renderHeader() {
  return render(
    <AuthProvider>
      <Header />
    </AuthProvider>
  );
}

// next/link is auto-mocked by next/jest; rendered as <a> elements
describe("Header", () => {
  describe("brand elements", () => {
    it("renders 'Launch' and 'Pilot' as part of the brand name", () => {
      renderHeader();
      // "LaunchPilot" is split across two elements: "Launch" + <span>Pilot</span>
      expect(screen.getByText("Launch", { exact: false })).toBeInTheDocument();
      expect(screen.getByText("Pilot")).toBeInTheDocument();
    });

    it("renders the logo 'L' icon", () => {
      renderHeader();
      // The desktop logo L icon
      const lIcons = screen.getAllByText("L");
      expect(lIcons.length).toBeGreaterThanOrEqual(1);
    });

    it("has a link to the home page", () => {
      renderHeader();
      // The home link contains "L" icon + "Launch" + "Pilot" text
      // Query by href attribute since the name is split across elements
      const homeLinks = screen.getAllByRole("link");
      const homeLink = homeLinks.find((l) => l.getAttribute("href") === "/");
      expect(homeLink).toBeInTheDocument();
    });
  });

  describe("desktop navigation", () => {
    it("renders How It Works link", () => {
      renderHeader();
      const links = screen.getAllByText("How It Works");
      expect(links.length).toBeGreaterThanOrEqual(1);
    });

    it("renders Features link", () => {
      renderHeader();
      const links = screen.getAllByText("Features");
      expect(links.length).toBeGreaterThanOrEqual(1);
    });

    it("renders Start My Plan link after auth loads", async () => {
      renderHeader();
      // Start My Plan is inside {!loading && (...)} so we must wait for auth to settle
      await waitFor(() => {
        const links = screen.getAllByText("Start My Plan");
        expect(links.length).toBeGreaterThanOrEqual(1);
      });
    });

    it("Start My Plan link points to /start", async () => {
      renderHeader();
      // Wait for auth to load so the CTA renders
      await waitFor(() => {
        const startLinks = screen.getAllByRole("link", { name: /start my plan/i });
        expect(startLinks[0]).toHaveAttribute("href", "/start");
      });
    });
  });

  describe("mobile menu toggle", () => {
    it("renders the mobile menu toggle button with aria-label", () => {
      renderHeader();
      const toggleButton = screen.getByRole("button", { name: /toggle menu/i });
      expect(toggleButton).toBeInTheDocument();
    });

    it("mobile menu is initially closed (only one set of nav links visible in desktop)", async () => {
      renderHeader();
      // Wait for auth to load so desktop nav links render
      await waitFor(() => screen.getAllByText("How It Works"));
      const howItWorksLinks = screen.getAllByText("How It Works");
      expect(howItWorksLinks.length).toBe(1);
    });

    it("opens mobile menu when toggle is clicked", async () => {
      renderHeader();
      // Wait for auth to settle before interacting
      await waitFor(() => screen.getByRole("button", { name: /toggle menu/i }));
      const toggleButton = screen.getByRole("button", { name: /toggle menu/i });

      fireEvent.click(toggleButton);

      // After open, both desktop and mobile nav links appear
      const howItWorksLinks = screen.getAllByText("How It Works");
      expect(howItWorksLinks.length).toBeGreaterThanOrEqual(2);
    });

    it("closes mobile menu on second toggle click", async () => {
      renderHeader();
      await waitFor(() => screen.getByRole("button", { name: /toggle menu/i }));
      const toggleButton = screen.getByRole("button", { name: /toggle menu/i });

      fireEvent.click(toggleButton); // open
      fireEvent.click(toggleButton); // close

      const howItWorksLinks = screen.getAllByText("How It Works");
      expect(howItWorksLinks.length).toBe(1);
    });

    it("closes mobile menu when a nav link is clicked", async () => {
      renderHeader();
      await waitFor(() => screen.getByRole("button", { name: /toggle menu/i }));
      const toggleButton = screen.getByRole("button", { name: /toggle menu/i });
      fireEvent.click(toggleButton); // open

      // Click the mobile "Start My Plan" link (in mobile menu)
      const startLinks = screen.getAllByText("Start My Plan");
      fireEvent.click(startLinks[startLinks.length - 1]);

      // Mobile menu should close
      const howItWorksLinks = screen.getAllByText("How It Works");
      expect(howItWorksLinks.length).toBe(1);
    });
  });
});
