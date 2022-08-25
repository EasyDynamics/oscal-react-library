import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { within } from "@testing-library/dom";
import OSCALBackMatter from "./OSCALBackMatter";
import { parentUrlTestData, revFourCatalog } from "../test-data/Urls";
import {
  backMatterTestData,
  exampleBackMatterWithoutMediaTypeAndUnknownExtension,
  exampleBackMatterWithoutMediaType,
} from "../test-data/BackMatterData";

function backMatterRenderer() {
  render(
    <OSCALBackMatter
      backMatter={backMatterTestData}
      parentUrl={parentUrlTestData}
    />
  );
}

export default function testOSCALBackMatter(parentElementName, renderer) {
  test(`${parentElementName} displays resource title`, () => {
    renderer();
    const result = screen.getByText("Resource Test Title");
    expect(result).toBeVisible();
  });

  test(`${parentElementName} displays resource description`, async () => {
    renderer();
    const descriptionDisplay = screen.getByTitle(
      "Resource Test Title-description"
    );
    await userEvent.hover(descriptionDisplay);
    expect(
      await screen.findByText("This is a test description for resource")
    ).toBeInTheDocument();
  });

  test(`${parentElementName} displays media-type`, async () => {
    renderer();
    const result = screen.getByText("application/oscal.catalog+json");
    expect(result).toBeVisible();
  });

  test(`${parentElementName} renders absolute href`, async () => {
    renderer();
    const button = screen.getByRole("button", {
      name: "application/oscal.catalog+json",
    });
    expect(button.getAttribute("href")).toEqual(revFourCatalog);
  });

  test(`${parentElementName} renders relative href`, async () => {
    renderer();
    const button = screen.getByRole("button", {
      name: "application/oscal.catalog+json2",
    });
    expect(button.getAttribute("href")).toEqual(revFourCatalog);
  });

  test(`${parentElementName} displays external link icon`, async () => {
    renderer();
    const button = screen.getByRole("button", {
      name: /application\/something\.else/i,
    });

    within(button).getByTestId("OpenInNewIcon");
  });

  test(`${parentElementName} renders valid media type extension`, async () => {
    render(
      <OSCALBackMatter
        backMatter={exampleBackMatterWithoutMediaType}
        parentUrl={parentUrlTestData}
      />
    );
    const button = screen.getByRole("button", {
      name: "PNG",
    });
    expect(button.getAttribute("href"));
  });

  test(`${parentElementName} renders "Unknown" media type extension`, async () => {
    render(
      <OSCALBackMatter
        backMatter={exampleBackMatterWithoutMediaTypeAndUnknownExtension}
        parentUrl={parentUrlTestData}
      />
    );
    const button = screen.getByRole("button", {
      name: "Unknown",
    });
    expect(button.getAttribute("href"));
  });
}

if (!require.main) {
  testOSCALBackMatter("OSCALBackMatter", backMatterRenderer);
}
