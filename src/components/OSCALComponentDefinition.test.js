import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { OSCALComponentLoader } from "./OSCALLoader";
import OSCALComponentDefinition from "./OSCALComponentDefinition";
import testOSCALMetadata from "./OSCALMetadata.test";
import testOSCALResponsibleRoles from "./OSCALResponsibleRoles.test";
import { componentDefinitionTestData } from "../test-data/ComponentsData";

test("OSCALComponentDefinition loads", () => {
  render(<OSCALComponentLoader />);
});

function componentDefinitionRenderer() {
  render(
    <OSCALComponentDefinition
      componentDefinition={componentDefinitionTestData}
    />
  );
}

function testOSCALComponentDefinitionComponent(parentElementName, renderer) {
  test(`${parentElementName} shows component title`, () => {
    renderer();
    const result = screen.getByText("Example Component");
    expect(result).toBeVisible();
  });

  test(`${parentElementName} shows component description`, async () => {
    renderer();
    userEvent.hover(screen.getByText("Example Component"));
    expect(
      await screen.findByText("An example component.")
    ).toBeInTheDocument();
  });
}

testOSCALMetadata("OSCALComponentDefinition", componentDefinitionRenderer);

testOSCALComponentDefinitionComponent(
  "OSCALComponentDefinition",
  componentDefinitionRenderer
);

testOSCALResponsibleRoles(
  "OSCALComponentDefinition",
  componentDefinitionRenderer
);
