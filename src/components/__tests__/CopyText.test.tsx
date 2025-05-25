import CopyText from "../CopyText";
import { render, screen, fireEvent } from "@testing-library/react";

beforeEach(() => {
  Object.assign(navigator, {
    clipboard: {
      writeText: jest.fn(),
    },
  });
});

describe("CopyText", () => {
  it('shows "Copied!" when clicked', async () => {
    render(<CopyText value="test" display="Copy" />);
    fireEvent.click(screen.getByText("Copy"));
    expect(await screen.findByText(/copied/i)).toBeInTheDocument();
  });

  it("calls navigator.clipboard.writeText with the correct value", () => {
    render(<CopyText value="hello world" display="Copy" />);
    fireEvent.click(screen.getByText("Copy"));
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith("hello world");
  });
});
