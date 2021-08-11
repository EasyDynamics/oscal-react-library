import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import OSCALBackMatter from "./OSCALBackMatter";
import {
  backMatterTestUrl,
  parentUrlTestData,
  revFourCatalog,
} from "../test-data/Urls";
import { backMatterTestData } from "../test-data/BackMatterData";

function backMatterRenderer() {
  render(
    <OSCALBackMatter
      backMatter={backMatterTestData}
      parentUrl={parentUrlTestData}
    />
  );
}

export default function testOSCALBackMatter(parentElementName, renderer) {
  test(`${parentElementName} displays resource title`, async () => {
    renderer();
    const result = await screen.findByText("Resource Test Title", {
      timeout: 10000,
    });
    expect(result).toBeVisible();
  });

  test(`${parentElementName} displays resource description`, async () => {
    renderer();
    const descriptionDisplay = await screen.findByTitle(
      "Resource Test Title-description",
      { timeout: 10000 }
    );
    userEvent.hover(descriptionDisplay);
    expect(
      await screen.findByText("This is a test description for resource")
    ).toBeInTheDocument();
  });

  test(`${parentElementName} displays media-type`, async () => {
    renderer();
    const result = await screen.findByText("application/oscal.catalog+json", {
      timeout: 10000,
    });
    expect(result).toBeVisible();
  });

  test(`${parentElementName} renders absolute href`, async () => {
    renderer();
    const button = await screen.findByRole("button", {
      name: "application/oscal.catalog+json",
      timeout: 10000,
    });
    expect(button.getAttribute("href")).toEqual(revFourCatalog);
  });

  test(`${parentElementName} renders relative href`, async () => {
    renderer();
    const button = await screen.findByRole("button", {
      name: "application/oscal.catalog+json2",
      timeout: 10000,
    });
    expect(button.getAttribute("href")).toEqual(backMatterTestUrl);
  });
}

if (!require.main) {
  testOSCALBackMatter("OSCALBackMatter", backMatterRenderer);
}
