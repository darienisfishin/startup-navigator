import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import IntakeForm from "@/components/IntakeForm";

// Mock analytics to avoid ESM issues with @vercel/analytics
jest.mock("@/lib/analytics", () => ({
  trackFormStart: jest.fn(),
  trackFormComplete: jest.fn(),
  trackReportGenerated: jest.fn(),
}));

// Mock next/navigation router
const mockPush = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}));

// Mock global fetch
global.fetch = jest.fn();

// Mock sessionStorage
const sessionStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => { store[key] = value; },
    removeItem: (key: string) => { delete store[key]; },
    clear: () => { store = {}; },
  };
})();
Object.defineProperty(window, "sessionStorage", { value: sessionStorageMock });

describe("IntakeForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    sessionStorageMock.clear();
  });

  describe("initial render", () => {
    it("renders step 1 title", () => {
      render(<IntakeForm />);
      expect(screen.getByText(/Tell us about you and your idea/i)).toBeInTheDocument();
    });

    it("renders the 5-step progress labels", () => {
      render(<IntakeForm />);
      expect(screen.getByText("You & Your Idea")).toBeInTheDocument();
      expect(screen.getByText("Location")).toBeInTheDocument();
      expect(screen.getByText("Competition")).toBeInTheDocument();
      expect(screen.getByText("Details")).toBeInTheDocument();
      expect(screen.getByText("Review")).toBeInTheDocument();
    });

    it("renders a name input field on step 1", () => {
      render(<IntakeForm />);
      expect(screen.getByPlaceholderText(/enter your full name/i)).toBeInTheDocument();
    });

    it("does not show Back button on step 1", () => {
      render(<IntakeForm />);
      expect(screen.queryByRole("button", { name: /back/i })).not.toBeInTheDocument();
    });
  });

  describe("step 1: validation", () => {
    it("Continue button is disabled when name is empty", () => {
      render(<IntakeForm />);
      const continueButton = screen.getByRole("button", { name: /continue/i });
      expect(continueButton).toBeDisabled();
    });

    it("Continue button remains disabled when only name is filled (missing idea/type/industry)", async () => {
      const user = userEvent.setup();
      render(<IntakeForm />);
      await user.type(screen.getByPlaceholderText(/enter your full name/i), "Jane Smith");
      // idea, type and industry are still blank — Continue should be disabled
      expect(screen.getByRole("button", { name: /continue/i })).toBeDisabled();
    });

    it("Continue becomes enabled when name, idea, type, and industry are all provided", async () => {
      const user = userEvent.setup();
      render(<IntakeForm />);
      await user.type(screen.getByPlaceholderText(/enter your full name/i), "Jane Smith");
      await user.type(
        screen.getByPlaceholderText(/what do you want to build/i),
        "A gluten-free specialty bakery serving health-conscious customers in Austin."
      );
      fireEvent.click(screen.getByText("product"));
      await user.selectOptions(screen.getByRole("combobox"), "Bakery / Desserts");
      expect(screen.getByRole("button", { name: /continue/i })).not.toBeDisabled();
    });

    it("renders product/service toggle buttons on step 1", () => {
      render(<IntakeForm />);
      expect(screen.getByText("product")).toBeInTheDocument();
      expect(screen.getByText("service")).toBeInTheDocument();
      expect(screen.getByText("both")).toBeInTheDocument();
    });

    it("renders the industry dropdown on step 1", () => {
      render(<IntakeForm />);
      expect(screen.getByRole("combobox")).toBeInTheDocument();
      expect(screen.getByText("Choose an industry")).toBeInTheDocument();
    });
  });

  describe("step navigation", () => {
    async function completeStep1() {
      const user = userEvent.setup();
      render(<IntakeForm />);
      await user.type(screen.getByPlaceholderText(/enter your full name/i), "Jane Smith");
      await user.type(
        screen.getByPlaceholderText(/what do you want to build/i),
        "A gluten-free specialty bakery serving health-conscious customers in Austin."
      );
      fireEvent.click(screen.getByText("product"));
      await user.selectOptions(screen.getByRole("combobox"), "Bakery / Desserts");
      fireEvent.click(screen.getByRole("button", { name: /continue/i }));
      return user;
    }

    it("advances to step 2 after completing step 1", async () => {
      await completeStep1();
      await waitFor(() => {
        expect(screen.getByText(/Where will you operate/i)).toBeInTheDocument();
      });
    });

    it("shows Back button from step 2 onwards", async () => {
      await completeStep1();
      await waitFor(() => {
        expect(screen.getByRole("button", { name: /back/i })).toBeInTheDocument();
      });
    });

    it("goes back to step 1 when Back is clicked from step 2", async () => {
      await completeStep1();
      await waitFor(() => screen.getByRole("button", { name: /back/i }));
      fireEvent.click(screen.getByRole("button", { name: /back/i }));
      await waitFor(() => {
        expect(screen.getByText(/Tell us about you and your idea/i)).toBeInTheDocument();
      });
    });

    it("step 3 (Competition) has no required fields — Continue is always enabled", async () => {
      const user = userEvent.setup();
      render(<IntakeForm />);

      // Step 1
      await user.type(screen.getByPlaceholderText(/enter your full name/i), "Jane");
      await user.type(
        screen.getByPlaceholderText(/what do you want to build/i),
        "A specialty gluten-free bakery serving health-conscious customers in downtown Austin."
      );
      fireEvent.click(screen.getByText("product"));
      await user.selectOptions(screen.getByRole("combobox"), "Bakery / Desserts");
      fireEvent.click(screen.getByRole("button", { name: /continue/i }));

      // Step 2
      await waitFor(() => screen.getByText(/Where will you operate/i));
      await user.type(screen.getAllByRole("textbox")[0], "Austin");
      await user.selectOptions(screen.getByRole("combobox"), "Texas");
      fireEvent.click(screen.getByRole("button", { name: /continue/i }));

      // Step 3: no required fields, Continue always enabled
      await waitFor(() => screen.getByText(/Do you know your competition/i));
      expect(screen.getByRole("button", { name: /continue/i })).not.toBeDisabled();
    });
  });

  describe("step 4 (Details): stage and capital validation", () => {
    async function goToStep4() {
      const user = userEvent.setup();
      render(<IntakeForm />);

      // Step 1
      await user.type(screen.getByPlaceholderText(/enter your full name/i), "Jane");
      await user.type(
        screen.getByPlaceholderText(/what do you want to build/i),
        "A specialty bakery with unique offerings for health-conscious customers in Austin."
      );
      fireEvent.click(screen.getByText("product"));
      await user.selectOptions(screen.getByRole("combobox"), "Bakery / Desserts");
      fireEvent.click(screen.getByRole("button", { name: /continue/i }));

      // Step 2
      await waitFor(() => screen.getByText(/Where will you operate/i));
      await user.type(screen.getAllByRole("textbox")[0], "Austin");
      await user.selectOptions(screen.getByRole("combobox"), "Texas");
      fireEvent.click(screen.getByRole("button", { name: /continue/i }));

      // Step 3: no required fields
      await waitFor(() => screen.getByText(/Do you know your competition/i));
      fireEvent.click(screen.getByRole("button", { name: /continue/i }));

      // Step 4
      await waitFor(() => screen.getByText(/A few more details/i));
      return user;
    }

    it("Continue is disabled when stage and capital are not selected", async () => {
      await goToStep4();
      expect(screen.getByRole("button", { name: /continue/i })).toBeDisabled();
    });

    it("renders stage option buttons on step 4", async () => {
      await goToStep4();
      expect(screen.getByText("Just an Idea")).toBeInTheDocument();
      expect(screen.getByText("Planning")).toBeInTheDocument();
      expect(screen.getByText("Already Started")).toBeInTheDocument();
    });
  });

  describe("form submission", () => {
    it("submit button shows 'Generate My Plan' on step 5", async () => {
      const user = userEvent.setup();
      render(<IntakeForm />);

      // Step 1
      await user.type(screen.getByPlaceholderText(/enter your full name/i), "Jane");
      await user.type(
        screen.getByPlaceholderText(/what do you want to build/i),
        "A specialty bakery with unique offerings for health-conscious customers in Austin."
      );
      fireEvent.click(screen.getByText("product"));
      await user.selectOptions(screen.getByRole("combobox"), "Bakery / Desserts");
      fireEvent.click(screen.getByRole("button", { name: /continue/i }));

      // Step 2
      await waitFor(() => screen.getByText(/Where will you operate/i));
      await user.type(screen.getAllByRole("textbox")[0], "Austin");
      await user.selectOptions(screen.getByRole("combobox"), "Texas");
      fireEvent.click(screen.getByRole("button", { name: /continue/i }));

      // Step 3: no required fields
      await waitFor(() => screen.getByText(/Do you know your competition/i));
      fireEvent.click(screen.getByRole("button", { name: /continue/i }));

      // Step 4: stage + capital required
      await waitFor(() => screen.getByText(/A few more details/i));
      fireEvent.click(screen.getByText("Planning"));
      await user.selectOptions(screen.getByRole("combobox"), "$10,000 - $25,000");
      fireEvent.click(screen.getByRole("button", { name: /continue/i }));

      // Step 5: Review
      await waitFor(() => screen.getByText(/Looking good/i));
      expect(screen.getByRole("button", { name: /generate my plan/i })).toBeInTheDocument();
    });

    it("shows error text when fetch fails", async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: "Analysis failed" }),
      });

      const user = userEvent.setup();
      render(<IntakeForm />);

      // Navigate to step 5
      await user.type(screen.getByPlaceholderText(/enter your full name/i), "Jane");
      await user.type(
        screen.getByPlaceholderText(/what do you want to build/i),
        "A specialty bakery with unique offerings for health-conscious customers in Austin."
      );
      fireEvent.click(screen.getByText("product"));
      await user.selectOptions(screen.getByRole("combobox"), "Bakery / Desserts");
      fireEvent.click(screen.getByRole("button", { name: /continue/i }));

      await waitFor(() => screen.getByText(/Where will you operate/i));
      await user.type(screen.getAllByRole("textbox")[0], "Austin");
      await user.selectOptions(screen.getByRole("combobox"), "Texas");
      fireEvent.click(screen.getByRole("button", { name: /continue/i }));

      await waitFor(() => screen.getByText(/Do you know your competition/i));
      fireEvent.click(screen.getByRole("button", { name: /continue/i }));

      await waitFor(() => screen.getByText(/A few more details/i));
      fireEvent.click(screen.getByText("Planning"));
      await user.selectOptions(screen.getByRole("combobox"), "$10,000 - $25,000");
      fireEvent.click(screen.getByRole("button", { name: /continue/i }));

      await waitFor(() => screen.getByText(/Looking good/i));

      fireEvent.click(screen.getByRole("button", { name: /generate my plan/i }));

      await waitFor(() => {
        expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
      });
    });
  });
});
