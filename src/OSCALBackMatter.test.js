import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import OSCALBackMatter from "./OSCALBackMatter";

const backMatterTestData = {
  resources: [
    {
      uuid: "dc380596-027f-423b-83f2-82757554ee27",
      title: "Resource Test Title",
      description: "This is a test description for resource",
      rlinks: [
        {
          href: "NIST_SP-800-53_rev4_catalog.xml",
          "media-type": "application/oscal.catalog+json"
        }
      ],
    },
  ],
}

function backMatterRenderer() {
  render(<OSCALBackMatter backMatter={backMatterTestData} />);
}

export function testOSCALBackMatter(parentElementName, renderer) {
  test(`${parentElementName} displays title`, () => {
    renderer();
    const result = screen.getByText("Resource Test Title");
    expect(result).toBeVisible();
  });

  test(`${parentElementName} displays resource description`, async () => {
    renderer();
    userEvent.hover(screen.getByText("Resource Test Title"));
    expect(
      await screen.findByText("This is a test description for resource")
    ).toBeInTheDocument();
  });
}

if (!require.main) {
  testOSCALBackMatter("OSCALBackMatter", backMatterRenderer);
}