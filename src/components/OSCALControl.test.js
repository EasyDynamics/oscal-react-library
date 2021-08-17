import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import OSCALControl from "./OSCALControl";
import OSCALControlImplementation from "./OSCALControlImplementation";
import { controlImplTestData, exampleControl } from "../test-data/ControlsData";
import { exampleComponents } from "../test-data/ComponentsData";
import { profileModifySmtTestData } from "../test-data/ModificationsData";

test("OSCALCatalog displays controls", () => {
  const testControl = { id: "ac-1" };
  render(<OSCALControl control={testControl} />);
  const result = screen.getByText("ac-1");
  expect(result).toBeVisible();
});

test("OSCALControl displays _smt modifications", async () => {
  render(
    <OSCALControlImplementation
      controlImplementation={controlImplTestData}
      components={exampleComponents}
      controls={[exampleControl]}
      modifications={profileModifySmtTestData}
    />
  );

  const modButton = await screen.findByRole(
    "button",
    { name: "control-1_smt modifications" },
    { timeout: 10000 }
  );
  fireEvent.click(modButton);
  expect(await screen.findByText("Modifications")).toBeVisible();
  expect(await screen.findByText("Adds")).toBeVisible();
});
