import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { OSCALControlPart } from "./OSCALControlPart";
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
