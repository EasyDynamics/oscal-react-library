import { render, screen } from "@testing-library/react";
import React from "react";
import { HoverablePopover } from "./HoverablePopover";
import userEvent from "@testing-library/user-event";

const hoverText = "Hover Text";
const popoverText = "Popover Text";

describe("HoverablePopover", () => {
  it("Displays text as children component", () => {
    render(<HoverablePopover popoverContent={popoverText}>{hoverText}</HoverablePopover>);

    const hover = screen.getByText(hoverText);

    expect(hover).toBeVisible();
  });

  it("Displays text as Popover component", async () => {
    render(<HoverablePopover popoverContent={popoverText}>{hoverText}</HoverablePopover>);

    const hover = screen.getByText(/hover text/i);
    userEvent.hover(hover);

    const popover = await screen.findByText(popoverText);
    expect(popover).toBeVisible();
  });
});
