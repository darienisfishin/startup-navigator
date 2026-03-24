import { render, screen } from "@testing-library/react";
import ScrollReveal from "@/components/ScrollReveal";

// Mock IntersectionObserver which doesn't exist in jsdom
const mockIntersectionObserver = jest.fn(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));
Object.defineProperty(window, "IntersectionObserver", {
  writable: true,
  configurable: true,
  value: mockIntersectionObserver,
});

describe("ScrollReveal", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders its children", () => {
    render(
      <ScrollReveal>
        <p>Hello world</p>
      </ScrollReveal>
    );
    expect(screen.getByText("Hello world")).toBeInTheDocument();
  });

  it("wraps children in a div with scroll-reveal class", () => {
    const { container } = render(
      <ScrollReveal>
        <span>Child content</span>
      </ScrollReveal>
    );
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.tagName).toBe("DIV");
    expect(wrapper.classList.contains("scroll-reveal")).toBe(true);
  });

  it("applies additional className prop", () => {
    const { container } = render(
      <ScrollReveal className="my-custom-class">
        <span>Content</span>
      </ScrollReveal>
    );
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.classList.contains("my-custom-class")).toBe(true);
    expect(wrapper.classList.contains("scroll-reveal")).toBe(true);
  });

  it("sets up an IntersectionObserver on mount", () => {
    render(
      <ScrollReveal>
        <span>Content</span>
      </ScrollReveal>
    );
    expect(mockIntersectionObserver).toHaveBeenCalledTimes(1);
    // Should observe with threshold: 0.1
    expect(mockIntersectionObserver).toHaveBeenCalledWith(
      expect.any(Function),
      expect.objectContaining({ threshold: 0.1 })
    );
  });

  it("renders multiple children correctly", () => {
    render(
      <ScrollReveal>
        <h1>Title</h1>
        <p>Paragraph</p>
        <button>Click me</button>
      </ScrollReveal>
    );
    expect(screen.getByText("Title")).toBeInTheDocument();
    expect(screen.getByText("Paragraph")).toBeInTheDocument();
    expect(screen.getByText("Click me")).toBeInTheDocument();
  });

  it("works without className prop (defaults to empty string)", () => {
    const { container } = render(
      <ScrollReveal>
        <span>Content</span>
      </ScrollReveal>
    );
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.className).toBe("scroll-reveal ");
  });
});
