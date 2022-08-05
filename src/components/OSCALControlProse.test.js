import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import {
  OSCALReplacedProseWithParameterLabel,
  OSCALReplacedProseWithByComponentParameterValue,
} from "./OSCALControlProse";
import {
  exampleModificationSetParameters,
  exampleModificationSetParametersDecimal,
} from "../test-data/ModificationsData";
import {
  controlImplTestData,
  controlImplWithDecSmtTestData,
  controlProseTestData,
  controlProseDecimalTestData,
  exampleParams,
  exampleDecimalParams,
} from "../test-data/ControlsData";
import { sspRestData } from "../test-data/SystemData";

const labelTestData = "label-1";
const labelTestDataDecimal = "label-1.1";

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

function renderOSCALControlProseEditing(renderer, rollName) {
  renderer();
  screen
    .getByRole("button", {
      name: rollName,
    })
    .click();
}

function testDefaultDescription(controlName, componentName, parameterValue) {
  const descriptionTextField = screen.getByLabelText("Description");
  const paramValueTextField = screen.getByLabelText(parameterValue);
  expect(descriptionTextField.value).toBe(
    `${
      componentName.charAt(0).toUpperCase() +
      componentName.slice(1).toLowerCase()
    } description of implementing control 1`
  );

  expect(paramValueTextField.value).toBe(
    `${controlName} / ${componentName} / parameter 1 value`
  );
}

function EditDescription(
  controlName,
  componentName,
  parameterValue,
  statementValue
) {
  const descriptionTextField = screen.getByLabelText("Description");
  const paramValueTextField = screen.getByLabelText(parameterValue);
  fireEvent.change(descriptionTextField, {
    target: { value: "Test Description" },
  });
  screen
    .getByRole("button", {
      name: statementValue,
    })
    .click();
  expect(descriptionTextField.value).toBe("Test Description");

  screen.getByLabelText(parameterValue);
  expect(paramValueTextField.value).toBe(
    `${controlName} / ${componentName} / parameter 1 value`
  );
}

function EditControllerName(parameterValue, statementValue) {
  const descriptionTextField = screen.getByLabelText("Description");
  const paramValueTextField = screen.getByLabelText(parameterValue);
  fireEvent.change(descriptionTextField, {
    target: { value: "Test Description" },
  });
  fireEvent.change(paramValueTextField, {
    target: { value: "Test Control Name" },
  });
  screen
    .getByRole("button", {
      name: statementValue,
    })
    .click();
  expect(descriptionTextField.value).toBe("Test Description");
  expect(paramValueTextField.value).toBe("Test Control Name");
}

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
  const controlName = "control 1";
  const componentName = "component 1";
  const parameterValue = "control-1_prm_1";
  const statementValue = "save-control-1_smt.a";
  const rollName = "edit-bycomponent-component-1-statement-control-1_smt.a";

  test(`${parentElementName} displays default description and parameter inputs`, async () => {
    renderOSCALControlProseEditing(renderer, rollName);
    testDefaultDescription(controlName, componentName, parameterValue);
  });

  test(`${parentElementName} handles edit with just description edit and keeps placeholders`, async () => {
    renderOSCALControlProseEditing(renderer, rollName);
    EditDescription(controlName, componentName, parameterValue, statementValue);
  });

  test(`${parentElementName} saves changes to controller name and description values`, async () => {
    renderOSCALControlProseEditing(renderer, rollName);
    EditControllerName(parameterValue, statementValue);
  });
}

testOSCALControlProseEditing(
  "OSCALReplacedProseWithByComponentParameterValue",
  proseParamValuesEditingRenderer
);

function proseDecimalParamValuesEditingRenderer() {
  render(
    <OSCALReplacedProseWithByComponentParameterValue
      label={labelTestDataDecimal}
      prose={controlProseDecimalTestData}
      parameters={exampleDecimalParams}
      implementedRequirement={
        controlImplWithDecSmtTestData["implemented-requirements"][0]
      }
      statementId="control-1.1_smt.a"
      componentId="component-1.1"
      modificationSetParameters={exampleModificationSetParametersDecimal}
      isEditable
      partialRestData={sspRestData}
    />
  );
}

function testOSCALControlDecimalProseEditing(parentElementName, renderer) {
  const controlName = "control 1.1";
  const componentName = "component 1.1";
  const parameterValue = "control-1.1_prm_1";
  const statementValue = "save-control-1.1_smt.a";
  const rollName = "edit-bycomponent-component-1.1-statement-control-1.1_smt.a";

  test(`${parentElementName} displays default description and parameter inputs`, async () => {
    renderOSCALControlProseEditing(renderer, rollName);
    testDefaultDescription(controlName, componentName, parameterValue);
  });

  test(`${parentElementName} handles edit with just description edit and keeps placeholders`, async () => {
    renderOSCALControlProseEditing(renderer, rollName);
    EditDescription(controlName, componentName, parameterValue, statementValue);
  });

  test(`${parentElementName} saves changes to controller name and description values`, async () => {
    renderOSCALControlProseEditing(renderer, rollName);
    EditControllerName(parameterValue, statementValue);
  });
}

testOSCALControlDecimalProseEditing(
  "OSCALReplacedProseWithByComponentParameterWithDecimalValue",
  proseDecimalParamValuesEditingRenderer
);
