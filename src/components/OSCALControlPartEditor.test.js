import React from "react";
import { render, screen } from "@testing-library/react";
import { controlImplTestData } from "../test-data/ControlsData";
import OSCALControlPartEditor from "./OSCALControlPartEditor";

function OSCALControlPartEditorRenderer() {
  const implementedRequirement =
    controlImplTestData["implemented-requirements"][0];
  const statement = implementedRequirement.statements[0];

  render(
    <OSCALControlPartEditor
      anchorEl
      controlId={implementedRequirement["control-id"]}
      isUserDefinedImplementation
      statementId={statement["statement-id"]}
    />
  );
}

function testOSCALControlPartEditor(parentElementName, renderer) {
  test(`${parentElementName} displays popover`, async () => {
    renderer();
  });

  test(`${parentElementName} displays popover TextFields`, async () => {
    renderer();
    const descriptionTextField = screen.getByTestId(
      "Popover Description TextField"
    );
    expect(descriptionTextField).toBeVisible();

    const implementationTextField = screen.getByTestId(
      "Popover Implementation Autocomplete TextField"
    );
    expect(implementationTextField).toBeVisible();
  });
}

testOSCALControlPartEditor(
  "OSCALControlPartEditor",
  OSCALControlPartEditorRenderer
);
