import React from "react";
import { render, screen } from "@testing-library/react";
import OSCALCatalogGroup from "./OSCALCatalogGroup";
import { externalCatalogTestData } from "../test-data/ControlsData";
import { revFourCatalog } from "../test-data/Urls";

function testUrlOSCALCatalog(url) {
  const externalUrl = url.searchParams.get("url");
  if (!externalUrl) {
    test("OSCALCatalog displays control groups", () => {
      const testGroup = {
        id: "ac",
        class: "family",
        title: "Access Control",
        controls: [{ id: "ac-1" }],
      };
      render(<OSCALCatalogGroup group={testGroup} />);
      const result = screen.getByText("Access Control");
      expect(result).toBeVisible();
    });
    return;
  }

  test("ExternalOSCALCatalog displays control groups", () => {
    render(<OSCALCatalogGroup group={externalCatalogTestData} />);
    const result = screen.getByText("External Access Control");
    expect(result).toBeVisible();
  });
}

const url = new URL("https://www.oscal-catalog.com");
testUrlOSCALCatalog(url);
url.searchParams.set("url", revFourCatalog);
testUrlOSCALCatalog(url);
