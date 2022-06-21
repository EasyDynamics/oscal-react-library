import React from "react";
import {
  render,
  screen,
  fireEvent,
  act,
  waitFor,
} from "@testing-library/react";
import { OSCALProfileLoader } from "./OSCALLoader";
import OSCALProfile from "./OSCALProfile";
import testOSCALMetadata from "./OSCALMetadata.test";
import testOSCALBackMatter from "./OSCALBackMatter.test";
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
  jest.setTimeout(6000);
  test(`${parentElementName} displays controls`, async () => {
    act(() => {
      renderer();
    });
    const result = await waitFor(() => screen.getByText("ac-1"), {
      timeout: 5000,
    });
    expect(result).toBeVisible();
  });

  test(`${parentElementName} displays parameter constraints`, async () => {
    renderer();
    const result = await waitFor(
      () => screen.getAllByText("< organization-defined frequency >"),
      { timeout: 5000 }
    );
    fireEvent.mouseOver(result[0]);
    expect(await screen.findByText("at least every 3 years")).toBeVisible();
  });
}

test("OSCALProfile displays legend", async () => {
  render(
    <OSCALProfile
      profile={profileTestData}
      parentUrl={parentUrlTestData}
      onResolutionComplete={() => {}}
    />
  );

  const placeholderBox = screen.getByLabelText("legend-placeholder-label");
  expect(placeholderBox).toBeVisible();
  const placeholderBoxLabel = screen.getByText("Placeholder");
  expect(placeholderBoxLabel).toBeVisible();

  const valueBox = screen.getByLabelText("legend-value-label");
  expect(valueBox).toBeVisible();
  const valueBoxLabel = screen.getByText("Value");
  expect(valueBoxLabel).toBeVisible();
});

testOSCALMetadata("OSCALProfile", profileRenderer);

testOSCALProfile("OSCALProfile", profileRenderer);

testOSCALBackMatter("OSCALProfile", profileRenderer);
