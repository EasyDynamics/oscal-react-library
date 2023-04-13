import React from "react";
import { render, screen, within } from "@testing-library/react";
import OSCALBackMatter from "./OSCALBackMatter";
import { parentUrlTestData, revFourCatalog } from "../test-data/Urls";
import {
  backMatterTestData,
  exampleBackMatterWithoutMediaTypeAndUnknownExtension,
  exampleBackMatterWithoutMediaType,
} from "../test-data/BackMatterData";

describe("OSCAL Backmatter", () => {
  test(`displays resource title`, () => {
    render(
      <OSCALBackMatter
        backMatter={backMatterTestData}
        parentUrl={parentUrlTestData}
        isEditable={false}
      />
    );
    const result = screen.getByText("Resource Test Title");
    expect(result).toBeVisible();
  });

  test(`displays resource description`, async () => {
    render(
      <OSCALBackMatter
        backMatter={backMatterTestData}
        parentUrl={parentUrlTestData}
        isEditable={false}
      />
    );
    expect(await screen.findByText("This is a test description for resource")).toBeInTheDocument();
  });

  test(`displays media-type`, async () => {
    render(
      <OSCALBackMatter
        backMatter={backMatterTestData}
        parentUrl={parentUrlTestData}
        isEditable={false}
      />
    );
    const result = screen.getByText("application/oscal.catalog+json");
    expect(result).toBeVisible();
  });

  test(`renders absolute href`, async () => {
    render(
      <OSCALBackMatter
        backMatter={backMatterTestData}
        parentUrl={parentUrlTestData}
        isEditable={false}
      />
    );
    const button = screen.getByRole("button", {
      name: "application/oscal.catalog+json",
    });
    expect(button.getAttribute("href")).toEqual(revFourCatalog);
  });

  test(`renders relative href`, async () => {
    render(
      <OSCALBackMatter
        backMatter={backMatterTestData}
        parentUrl={parentUrlTestData}
        isEditable={false}
      />
    );
    const button = screen.getByRole("button", {
      name: "application/oscal.catalog+json2",
    });
    expect(button.getAttribute("href")).toEqual(revFourCatalog);
  });

  test(`displays external link icon`, async () => {
    render(
      <OSCALBackMatter
        backMatter={backMatterTestData}
        parentUrl={parentUrlTestData}
        isEditable={false}
      />
    );
    const button = screen.getByRole("button", {
      name: /application\/something\.else/i,
    });

    within(button).getByTestId("OpenInNewIcon");
  });

  test(`renders valid media type extension`, async () => {
    render(
      <OSCALBackMatter
        backMatter={exampleBackMatterWithoutMediaType}
        parentUrl={parentUrlTestData}
        isEditable={false}
      />
    );
    const button = screen.getByRole("button", {
      name: "PNG",
    });
    expect(button.getAttribute("href")).toBeTruthy();
  });

  test(`renders "Unknown" media type extension`, async () => {
    render(
      <OSCALBackMatter
        backMatter={exampleBackMatterWithoutMediaTypeAndUnknownExtension}
        parentUrl={parentUrlTestData}
        isEditable={false}
      />
    );
    const button = screen.getByRole("button", {
      name: "Unknown",
    });
    expect(button.getAttribute("href")).toBeTruthy();
  });
});
