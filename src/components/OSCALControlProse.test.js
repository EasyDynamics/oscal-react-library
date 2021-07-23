import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { OSCALReplacedProseWithParameterLabel } from "./OSCALControlProse";
import { exampleModificationsConstraints } from "../test-data/ModificationsData";
import { controlProseTestData, exampleParams } from "../test-data/OtherData";

const labelTestData = "label-1";

function proseParamLabelsRenderer() {
  const modificationSetParametersTestData = Object.values(
    exampleModificationsConstraints["set-parameters"]
  );
  render(
    <OSCALReplacedProseWithParameterLabel
      label={labelTestData}
      prose={controlProseTestData}
      parameters={exampleParams}
      modificationSetParameters={modificationSetParametersTestData}
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
