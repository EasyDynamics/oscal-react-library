import React, { render, screen } from "@testing-library/react";
import { metadataTestData } from "../test-data/CommonData";
import { systemImplementationTestData } from "../test-data/SystemData";
import OSCALSystemImplementation from "./OSCALSystemImplementation";

describe("SystemImplementation", () => {
  beforeEach(() => {
    render(
      <OSCALSystemImplementation
        systemImplementation={systemImplementationTestData}
        parties={metadataTestData.parties}
      />
    );
  });

  test(`shows remarks`, () => {
    const result = screen.getByText("Example system implementation remarks.");
    expect(result).toBeVisible();
  });
});
