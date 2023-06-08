import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { OSCALComponentLoader } from "./OSCALLoader";
import OSCALComponentDefinition from "./OSCALComponentDefinition";
import { componentDefinitionTestData } from "../test-data/ComponentsData";

test("OSCALComponentDefinition loads", () => {
  render(<OSCALComponentLoader />);
});

describe("OSCALComponentDefinition", () => {
  it("shows component title", () => {
    // GIVEN
    render(
      <OSCALComponentDefinition
        componentDefinition={componentDefinitionTestData}
        onResolutionComplete={() => {}}
      />
    );

    // THEN
    expect(screen.getByText("Example Content")).toBeVisible();
  });

  it("shows component description", async () => {
    // GIVEN
    render(
      <OSCALComponentDefinition
        componentDefinition={componentDefinitionTestData}
        onResolutionComplete={() => {}}
      />
    );

    // WHEN
    await userEvent.hover(screen.getByText("Example Component"));

    // THEN
    expect(await screen.findByText("An example component.")).toBeInTheDocument();
  });
});
