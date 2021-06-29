import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import OSCALBackMatter from "./OSCALBackMatter";

export const backMatterTestData = {
  "resources": [
    {
      "uuid": "dc380596-027f-423b-83f2-82757554ee27",
      "title": "Resource Test Title",
      "description": "This is a test description for resource",
      "rlinks": [
        {
          "href": "https://raw.githubusercontent.com/usnistgov/oscal-content/master/nist.gov/SP800-53/rev4/json/NIST_SP-800-53_rev4_catalog.json",
          "media-type": "application/oscal.catalog+json",
        },
      ],
    },
    {
      "uuid": "dc380596-027f-423b-83f2-82757554ee28",
      "title": "Resource Test Title 2",
      "description": "This is a test description for resource 2",
      "rlinks": [
        {
          "href": "NIST_SP-800-53_rev4_catalog.json",
          "media-type": "application/oscal.catalog+json2",
        },
      ],
    },
  ],
};

const parentUrlTestData = "https://raw.githubusercontent.com/usnistgov/oscal-content/master/nist.gov/SP800-53/rev4/json/NIST_SP-800-53_rev4_MODERATE-baseline_profile.json";

function backMatterRenderer() {
  render(<OSCALBackMatter backMatter={backMatterTestData} parentUrl={parentUrlTestData} />);
}

export default function testOSCALBackMatter(parentElementName, renderer) {
  test(`${parentElementName} displays resource title`, () => {
    renderer();
    const result = screen.getByText("Resource Test Title");
    expect(result).toBeVisible();
  });

  test(`${parentElementName} displays resource description`, async () => {
    renderer();
    const descriptionDisplay = screen.getByTitle("Resource Test Title-description")
    userEvent.hover(descriptionDisplay);
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
    const button = screen.getByRole("button", { name: "application/oscal.catalog+json"});
    expect(button.getAttribute("href")).toEqual("https://raw.githubusercontent.com/usnistgov/oscal-content/master/nist.gov/SP800-53/rev4/json/NIST_SP-800-53_rev4_catalog.json");
  });

  test(`${parentElementName} renders relative href`, async () => {
    renderer();
    const button = screen.getByRole("button", { name: "application/oscal.catalog+json2"});
    expect(button.getAttribute("href")).toEqual("https://raw.githubusercontent.com/usnistgov/oscal-content/master/nist.gov/SP800-53/rev4/json/NIST_SP-800-53_rev4_MODERATE-baseline_profile.json/../NIST_SP-800-53_rev4_catalog.json");
  });
}

if (!require.main) {
  testOSCALBackMatter("OSCALBackMatter", backMatterRenderer);
}
