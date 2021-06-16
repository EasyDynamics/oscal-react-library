import React from "react";
import { render, screen } from "@testing-library/react";
import { OSCALProfileLoader } from "./OSCALLoader";
import OSCALProfile from "./OSCALProfile";
import { metadataTestData, testOSCALMetadata } from "./OSCALMetadata.test";
import { controlsData } from "./OSCALComponentDefinitionControlImplementation.test";
import { backMatterTestData } from "./OSCALBackMatter.test";
import testOSCALBackMatter from "./OSCALBackMatter.test";

const profileTestData = {
  uuid: "3afae418-b105-47ba-b51d-653a1a6b9267",
  metadata: metadataTestData,
  imports: [
    {
      href: "#dc380596-027f-423b-83f2-82757554ee27",
      "include-controls": [
        {
          "with-ids": ["control-1", "control-1.1", "control-2", "control-2.1"],
        },
      ],
    },
  ],
  resolvedControls: controlsData,
  "back-matter": backMatterTestData,
};

const profileParentUrlTestData = "https://raw.githubusercontent.com/usnistgov/oscal-content/master/nist.gov/SP800-53/rev4/json/NIST_SP-800-53_rev4_MODERATE-baseline_profile.json";

test("OSCALProfile loads", () => {
  render(<OSCALProfileLoader />);
});

function profileRenderer() {
  render(<OSCALProfile profile={profileTestData} parentUrl={profileParentUrlTestData} />);
}

testOSCALMetadata("OSCALProfile", profileRenderer);

testOSCALBackMatter("OSCALProfile", profileRenderer);
