import FullScreenSpinner from "../FullScreenSpinner";
import { render } from "@testing-library/react";

describe("FullScreenSpinner", () => {
  it("renders the spinner SVG", () => {
    const { container } = render(<FullScreenSpinner />);
    const svg = container.querySelector("svg");

    expect(svg).toBeInTheDocument();
    expect(svg).toHaveClass("animate-spin");
    expect(svg).toHaveClass("text-[#3F53DD]");
  });

  it("has the correct animation and color classes", () => {
    render(<FullScreenSpinner />);
    const loader = document.querySelector("svg");

    expect(loader).toHaveClass("animate-spin");
    expect(loader).toHaveClass("text-[#3F53DD]");
  });
});
