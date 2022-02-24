import React from "react";
import { render, screen } from "@testing-library/react";
import { controlImplTestData } from "../test-data/ControlsData";
import OSCALPopover from "./OSCALPopover";

function OSCALPopoverRenderer() {
  const implementedRequirement =
    controlImplTestData["implemented-requirements"][0];
  const statement = implementedRequirement.statements[0];

  render(
    <OSCALPopover
      anchorEl
      controlId={implementedRequirement["control-id"]}
      statementByComponent={statement["by-components"][0]}
      statementId={statement["statement-id"]}
    />
  );
}

function testOSCALPopover(parentElementName, renderer) {
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
      "Popover Implementation TextField"
    );
    expect(implementationTextField).toBeVisible();
  });
}

testOSCALPopover("OSCALPopover", OSCALPopoverRenderer);
