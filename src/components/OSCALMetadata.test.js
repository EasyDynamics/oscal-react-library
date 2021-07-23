import React from "react";
import { render, screen, within } from "@testing-library/react";
import OSCALMetadata from "./OSCALMetadata";
import { metadataTestData } from "../test-data/CommonData";

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

export function testExternalSspOSCALMetadata(
  parentElementName,
  renderer,
  externalURL
) {
  test(`${parentElementName} displays title`, () => {
    renderer(externalURL);
    const result = screen.getByRole("heading", {
      name: "CSP IaaS System Security Plan",
    });
    expect(result).toBeVisible();
  });

  test(`${parentElementName} displays version`, () => {
    renderer(externalURL);
    const result = screen.getByText("0.1");
    expect(result).toBeVisible();
  });
}

export function testExternalProfileOSCALMetadata(
  parentElementName,
  renderer,
  externalURL
) {
  test(`${parentElementName} displays title`, () => {
    renderer(externalURL);
    const result = screen.getByRole("heading", {
      name: "NIST Special Publication 800-53 Revision 4 LOW IMPACT BASELINE",
    });
    expect(result).toBeVisible();
  });

  test(`${parentElementName} displays version`, () => {
    renderer(externalURL);
    const result = screen.getByText("2015-01-22");
    expect(result).toBeVisible();
  });

  test(`${parentElementName} displays parties`, () => {
    renderer(externalURL);
    const partiesElement = screen.getByText("Parties").closest("ul");
    const result = within(partiesElement).getByText(
      "Joint Task Force, Transformation Initiative"
    );
    expect(result).toBeVisible();
  });
}

export function testExternalComponentOSCALMetadata(
  parentElementName,
  renderer,
  externalURL
) {
  test(`${parentElementName} displays title`, () => {
    renderer(externalURL);
    const result = screen.getByRole("heading", {
      name: "Test Component Definition",
    });
    expect(result).toBeVisible();
  });

  test(`${parentElementName} displays version`, () => {
    renderer(externalURL);
    const result = screen.getByText("External Component Definition");
    expect(result).toBeVisible();
  });

  test(`${parentElementName} displays parties`, () => {
    renderer(externalURL);
    const partiesElement = screen.getByText("Parties").closest("ul");
    const result = within(partiesElement).getByText(
      "Test Vendor External Component"
    );
    expect(result).toBeVisible();
  });
}

if (!require.main) {
  testOSCALMetadata("OSCALMetadata", metadataRenderer);
}
