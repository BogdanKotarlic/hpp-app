import QuoteCard from "../QuoteCard";
import { render, screen } from "@testing-library/react";

describe("QuoteCard", () => {
  it("renders children inside the card", () => {
    render(
      <QuoteCard>
        <p>Test content</p>
      </QuoteCard>
    );

    expect(screen.getByText("Test content")).toBeInTheDocument();
  });

  it("has the expected layout classes", () => {
    const { container } = render(
      <QuoteCard>
        <p>Test</p>
      </QuoteCard>
    );

    const card = container.firstChild as HTMLElement;
    expect(card).toHaveClass(
      "max-w-md",
      "mx-auto",
      "mt-10",
      "p-6",
      "rounded-xl",
      "bg-white",
      "shadow-md"
    );
  });
});
