import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { OSCALReplacedProseWithParameterLabel } from "./OSCALControlProse";
import { exampleModificationSetParameters } from "../test-data/ModificationsData";
import {
  controlImplTestData,
  controlProseTestData,
  exampleParams,
} from "../test-data/ControlsData";

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
  });
}

testOSCALControlProseParamLabels("OSCALControlProse", proseParamLabelsRenderer);
