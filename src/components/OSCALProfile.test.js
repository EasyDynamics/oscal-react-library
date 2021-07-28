import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { OSCALProfileLoader } from "./OSCALLoader";
import OSCALProfile from "./OSCALProfile";
import testOSCALMetadata, {
  testExternalProfileOSCALMetadata,
} from "./OSCALMetadata.test";
import testOSCALBackMatter, {
  testExternalProfileOSCALBackMatter,
} from "./OSCALBackMatter.test";
import {
  parentUrlTestData,
  rev4LowBaselineProfileJson,
} from "../test-data/Urls";
import {
  externalProfileTestData,
  profileTestData,
} from "../test-data/CommonData";

test("OSCALProfile loads", () => {
  render(<OSCALProfileLoader />);
});

function profileRenderer() {
  render(
    <OSCALProfile
      profile={profileTestData}
      parentUrl={parentUrlTestData}
    />
  );
}

function externalUrlProfileRenderer(externalUrl) {
  render(
    <OSCALProfile profile={externalProfileTestData} parentUrl={externalUrl} />
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

function testExternalOSCALProfile(parentElementName, renderer, externalUrl) {
  test(`${parentElementName} displays controls`, async () => {
    act(() => {
      renderer(externalUrl);
    });
    const result = await screen.findByText("ca-1", { timeout: 10000 });
    expect(result).toBeVisible();
  });

  test(`${parentElementName} displays control modifications`, async () => {
    renderer(externalUrl);
    const modButton = await screen.findByRole(
      "button",
      { name: "ca-3 modifications" },
      { timeout: 10000 }
    );
    fireEvent.click(modButton);
    expect(await screen.findByText("Modifications")).toBeVisible();
    expect(await screen.findByText("Adds")).toBeVisible();
  });
}

function testUrlOSCALProfile(url) {
  const externalUrl = url.searchParams.get("url");
  if (!externalUrl) {
    testOSCALMetadata("OSCALProfile", profileRenderer);
    testOSCALProfile("OSCALProfile", profileRenderer);
    testOSCALBackMatter("OSCALProfile", profileRenderer);
    return;
  }
  testExternalProfileOSCALMetadata(
    "ExternalOSCALProfile",
    externalUrlProfileRenderer,
    externalUrl
  );
  testExternalOSCALProfile(
    "ExternalOSCALProfile",
    externalUrlProfileRenderer,
    externalUrl
  );
  testExternalProfileOSCALBackMatter(
    "ExternalOSCALProfile",
    externalUrlProfileRenderer,
    externalUrl
  );
}

const url = new URL("https://www.oscal-profile-test.com");
testUrlOSCALProfile(url);
url.searchParams.set("url", rev4LowBaselineProfileJson);
testUrlOSCALProfile(url);
