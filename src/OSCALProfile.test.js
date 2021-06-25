import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { OSCALProfileLoader } from "./OSCALLoader";
import OSCALProfile from "./OSCALProfile";
import { metadataTestData, testOSCALMetadata } from "./OSCALMetadata.test";
import testOSCALBackMatter, {
  backMatterTestData,
} from "./OSCALBackMatter.test";

const profileTestData = {
  uuid: "3afae418-b105-47ba-b51d-653a1a6b9267",
  metadata: metadataTestData,
  imports: [
    {
      href: "#dc380596-027f-423b-83f2-82757554ee27",
      "include-controls": [
        {
          "with-ids": ["ac-1", "ac-2", "ac-2.1"],
        },
      ],
    },
  ],
  modify: {
    alters: [
      {
        "control-id": "ac-1",
        adds: [
          {
            position: "starting",
            props: [
              {
                name: "priority",
                value: "P1",
              },
            ],
          },
        ],
      },
      {
        "control-id": "ac-2",
        adds: [
          {
            position: "starting",
            props: [
              {
                name: "priority",
                value: "P1",
              },
            ],
          },
        ],
      },
    ],
  },
  "back-matter": backMatterTestData,
};

const profileParentUrlTestData =
  "https://raw.githubusercontent.com/usnistgov/oscal-content/master/nist.gov/SP800-53/rev4/json/NIST_SP-800-53_rev4_MODERATE-baseline_profile.json";

test("OSCALProfile loads", () => {
  render(<OSCALProfileLoader />);
});

function profileRenderer() {
  render(
    <OSCALProfile
      profile={profileTestData}
      parentUrl={profileParentUrlTestData}
    />
  );
}

function testOSCALProfile(parentElementName, renderer) {
  test(`${parentElementName} displays controls`, async () => {
    act(() => {
      renderer();
    })
    const result = await screen.findByText("ac-1", {timeout: 10000});
    expect(result).toBeVisible();
  });

  test(`${parentElementName} displays control modifications`, async () => {
    renderer();
    const modButton = await screen.findByRole(
      "button",
      { name: "ac-1 modifications" },
      { timeout: 10000 }
    );
    fireEvent.click(modButton);
    expect(await screen.findByText("Modifications")).toBeVisible();
    expect(await screen.findByText("Adds")).toBeVisible();
  });
}

testOSCALMetadata("OSCALProfile", profileRenderer);

testOSCALProfile("OSCALProfile", profileRenderer);

testOSCALBackMatter("OSCALProfile", profileRenderer);
