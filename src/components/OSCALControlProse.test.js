import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { OSCALReplacedProseWithParameterLabel } from "./OSCALControlProse";
import { exampleModificationsConstraints } from "../test-data/ModificationsData";
import { exampleParams } from "../test-data/OtherData";

const labelTestData = "label-1";
const proseTestData =
  "Does something with {{ insert: param, control-1_prm_1 }} and {{ insert: param, control-1_prm_2 }}";

function proseParamLabelsRenderer() {
  render(
    <OSCALReplacedProseWithParameterLabel
      label={labelTestData}
      prose={proseTestData}
      parameters={exampleParams}
      modifications={exampleModificationsConstraints}
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
