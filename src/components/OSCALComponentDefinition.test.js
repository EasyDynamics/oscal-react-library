import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { OSCALComponentLoader } from "./OSCALLoader";
import OSCALComponentDefinition from "./OSCALComponentDefinition";
import { metadataTestData, testOSCALMetadata } from "./OSCALMetadata.test";
import {
  responsibleRolesTestData,
  testOSCALResponsibleRoles,
} from "./OSCALResponsibleRoles.test";

export const componentDefinitionTestData = {
  uuid: "aabcfa61-c6eb-4979-851f-35b461f6a0ef",
  metadata: metadataTestData,
  components: {
    "component-1": {
      type: "Example Type",
      title: "Example Component",
      description: "An example component.",
      "responsible-roles": responsibleRolesTestData,
      "control-implementations": [
        {
          uuid: "control-implementation-1",
          source:
            "https://raw.githubusercontent.com/usnistgov/oscal-content/master/nist.gov/SP800-53/rev4/json/NIST_SP-800-53_rev4_catalog.json",
          description:
            "This is an example description for control implementations",
          "implemented-requirements": [
            {
              uuid: "implemented-requirements-1",
              description: "Component 1 description of implementing control 1",
              "control-id": "example-1",
            },
          ],
        },
      ],
    },
  },
};

export default { componentDefinitionTestData };

test("OSCALComponentDefinition loads", () => {
  render(<OSCALComponentLoader />);
});

function componentDefinitionRenderer() {
  render(
    <OSCALComponentDefinition
      componentDefinition={componentDefinitionTestData}
    />
  );
}

function testOSCALComponentDefinitionComponent(parentElementName, renderer) {
  test(`${parentElementName} shows component title`, () => {
    renderer();
    const result = screen.getByText("Example Component");
    expect(result).toBeVisible();
  });

  test(`${parentElementName} shows component description`, async () => {
    renderer();
    userEvent.hover(screen.getByText("Example Component"));
    expect(
      await screen.findByText("An example component.")
    ).toBeInTheDocument();
  });
}

testOSCALMetadata("OSCALComponentDefinition", componentDefinitionRenderer);

testOSCALComponentDefinitionComponent(
  "OSCALComponentDefinition",
  componentDefinitionRenderer
);

testOSCALResponsibleRoles(
  "OSCALComponentDefinition",
  componentDefinitionRenderer
);
