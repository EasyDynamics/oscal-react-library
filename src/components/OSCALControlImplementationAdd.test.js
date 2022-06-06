import React from "react";
import { render, screen } from "@testing-library/react";
import { controlsData } from "../test-data/ControlsData";
import { sspRestData } from "../test-data/SystemData";
import OSCALControlImplementationAdd from "./OSCALControlImplementationAdd";

const controls = controlsData.map((control) => ({
  id: control.id,
  title: control.title,
}));
const implementedControls = [controlsData[0].id];

function OSCALControlImplementationAddRenderer() {
  render(
    <OSCALControlImplementationAdd
      controls={controls}
      restData={sspRestData}
      implementedControls={implementedControls}
    />
  );
}

export default function testOSCALControlImplementationAdd(
  parentElementName,
  renderer
) {
  test(`${parentElementName} displays the add button`, () => {
    renderer();

    const addButton = screen.getByRole("button", {
      name: "add-system-security-plan-control-implementation",
    });

    expect(addButton).toBeVisible();
  });

  test(`${parentElementName} displays autocomplete, save button, and cancel button on add button click`, () => {
    renderer();

    const addButton = screen.getByRole("button", {
      name: "add-system-security-plan-control-implementation",
    });
    addButton.click();

    const saveButton = screen.getByRole("button", {
      name: "save-system-security-plan-control-implementation",
    });
    expect(saveButton).toBeVisible();

    const cancelButton = screen.getByRole("button", {
      name: "cancel-system-security-plan-control-implementation",
    });
    expect(cancelButton).toBeVisible();

    const autocomplete = screen.getByRole("combobox", {
      name: "Select Control",
    });
    expect(autocomplete).toBeVisible();
  });
}

testOSCALControlImplementationAdd(
  "OSCALControlImplementationAdd",
  OSCALControlImplementationAddRenderer
);
