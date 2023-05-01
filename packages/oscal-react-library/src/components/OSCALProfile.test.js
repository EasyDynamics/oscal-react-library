import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { OSCALProfileLoader } from "./OSCALLoader";
import OSCALProfile from "./OSCALProfile";
import { parentUrlTestData } from "../test-data/Urls";
import profileTestData from "../test-data/ProfileData";

test("OSCALProfile loads", () => {
  render(<OSCALProfileLoader />);
});

function profileRenderer() {
  render(
    <OSCALProfile
      profile={profileTestData}
      parentUrl={parentUrlTestData}
      onResolutionComplete={() => {}}
    />
  );
}

function testOSCALProfile(parentElementName, renderer) {
  jest.setTimeout(10000);
  test(`${parentElementName} displays controls`, async () => {
    renderer();
    const result = await screen.findByText("AC-1", {
      timeout: 5000,
    });
    expect(result).toBeVisible();
  });

  test(`${parentElementName} displays parameter constraints`, async () => {
    renderer();
    const result = await screen.findAllByText("< organization-defined frequency >", {
      timeout: 5000,
    });
    fireEvent.mouseOver(result[0]);
    expect(await screen.findByText("at least every 3 years")).toBeVisible();
  });
}

testOSCALProfile("OSCALProfile", profileRenderer);
