import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { OSCALProfileLoader } from "./OSCALLoader";
import OSCALProfile from "./OSCALProfile";
import testOSCALMetadata from "./OSCALMetadata.test";
import testOSCALBackMatter from "./OSCALBackMatter.test";
import { parentUrlTestData } from "../test-data/Urls";
import { profileTestData } from "../test-data/OtherData";

test("OSCALProfile loads", () => {
  render(<OSCALProfileLoader />);
});

function profileRenderer() {
  render(
    <OSCALProfile profile={profileTestData} parentUrl={parentUrlTestData} />
  );
}

function testOSCALProfile(parentElementName, renderer) {
  test(`${parentElementName} displays controls`, async () => {
    act(() => {
      renderer();
    });
    const result = await screen.findByText("ac-1", { timeout: 10000 });
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

  test(`${parentElementName} displays parameter constraints`, async () => {
    renderer();
    const result = await screen.findAllByText(
      "< organization-defined frequency >",
      { timeout: 10000 }
    );
    fireEvent.mouseOver(result[0]);
    expect(await screen.findByText("at least every 3 years")).toBeVisible();
  });
}

testOSCALMetadata("OSCALProfile", profileRenderer);

testOSCALProfile("OSCALProfile", profileRenderer);

testOSCALBackMatter("OSCALProfile", profileRenderer);
