import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import OSCALControlGuidance from "./OSCALControlGuidance";

test("OSCALCatalog displays control guidance", async () => {
  const prose = "Access control policy";
  const id = "AC-1";
  const title = "Sample Title";
  render(<OSCALControlGuidance prose={prose} id={id} title={title} />);
  await userEvent.click(screen.getByRole("button"));
  const result = screen.getByText("Access control policy");
  expect(result).toBeVisible();
});
