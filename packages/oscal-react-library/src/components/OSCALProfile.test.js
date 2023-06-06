import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import OSCALProfile from "./OSCALProfile";
import { urlSmallCatalogUrl } from "../test-data/Urls";
import profileTestData from "../test-data/ProfileData";
import {
  profileWithIncludeAll,
  profileWithIncludeAllAndExcludeAC3,
} from "../test-data/ProfileData";
const PROFILE_RESOLUTION_TEST_TIMEOUT_MS = 30_000;
describe("The OSCAL Profile", () => {
  it("displays controls", async () => {
    render(
      <OSCALProfile
        profile={profileTestData}
        parentUrl={urlSmallCatalogUrl}
        onResolutionComplete={() => {}}
      />
    );

    const result = await screen.findByText("AC-1", {
      timeout: PROFILE_RESOLUTION_TEST_TIMEOUT_MS,
    });

    expect(result).toBeVisible();
  }, 30000);

  it("displays parameter constraints", async () => {
    render(
      <OSCALProfile
        profile={profileTestData}
        parentUrl={urlSmallCatalogUrl}
        onResolutionComplete={() => {}}
      />
    );

    const result = await screen.findAllByText("< organization-defined frequency >", {
      timeout: PROFILE_RESOLUTION_TEST_TIMEOUT_MS,
    });
    fireEvent.mouseOver(result[0]);
    expect(await screen.findByText("at least every 3 years")).toBeVisible();
  });

  it("displays profile control modifications", async () => {
    render(
      <OSCALProfile
        profile={profileTestData}
        parentUrl={urlSmallCatalogUrl}
        onResolutionComplete={() => {}}
      />
    );

    const modButton = await screen.findByRole(
      "button",
      { name: "ac-1 modifications" },
      { timeout: PROFILE_RESOLUTION_TEST_TIMEOUT_MS }
    );
    fireEvent.click(modButton);

    expect(screen.getByText("Modifications")).toBeVisible();
    expect(screen.getByText("Adds")).toBeVisible();
  }, 30000);
  it("displays profile removed control modifications", async () => {
    render(
      <OSCALProfile
        profile={profileTestData}
        parentUrl={urlSmallCatalogUrl}
        onResolutionComplete={() => {}}
      />
    );

    const modButton = await screen.findByRole(
      "button",
      { name: "ac-2 modifications" },
      { timeout: PROFILE_RESOLUTION_TEST_TIMEOUT_MS }
    );
    fireEvent.click(modButton);

    expect(screen.getByText("Modifications")).toBeVisible();
    expect(screen.getByText("Removes")).toBeVisible();
  }, 30000);
  it("displays profile removed control part modifications", async () => {
    render(
      <OSCALProfile
        profile={profileTestData}
        parentUrl={urlSmallCatalogUrl}
        onResolutionComplete={() => {}}
      />
    );

    const modButton = await screen.findByRole(
      "button",
      { name: "ac-2_smt.b modifications" },
      { timeout: PROFILE_RESOLUTION_TEST_TIMEOUT_MS }
    );
    fireEvent.click(modButton);
    const textStrikeThrough = await screen.findByText(
      "b. Assigns account managers for information system accounts;",
      {
        timeout: PROFILE_RESOLUTION_TEST_TIMEOUT_MS,
      }
    );
    const removeStatement = await screen.findByTestId("ac-2_smt.b remove-div", {
      timeout: PROFILE_RESOLUTION_TEST_TIMEOUT_MS,
    });

    expect(textStrikeThrough).toBeVisible();
    expect(screen.getByText("Modifications")).toBeVisible();
    expect(screen.getByText("Removes")).toBeVisible();
    expect(removeStatement).toBeVisible();
  }, 60000);
  it("displays profile controls", async () => {
    render(
      <OSCALProfile
        profile={profileTestData}
        parentUrl={urlSmallCatalogUrl}
        onResolutionComplete={() => {}}
      />
    );
    const resultAC1 = await screen.findByText("AC-1", {
      timeout: PROFILE_RESOLUTION_TEST_TIMEOUT_MS,
    });
    expect(resultAC1).toBeVisible();

    const resultAC2 = await screen.findByText("AC-2", {
      timeout: PROFILE_RESOLUTION_TEST_TIMEOUT_MS,
    });
    expect(resultAC2).toBeVisible();
  }, 60000);
  it("displays all catalog controls if the import statement has directive include-all", async () => {
    render(
      <OSCALProfile
        profile={profileWithIncludeAll}
        parentUrl={urlSmallCatalogUrl}
        onResolutionComplete={() => {}}
      />
    );

    const resultAC1 = await screen.findByText("AC-1", {
      timeout: PROFILE_RESOLUTION_TEST_TIMEOUT_MS,
    });
    expect(resultAC1).toBeVisible();
    const resultAC2 = await screen.findByText("AC-2", {
      timeout: PROFILE_RESOLUTION_TEST_TIMEOUT_MS,
    });
    expect(resultAC2).toBeVisible();
    const resultAC3 = await screen.findByText("AC-3", {
      timeout: PROFILE_RESOLUTION_TEST_TIMEOUT_MS,
    });
    expect(resultAC3).toBeVisible();
  }, 60000);
  it("displays all catalog controls except excluded control if the import statement has include-all and exclude-control", async () => {
    render(
      <OSCALProfile
        profile={profileWithIncludeAllAndExcludeAC3}
        parentUrl={urlSmallCatalogUrl}
        onResolutionComplete={() => {}}
      />
    );

    const resultAC1 = await screen.findByText("AC-1", {
      timeout: PROFILE_RESOLUTION_TEST_TIMEOUT_MS,
    });
    expect(resultAC1).toBeVisible();

    const resultAC2 = await screen.findByText("AC-2", {
      timeout: PROFILE_RESOLUTION_TEST_TIMEOUT_MS,
    });
    expect(resultAC2).toBeVisible();

    const resultAC3 = screen.queryByText("AC-3");
    expect(resultAC3).toBeNull();
  }, 60000);
});
