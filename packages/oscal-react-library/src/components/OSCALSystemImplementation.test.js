import React, { render, screen } from "@testing-library/react";
import { metadataTestData } from "../test-data/CommonData";
import { systemImplementationTestData } from "../test-data/SystemData";
import OSCALSystemImplementation from "./OSCALSystemImplementation";

describe("SystemImplementation", () => {
  test(`shows remarks`, () => {
    render(
      <OSCALSystemImplementation
        systemImplementation={systemImplementationTestData}
        parties={metadataTestData.parties}
      />
    );
    const result = screen.getByText("Example system implementation remarks.");
    expect(result).toBeVisible();
  });
});
