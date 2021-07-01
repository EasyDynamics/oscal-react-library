import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { OSCALReplacedProseWithParameterLabel } from "./OSCALControlProse";

const labelTestData = "label-1";
const proseTestData =
  "Does something with {{ insert: param, control-1_prm_1 }} and {{ insert: param, control-1_prm_2 }}";
const parametersTestData = [
  {
    id: "control-1_prm_1",
    label: "control 1 label",
  },
  {
    id: "control-1_prm_2",
    label: "control 2 label",
  },
];
const modificationsTestData = {
  "set-parameters": [
    {
      "param-id": "control-1_prm_1",
      constraints: [
        {
          description: "some constraint",
        },
      ],
    },
    {
      "param-id": "control-1_prm_2",
      constraints: [
        {
          description: "another constraint",
        },
      ],
    },
  ],
};

function proseParamLabelsRenderer() {
  render(
    <OSCALReplacedProseWithParameterLabel
      label={labelTestData}
      prose={proseTestData}
      parameters={parametersTestData}
      modifications={modificationsTestData}
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
