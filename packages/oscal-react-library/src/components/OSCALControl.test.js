import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import OSCALControl from "./OSCALControl";
import OSCALControlImplementation from "./OSCALControlImplementation";
import { controlImplTestData, exampleControl } from "../test-data/ControlsData";
import { exampleComponents } from "../test-data/ComponentsData";
import { profileModifySmtTestData } from "../test-data/ModificationsData";
import { sspRestData } from "../test-data/SystemData";

test("OSCALCatalog displays controls", async () => {
  const testControl = { id: "ac-1" };
  render(<OSCALControl control={testControl} />);
  const result = await screen.findByText("ac-1", {
    timeout: 30_000,
  });
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

  const modButton = await screen.findByRole(
    "button",
    { name: "control-1_smt modifications" },
    { timeout: 10000 }
  );
  fireEvent.click(modButton);

  expect(screen.getByText("Modifications")).toBeVisible();
  expect(screen.getByText("Adds")).toBeVisible();
});
