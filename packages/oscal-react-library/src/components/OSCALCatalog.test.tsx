import { Catalog, Control } from "@easydynamics/oscal-types";
import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { metadataTestData } from "../test-data/CommonData";
import OSCALCatalog from "./OSCALCatalog";

const catalog: Catalog = {
  uuid: "a128d34d-6df8-4b86-8e7a-12e7e122a51b",
  metadata: metadataTestData,
};

const controls: Control[] = [
  {
    id: "ac-1",
    title: "AC-1",
  },
  {
    id: "ac-2",
    title: "AC-2",
  },
];

const onResolutionComplete = () => {};
const parentUrl = "oscal";

describe("OSCALCatalogs", () => {
  test("displayed ungrouped controls", () => {
    render(
      <OSCALCatalog
        catalog={{ ...catalog, controls: controls }}
        onResolutionComplete={onResolutionComplete}
        parentUrl={parentUrl}
      />
    );

    const ungrouped = screen.getByText("Ungrouped Controls");
    fireEvent.click(ungrouped);

    const controlTitle = screen.getByText(controls[0].title);

    expect(ungrouped).toBeVisible();
    expect(controlTitle).toBeVisible();
  });
});
