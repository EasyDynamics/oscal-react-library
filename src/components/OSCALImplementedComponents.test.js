import React from "react";
import { render, screen, within } from "@testing-library/react";
import OSCALImplementedComponents from "./OSCALImplementedComponents";
import {
  implementedComponentsRolesTestData,
} from "../test-data/CommonData";
import { exampleComponents } from "../test-data/ComponentsData";

function implementedComponentsRenderer() {
  render(
    <OSCALImplementedComponents
      implementedComponents={implementedComponentsRolesTestData}
      components={exampleComponents}
    />
  );
}

export default function testOSCALImplementedComponents(
  parentElementName,
  renderer
) {
  test(`${parentElementName} shows component type`, () => {
    renderer();
    const compTitleResult = screen.getByText("Component 1 Title");
    expect(compTitleResult).toBeVisible();

    const compTypeResult = within(compTitleResult.closest("tr")).getByText(
      "Component 1 Type"
    );
    expect(compTypeResult).toBeVisible();
  });
}

if (!require.main) {
  testOSCALImplementedComponents(
    "OSCALImplementedComponents",
    implementedComponentsRenderer
  );
}
