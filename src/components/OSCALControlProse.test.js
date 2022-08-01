import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import {
  OSCALReplacedProseWithParameterLabel,
  OSCALReplacedProseWithByComponentParameterValue,
} from "./OSCALControlProse";
import { exampleModificationSetParameters } from "../test-data/ModificationsData";
import {
  controlImplTestData,
  controlProseTestData,
  exampleParams,
} from "../test-data/ControlsData";
import { sspRestData } from "../test-data/SystemData";

const labelTestData = "label-1";

function proseParamLabelsRenderer() {
  render(
    <OSCALReplacedProseWithParameterLabel
      implementedRequirement={
        controlImplTestData["implemented-requirements"][0]
      }
      label={labelTestData}
      prose={controlProseTestData}
      parameters={exampleParams}
      modificationSetParameters={exampleModificationSetParameters}
    />
  );
}

function testOSCALControlProseParamLabels(parentElementName, renderer) {
  test(`${parentElementName} displays parameter labels`, async () => {
    renderer();
    const result = await screen.findByText("< control 1 label >");
    fireEvent.mouseOver(result);
    expect(await screen.findByText("some constraint")).toBeVisible();
    expect(await screen.findByText("param 3 value")).toBeVisible();
  });
}

testOSCALControlProseParamLabels("OSCALControlProse", proseParamLabelsRenderer);

function proseParamValuesEditingRenderer() {
  render(
    <OSCALReplacedProseWithByComponentParameterValue
      label={labelTestData}
      prose={controlProseTestData}
      parameters={exampleParams}
      implementedRequirement={
        controlImplTestData["implemented-requirements"][0]
      }
      statementId="control-1_smt.a"
      componentId="component-1"
      modificationSetParameters={exampleModificationSetParameters}
      isEditable
      partialRestData={sspRestData}
    />
  );
}

function testOSCALControlProseEditing(parentElementName, renderer) {
  beforeEach(() => {
    renderer();
    screen
      .getByRole("button", {
        name: "edit-bycomponent-component-1-statement-control-1_smt.a",
      })
      .click();
  });

  test(`${parentElementName} displays default description and parameter inputs`, async () => {
    const descriptionTextField = screen.getByLabelText("Description");
    const paramValueTextField = screen.getByLabelText("control-1_prm_1");
    expect(descriptionTextField.value).toBe(
      "Component 1 description of implementing control 1"
    );

    expect(paramValueTextField.value).toBe(
      "control 1 / component 1 / parameter 1 value"
    );
  });

  test(`${parentElementName} handles edit with just description edit and keeps placeholders`, async () => {
    const descriptionTextField = screen.getByLabelText("Description");
    const paramValueTextField = screen.getByLabelText("control-1_prm_1");
    fireEvent.change(descriptionTextField, {
      target: { value: "Test Description" },
    });
    screen
      .getByRole("button", {
        name: "save-control-1_smt.a",
      })
      .click();
    expect(descriptionTextField.value).toBe("Test Description");

    screen.getByLabelText("control-1_prm_1");
    expect(paramValueTextField.value).toBe(
      "control 1 / component 1 / parameter 1 value"
    );
  });

  test(`${parentElementName} saves changes to controller name and description values`, async () => {
    const descriptionTextField = screen.getByLabelText("Description");
    const paramValueTextField = screen.getByLabelText("control-1_prm_1");
    fireEvent.change(descriptionTextField, {
      target: { value: "Test Description" },
    });
    fireEvent.change(paramValueTextField, {
      target: { value: "Test Control Name" },
    });
    screen
      .getByRole("button", {
        name: "save-control-1_smt.a",
      })
      .click();
    expect(descriptionTextField.value).toBe("Test Description");
    expect(paramValueTextField.value).toBe("Test Control Name");
  });
}

testOSCALControlProseEditing(
  "OSCALReplacedProseWithByComponentParameterValue",
  proseParamValuesEditingRenderer
);
