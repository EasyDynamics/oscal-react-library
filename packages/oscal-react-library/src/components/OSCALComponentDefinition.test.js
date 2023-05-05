import React from "react";
import { render, screen } from "@testing-library/react";
import { OSCALComponentLoader } from "./OSCALLoader";
import OSCALComponentDefinition from "./OSCALComponentDefinition";
import { componentDefinitionTestData } from "../test-data/ComponentsData";
import userEvent from "@testing-library/user-event";

describe("OSCALComponentDefinition", () => {
  it("loads", () => {
    render(<OSCALComponentLoader />);
  });

  it("shows component title", () => {
    render(<OSCALComponentDefinition componentDefinition={componentDefinitionTestData} />);
    const result = screen.getByText("Example Component");
    expect(result).toBeVisible();
  });

  it("shows component description", async () => {
    render(<OSCALComponentDefinition componentDefinition={componentDefinitionTestData} />);
    await userEvent.hover(screen.getByText("Example Component"));
    expect(await screen.findByText("An example component.")).toBeInTheDocument();
  });
});
