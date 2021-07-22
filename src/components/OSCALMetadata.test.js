import React from "react";
import { render, screen, within } from "@testing-library/react";
import OSCALMetadata from "./OSCALMetadata";
import { metadataTestData } from "../test-data/OtherData";

function metadataRenderer() {
  render(<OSCALMetadata metadata={metadataTestData} />);
}

export default function testOSCALMetadata(parentElementName, renderer) {
  test(`${parentElementName} displays title`, () => {
    renderer();
    const result = screen.getByRole("heading", { name: "Test Title" });
    expect(result).toBeVisible();
  });

  test(`${parentElementName} displays version`, () => {
    renderer();
    const result = screen.getByText("Revision 5");
    expect(result).toBeVisible();
  });

  test(`${parentElementName} displays parties`, () => {
    renderer();
    const partiesElement = screen.getByText("Parties").closest("ul");
    const result = within(partiesElement).getByText("Some group of people");
    expect(result).toBeVisible();
  });
}

if (!require.main) {
  testOSCALMetadata("OSCALMetadata", metadataRenderer);
}
