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
  test("displays resource title", () => {
    render(<OSCALBackMatter backMatter={backMatterTestData} parentUrl={parentUrlTestData} />);
    const result = screen.getByText("Resource Test Title");
    expect(result).toBeVisible();
  });

  test("displays resource description", async () => {
    render(<OSCALBackMatter backMatter={backMatterTestData} parentUrl={parentUrlTestData} />);
    expect(await screen.findByText("This is a test description for resource")).toBeInTheDocument();
  });

  test("displays media-type", async () => {
    render(<OSCALBackMatter backMatter={backMatterTestData} parentUrl={parentUrlTestData} />);
    const result = screen.getByText("OSCAL (JSON)");
    expect(result).toBeVisible();
  });

  test("renders absolute href", async () => {
    render(<OSCALBackMatter backMatter={backMatterTestData} parentUrl={parentUrlTestData} />);
    const button = screen.getByRole("button", {
      name: "OSCAL (JSON)",
    });
    expect(button.getAttribute("href")).toEqual(revFourCatalog);
  });

  test("renders relative href", async () => {
    render(<OSCALBackMatter backMatter={backMatterTestData} parentUrl={parentUrlTestData} />);
    const button = screen.getByRole("button", {
      name: "JSON",
    });
    expect(button.getAttribute("href")).toEqual(revFourCatalog);
  });

  test("displays external link icon", async () => {
    render(<OSCALBackMatter backMatter={backMatterTestData} parentUrl={parentUrlTestData} />);
    const button = screen.getByRole("button", {
      name: "Application/Binary Data",
    });

    within(button).getByTestId("OpenInNewIcon");
  });

  test("renders valid media type extension", async () => {
    render(
      <OSCALBackMatter
        backMatter={exampleBackMatterWithoutMediaType}
        parentUrl={parentUrlTestData}
      />
    );
    const button = screen.getByRole("button", {
      name: "Image (PNG)",
    });
    expect(button.getAttribute("href")).toBeTruthy();
  });

  test('renders "Unknown" media type extension', async () => {
    render(
      <OSCALBackMatter
        backMatter={exampleBackMatterWithoutMediaTypeAndUnknownExtension}
        parentUrl={parentUrlTestData}
      />
    );
    const button = screen.getByRole("button", {
      name: "Unrecognized",
    });
    expect(button.getAttribute("href")).toBeTruthy();
  });
});
