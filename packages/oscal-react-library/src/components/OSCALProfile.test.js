import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import OSCALProfile from "./OSCALProfile";
import { parentUrlTestData } from "../test-data/Urls";
import profileTestData from "../test-data/ProfileData";

describe("The OSCAL Profile", () => {
  it("displays controls", async () => {
    render(
      <OSCALProfile
        profile={profileTestData}
        parentUrl={parentUrlTestData}
        onResolutionComplete={() => {}}
      />
    );

    const result = await screen.findByText("AC-1", {
      timeout: 30_000,
    });

    expect(result).toBeVisible();
  }, 30_000);

  it("displays parameter constraints", async () => {
    render(
      <OSCALProfile
        profile={profileTestData}
        parentUrl={parentUrlTestData}
        onResolutionComplete={() => {}}
      />
    );

    const result = await screen.findAllByText("< organization-defined frequency >", {
      timeout: 30_000,
    });
    fireEvent.mouseOver(result[0]);
    expect(await screen.findByText("at least every 3 years")).toBeVisible();
  });
});
