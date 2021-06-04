import React from "react";
import { render, screen } from "@testing-library/react";
import { OSCALProfileLoader } from "./OSCALLoader";
import OSCALProfile from "./OSCALProfile";
import { metadataTestData, testOSCALMetadata } from "./OSCALMetadata.test";
import { controlsData } from "./OSCALComponentDefinitionControlImplementation.test";

const profileTestData = {
  uuid: "3afae418-b105-47ba-b51d-653a1a6b9267",
  metadata: metadataTestData,
  imports: [
    {
      href: "#dc380596-027f-423b-83f2-82757554ee27",
      "include-controls": [
        {
          "with-ids": [
              "control-1",
              "control-1.1",
              "control-2",
              "control-2.1"
          ],
        },
      ],
    },
  ],
  resolvedControls: controlsData,
  "back-matter": {
    resources: [
      {
        uuid: "dc380596-027f-423b-83f2-82757554ee27",
        description: "This is an example description for Back Matter",
        rlinks: [
          {
            href: "NIST_SP-800-53_rev4_catalog.xml",
            "media-type": "application/oscal.catalog+json"
          }
        ],
      },
    ],
  },
};

test("OSCALProfile loads", () => {
  render(<OSCALProfileLoader />);
});

test("OSCALProfile displays Imported Controls Header", () => {
  render(<OSCALProfile profile={profileTestData} />);
  const result = screen.getByText("Imported Controls");
  expect(result).toBeVisible();
});

function profileRenderer() {
  render(<OSCALProfile profile={profileTestData} />);
}

testOSCALMetadata("OSCALProfile", profileRenderer);