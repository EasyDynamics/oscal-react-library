import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import OSCALControl from "./OSCALControl";
import OSCALControlImplementation from "./OSCALControlImplementation";
import OSCALProfile from "./OSCALProfile";
import { controlImplTestData, exampleControl } from "../test-data/ControlsData";
import { exampleComponents } from "../test-data/ComponentsData";
import { profileModifySmtTestData } from "../test-data/ModificationsData";
import profileTestData from "../test-data/ProfileData";
import { parentUrlTestData } from "../test-data/Urls";
import { sspRestData } from "../test-data/SystemData";

async function testIfModificationsDisplayed(modificationName) {
  const modButton = await screen.findByRole(
    "button",
    { name: modificationName },
    { timeout: 10000 }
  );
  fireEvent.click(modButton);
  expect(await screen.findByText("Modifications")).toBeVisible();
  expect(await screen.findByText("Adds")).toBeVisible();
}

test("OSCALCatalog displays controls", () => {
  const testControl = { id: "ac-1" };
  render(<OSCALControl control={testControl} />);
  const result = screen.getByText("ac-1");
  expect(result).toBeVisible();
});

test("OSCALControl displays statement modifications", async () => {
  render(
    <OSCALControlImplementation
      controlImplementation={controlImplTestData}
      components={exampleComponents}
      controls={[exampleControl]}
      modifications={profileModifySmtTestData}
      partialRestData={sspRestData}
    />
  );
  await testIfModificationsDisplayed("control-1_smt modifications");
});

test("OSCALControl displays profile control modifications", async () => {
  render(
    <OSCALProfile
      profile={profileTestData}
      parentUrl={parentUrlTestData}
      onResolutionComplete={() => {}}
    />
  );
  await testIfModificationsDisplayed("ac-1 modifications");
});
