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

describe("OSCALControlProse", () => {
  test("displays parameter labels", async () => {
    render(
      <OSCALReplacedProseWithParameterLabel
        implementedRequirement={controlImplTestData["implemented-requirements"][0]}
        label={labelTestData}
        prose={controlProseTestData}
        parameters={exampleParams}
        modificationSetParameters={exampleModificationSetParameters}
      />
    );

    const result = await screen.findByText("< control 1 label >");
    fireEvent.mouseOver(result);
    expect(await screen.findByText("some constraint")).toBeVisible();
    expect(await screen.findByText("param 3 value")).toBeVisible();
  });
});

describe("OSCALControlProse with parameter values editing", () => {
  test("displays default description and parameter inputs", async () => {
    render(
      <OSCALReplacedProseWithByComponentParameterValue
        label={labelTestData}
        prose={controlProseTestData}
        parameters={exampleParams}
        implementedRequirement={controlImplTestData["implemented-requirements"][0]}
        statementId="control-1_smt.a"
        componentId="component-1"
        modificationSetParameters={exampleModificationSetParameters}
        isEditable
        partialRestData={sspRestData}
      />
    );

    const button = screen.getByRole("button", {
      name: "edit-bycomponent-component-1-statement-control-1_smt.a",
    });
    fireEvent.click(button);

    const descriptionTextField = screen.getByLabelText("Description");
    const paramValueTextField = screen.getByLabelText("control-1_prm_1");
    expect(descriptionTextField.value).toBe("Component 1 description of implementing control 1");

    expect(paramValueTextField.value).toBe("control 1 / component 1 / parameter 1 value");
  });

  test("handles edit with just description edit and keeps placeholders", async () => {
    render(
      <OSCALReplacedProseWithByComponentParameterValue
        label={labelTestData}
        prose={controlProseTestData}
        parameters={exampleParams}
        implementedRequirement={controlImplTestData["implemented-requirements"][0]}
        statementId="control-1_smt.a"
        componentId="component-1"
        modificationSetParameters={exampleModificationSetParameters}
        isEditable
        partialRestData={sspRestData}
      />
    );

    const editButton = screen.getByRole("button", {
      name: "edit-bycomponent-component-1-statement-control-1_smt.a",
    });
    fireEvent.click(editButton);

    const descriptionTextField = screen.getByLabelText("Description");
    const paramValueTextField = screen.getByLabelText("control-1_prm_1");

    fireEvent.change(descriptionTextField, {
      target: { value: "Test Description" },
    });

    const saveButton = screen.getByRole("button", {
      name: "save-control-1_smt.a",
    });
    fireEvent.click(saveButton);

    expect(descriptionTextField.value).toBe("Test Description");

    screen.getByLabelText("control-1_prm_1");
    expect(paramValueTextField.value).toBe("control 1 / component 1 / parameter 1 value");
  });

  test("saves changes to controller name and description values", async () => {
    render(
      <OSCALReplacedProseWithByComponentParameterValue
        label={labelTestData}
        prose={controlProseTestData}
        parameters={exampleParams}
        implementedRequirement={controlImplTestData["implemented-requirements"][0]}
        statementId="control-1_smt.a"
        componentId="component-1"
        modificationSetParameters={exampleModificationSetParameters}
        isEditable
        partialRestData={sspRestData}
      />
    );

    const editButton = screen.getByRole("button", {
      name: "edit-bycomponent-component-1-statement-control-1_smt.a",
    });

    fireEvent.click(editButton);

    const descriptionTextField = screen.getByLabelText("Description");
    const paramValueTextField = screen.getByLabelText("control-1_prm_1");

    fireEvent.change(descriptionTextField, {
      target: { value: "Test Description" },
    });
    fireEvent.change(paramValueTextField, {
      target: { value: "Test Control Name" },
    });

    const saveButton = screen.getByRole("button", {
      name: "save-control-1_smt.a",
    });
    fireEvent.click(saveButton);

    expect(descriptionTextField.value).toBe("Test Description");
    expect(paramValueTextField.value).toBe("Test Control Name");
  });
});

describe("OSCALReplacedProse With ByComponent Parameter With Decimal Value", () => {
  test("displays default description and parameter inputs", async () => {
    render(
      <OSCALReplacedProseWithByComponentParameterValue
        label={labelTestDataDecimal}
        prose={controlProseDecimalTestData}
        parameters={exampleDecimalParams}
        implementedRequirement={controlImplWithDecSmtTestData["implemented-requirements"][0]}
        statementId="control-1.1_smt.a"
        componentId="component-1.1"
        modificationSetParameters={exampleModificationSetParametersDecimal}
        isEditable
        partialRestData={sspRestData}
      />
    );

    const editButton = screen.getByRole("button", {
      name: "edit-bycomponent-component-1.1-statement-control-1.1_smt.a",
    });
    fireEvent.click(editButton);

    const descriptionTextField = screen.getByLabelText("Description");
    const paramValueTextField = screen.getByLabelText("control-1.1_prm_1");
    expect(descriptionTextField.value).toBe("Component 1.1 description of implementing control 1");

    expect(paramValueTextField.value).toBe("control 1.1 / component 1.1 / parameter 1 value");
  });

  test("handles edit with just description edit and keeps placeholders", async () => {
    render(
      <OSCALReplacedProseWithByComponentParameterValue
        label={labelTestDataDecimal}
        prose={controlProseDecimalTestData}
        parameters={exampleDecimalParams}
        implementedRequirement={controlImplWithDecSmtTestData["implemented-requirements"][0]}
        statementId="control-1.1_smt.a"
        componentId="component-1.1"
        modificationSetParameters={exampleModificationSetParametersDecimal}
        isEditable
        partialRestData={sspRestData}
      />
    );

    const editButton = screen.getByRole("button", {
      name: "edit-bycomponent-component-1.1-statement-control-1.1_smt.a",
    });
    fireEvent.click(editButton);

    const descriptionTextField = screen.getByLabelText("Description");
    const paramValueTextField = screen.getByLabelText("control-1.1_prm_1");

    fireEvent.change(descriptionTextField, {
      target: { value: "Test Description" },
    });

    const saveButton = screen.getByRole("button", {
      name: "save-control-1.1_smt.a",
    });
    fireEvent.click(saveButton);

    expect(descriptionTextField.value).toBe("Test Description");

    screen.getByLabelText("control-1.1_prm_1");
    expect(paramValueTextField.value).toBe("control 1.1 / component 1.1 / parameter 1 value");
  });

  test("saves changes to controller name and description values", async () => {
    render(
      <OSCALReplacedProseWithByComponentParameterValue
        label={labelTestDataDecimal}
        prose={controlProseDecimalTestData}
        parameters={exampleDecimalParams}
        implementedRequirement={controlImplWithDecSmtTestData["implemented-requirements"][0]}
        statementId="control-1.1_smt.a"
        componentId="component-1.1"
        modificationSetParameters={exampleModificationSetParametersDecimal}
        isEditable
        partialRestData={sspRestData}
      />
    );

    const editButton = screen.getByRole("button", {
      name: "edit-bycomponent-component-1.1-statement-control-1.1_smt.a",
    });
    fireEvent.click(editButton);

    const descriptionTextField = screen.getByLabelText("Description");
    const paramValueTextField = screen.getByLabelText("control-1.1_prm_1");
    fireEvent.change(descriptionTextField, {
      target: { value: "Test Description" },
    });
    fireEvent.change(paramValueTextField, {
      target: { value: "Test Control Name" },
    });

    const saveButton = screen.getByRole("button", {
      name: "save-control-1.1_smt.a",
    });
    fireEvent.click(saveButton);

    expect(descriptionTextField.value).toBe("Test Description");
    expect(paramValueTextField.value).toBe("Test Control Name");
  });
});
