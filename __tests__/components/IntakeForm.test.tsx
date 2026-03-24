import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import IntakeForm from "@/components/IntakeForm";

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
      expect(screen.getByText(/First, what's your name/i)).toBeInTheDocument();
    });

    it("renders the 7-step progress labels", () => {
      render(<IntakeForm />);
      expect(screen.getByText("You")).toBeInTheDocument();
      expect(screen.getByText("Idea")).toBeInTheDocument();
      expect(screen.getByText("Location")).toBeInTheDocument();
      expect(screen.getByText("Competition")).toBeInTheDocument();
      expect(screen.getByText("Branding")).toBeInTheDocument();
      expect(screen.getByText("Stage")).toBeInTheDocument();
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

  describe("step 1: name validation", () => {
    it("Continue button is disabled when name is empty", () => {
      render(<IntakeForm />);
      // The continue button is disabled when canAdvance() is false
      const continueButton = screen.getByRole("button", { name: /continue/i });
      expect(continueButton).toBeDisabled();
    });

    it("Continue button becomes enabled when name is entered", async () => {
      const user = userEvent.setup();
      render(<IntakeForm />);
      await user.type(screen.getByPlaceholderText(/enter your full name/i), "Jane Smith");
      expect(screen.getByRole("button", { name: /continue/i })).not.toBeDisabled();
    });

    it("does not enable Continue when name is only whitespace", async () => {
      const user = userEvent.setup();
      render(<IntakeForm />);
      await user.type(screen.getByPlaceholderText(/enter your full name/i), "   ");
      expect(screen.getByRole("button", { name: /continue/i })).toBeDisabled();
    });
  });

  describe("step navigation", () => {
    it("advances to step 2 after completing step 1", async () => {
      const user = userEvent.setup();
      render(<IntakeForm />);
      await user.type(screen.getByPlaceholderText(/enter your full name/i), "Jane Smith");
      fireEvent.click(screen.getByRole("button", { name: /continue/i }));
      await waitFor(() => {
        expect(screen.getByText(/what's your business idea/i)).toBeInTheDocument();
      });
    });

    it("shows Back button from step 2 onwards", async () => {
      const user = userEvent.setup();
      render(<IntakeForm />);
      await user.type(screen.getByPlaceholderText(/enter your full name/i), "Jane Smith");
      fireEvent.click(screen.getByRole("button", { name: /continue/i }));
      await waitFor(() => {
        expect(screen.getByRole("button", { name: /back/i })).toBeInTheDocument();
      });
    });

    it("goes back to step 1 when Back is clicked from step 2", async () => {
      const user = userEvent.setup();
      render(<IntakeForm />);
      await user.type(screen.getByPlaceholderText(/enter your full name/i), "Jane Smith");
      fireEvent.click(screen.getByRole("button", { name: /continue/i }));
      await waitFor(() => screen.getByRole("button", { name: /back/i }));
      fireEvent.click(screen.getByRole("button", { name: /back/i }));
      await waitFor(() => {
        expect(screen.getByText(/First, what's your name/i)).toBeInTheDocument();
      });
    });

    it("step 4 (Competition) has no required fields — Continue is always enabled", async () => {
      const user = userEvent.setup();
      render(<IntakeForm />);

      // Step 1
      await user.type(screen.getByPlaceholderText(/enter your full name/i), "Jane");
      fireEvent.click(screen.getByRole("button", { name: /continue/i }));

      // Step 2
      await waitFor(() => screen.getByPlaceholderText(/what do you want to build/i));
      await user.type(
        screen.getByPlaceholderText(/what do you want to build/i),
        "A specialty gluten-free bakery serving health-conscious customers in downtown Austin."
      );
      fireEvent.click(screen.getByText("product"));
      await user.selectOptions(screen.getByRole("combobox"), "Bakery / Desserts");
      fireEvent.click(screen.getByRole("button", { name: /continue/i }));

      // Step 3
      await waitFor(() => screen.getByText(/Where will you operate/i));
      await user.type(screen.getAllByRole("textbox")[0], "Austin");
      await user.selectOptions(screen.getByRole("combobox"), "Texas");
      fireEvent.click(screen.getByRole("button", { name: /continue/i }));

      // Step 4: no required fields, Continue always enabled
      await waitFor(() => screen.getByText(/Do you know your competition/i));
      expect(screen.getByRole("button", { name: /continue/i })).not.toBeDisabled();
    });
  });

  describe("step 2: idea validation", () => {
    async function goToStep2() {
      const user = userEvent.setup();
      render(<IntakeForm />);
      await user.type(screen.getByPlaceholderText(/enter your full name/i), "Jane Smith");
      fireEvent.click(screen.getByRole("button", { name: /continue/i }));
      await waitFor(() => screen.getByText(/what's your business idea/i));
      return user;
    }

    it("Continue is disabled when idea is too short (≤10 chars)", async () => {
      const user = await goToStep2();
      await user.type(screen.getByPlaceholderText(/what do you want to build/i), "Short");
      expect(screen.getByRole("button", { name: /continue/i })).toBeDisabled();
    });

    it("Continue is disabled when product/service type not selected", async () => {
      const user = await goToStep2();
      await user.type(
        screen.getByPlaceholderText(/what do you want to build/i),
        "A great business idea with enough detail to satisfy the minimum length requirement."
      );
      // No product/service selection — Continue should be disabled
      expect(screen.getByRole("button", { name: /continue/i })).toBeDisabled();
    });

    it("Continue is disabled when industry not selected but type is chosen", async () => {
      const user = await goToStep2();
      await user.type(
        screen.getByPlaceholderText(/what do you want to build/i),
        "A great business idea with enough detail to satisfy the minimum length requirement."
      );
      fireEvent.click(screen.getByText("service"));
      // Still no industry — Continue should be disabled
      expect(screen.getByRole("button", { name: /continue/i })).toBeDisabled();
    });

    it("Continue becomes enabled when idea, type, and industry are all provided", async () => {
      const user = await goToStep2();
      await user.type(
        screen.getByPlaceholderText(/what do you want to build/i),
        "A gluten-free specialty bakery serving health-conscious customers in Austin."
      );
      fireEvent.click(screen.getByText("product"));
      await user.selectOptions(screen.getByRole("combobox"), "Bakery / Desserts");
      expect(screen.getByRole("button", { name: /continue/i })).not.toBeDisabled();
    });

    it("renders product/service toggle buttons on step 2", async () => {
      await goToStep2();
      expect(screen.getByText("product")).toBeInTheDocument();
      expect(screen.getByText("service")).toBeInTheDocument();
      expect(screen.getByText("both")).toBeInTheDocument();
    });

    it("renders the industry dropdown on step 2", async () => {
      await goToStep2();
      expect(screen.getByRole("combobox")).toBeInTheDocument();
      expect(screen.getByText("Choose an industry")).toBeInTheDocument();
    });
  });

  describe("step 6: stage and capital validation", () => {
    async function goToStep6() {
      const user = userEvent.setup();
      render(<IntakeForm />);

      // Step 1
      await user.type(screen.getByPlaceholderText(/enter your full name/i), "Jane");
      fireEvent.click(screen.getByRole("button", { name: /continue/i }));

      // Step 2
      await waitFor(() => screen.getByPlaceholderText(/what do you want to build/i));
      await user.type(
        screen.getByPlaceholderText(/what do you want to build/i),
        "A specialty bakery with unique offerings for health-conscious customers in Austin."
      );
      fireEvent.click(screen.getByText("product"));
      await user.selectOptions(screen.getByRole("combobox"), "Bakery / Desserts");
      fireEvent.click(screen.getByRole("button", { name: /continue/i }));

      // Step 3
      await waitFor(() => screen.getByText(/Where will you operate/i));
      await user.type(screen.getAllByRole("textbox")[0], "Austin");
      await user.selectOptions(screen.getByRole("combobox"), "Texas");
      fireEvent.click(screen.getByRole("button", { name: /continue/i }));

      // Step 4: no required fields
      await waitFor(() => screen.getByText(/Do you know your competition/i));
      fireEvent.click(screen.getByRole("button", { name: /continue/i }));

      // Step 5: no required fields
      await waitFor(() => screen.getByText(/Let's talk branding/i));
      fireEvent.click(screen.getByRole("button", { name: /continue/i }));

      // Step 6
      await waitFor(() => screen.getByText(/Where are you in the process/i));
      return user;
    }

    it("Continue is disabled when stage and capital are not selected", async () => {
      await goToStep6();
      expect(screen.getByRole("button", { name: /continue/i })).toBeDisabled();
    });

    it("renders stage option buttons on step 6", async () => {
      await goToStep6();
      expect(screen.getByText("Just an Idea")).toBeInTheDocument();
      expect(screen.getByText("Planning")).toBeInTheDocument();
      expect(screen.getByText("Already Started")).toBeInTheDocument();
    });
  });

  describe("form submission", () => {
    it("submit button shows 'Generate My Plan' on step 7", async () => {
      const user = userEvent.setup();
      render(<IntakeForm />);

      // Navigate to step 7 by going through all steps
      await user.type(screen.getByPlaceholderText(/enter your full name/i), "Jane");
      fireEvent.click(screen.getByRole("button", { name: /continue/i }));

      await waitFor(() => screen.getByPlaceholderText(/what do you want to build/i));
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

      await waitFor(() => screen.getByText(/Let's talk branding/i));
      fireEvent.click(screen.getByRole("button", { name: /continue/i }));

      await waitFor(() => screen.getByText(/Where are you in the process/i));
      fireEvent.click(screen.getByText("Planning"));
      await user.selectOptions(screen.getByRole("combobox"), "$10,000 - $25,000");
      fireEvent.click(screen.getByRole("button", { name: /continue/i }));

      await waitFor(() => screen.getByText(/Looking good/i));
      expect(screen.getByRole("button", { name: /generate my plan/i })).toBeInTheDocument();
    });

    it("shows error text area when fetch fails", async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: "Analysis failed" }),
      });

      const user = userEvent.setup();
      render(<IntakeForm />);

      // Navigate to step 7
      await user.type(screen.getByPlaceholderText(/enter your full name/i), "Jane");
      fireEvent.click(screen.getByRole("button", { name: /continue/i }));
      await waitFor(() => screen.getByPlaceholderText(/what do you want to build/i));
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
      await waitFor(() => screen.getByText(/Let's talk branding/i));
      fireEvent.click(screen.getByRole("button", { name: /continue/i }));
      await waitFor(() => screen.getByText(/Where are you in the process/i));
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
