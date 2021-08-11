import React from "react";
import { render, screen, within } from "@testing-library/react";
import OSCALMetadata from "./OSCALMetadata";
import { metadataTestData } from "../test-data/CommonData";

function metadataRenderer() {
  render(<OSCALMetadata metadata={metadataTestData} />);
}

export default function testOSCALMetadata(parentElementName, renderer) {
  test(`${parentElementName} displays title`, async () => {
    renderer();
    const result = await screen.findByRole("heading", {
      name: "Test Title",
      timeout: 10000,
    });
    expect(result).toBeVisible();
  });

  test(`${parentElementName} displays version`, async () => {
    renderer();
    const result = await screen.findByText("Revision 5", { timeout: 10000 });
    expect(result).toBeVisible();
  });

  test(`${parentElementName} displays parties`, async () => {
    renderer();
    await screen.findByText("Parties", { timeout: 10000 });
    const partiesElement = screen.getByText("Parties").closest("ul");
    const result = within(partiesElement).getByText("Some group of people");
    expect(result).toBeVisible();
  });
}

if (!require.main) {
  testOSCALMetadata("OSCALMetadata", metadataRenderer);
}
