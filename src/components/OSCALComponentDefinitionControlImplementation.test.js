import React from "react";
import { render, screen, within } from "@testing-library/react";
import OSCALComponentDefinitionControlImplementation from "./OSCALComponentDefinitionControlImplementation";
import getByTextIncludingChildern from "./oscal-utils/TestUtils";
import { controlsData } from "../test-data/ControlsData";
import {
  componentDefinitionControlImplementationTestData,
  componentDefinitionTestData,
} from "../test-data/ComponentsData";
import testOSCALControlParamLegend from "../common-tests/ControlParamLegend.test";

test("OSCALComponentDefinitionControlImplementation displays component implementation description", () => {
  render(
    <OSCALComponentDefinitionControlImplementation
      controlImplementations={componentDefinitionControlImplementationTestData}
      components={componentDefinitionTestData.components}
      controls={controlsData}
    />
  );
  const result = screen.getByText(
    "This is an example description for control implementation-1"
  );
  expect(result).toBeVisible();
});

test("OSCALComponentDefinitionControlImplementation displays control ID", () => {
  render(
    <OSCALComponentDefinitionControlImplementation
      controlImplementations={componentDefinitionControlImplementationTestData}
      components={componentDefinitionTestData.components}
      controls={controlsData}
    />
  );
  const result = screen.getByText("control-1");
  expect(result).toBeVisible();
});

test("OSCALComponentDefinitionControlImplementation displays component parameters in control prose", () => {
  render(
    <OSCALComponentDefinitionControlImplementation
      controlImplementations={componentDefinitionControlImplementationTestData}
      components={componentDefinitionTestData.components}
      controls={controlsData}
    />
  );
  const resultByProseBeginning = getByTextIncludingChildern(
    "Does something with"
  );
  const param1 = within(resultByProseBeginning).getByText("< control 1 / parameter 1 label >");
  const param2 = within(resultByProseBeginning).getByText("< control 1 / parameter 2 label >");
  expect(resultByProseBeginning).toBeVisible();
  expect(param1).toBeVisible();
  expect(param2).toBeVisible();
});

testOSCALControlParamLegend(
  "OSCALComponentDefinitionControlImplementation",
  <OSCALComponentDefinitionControlImplementation
    controlImplementations={componentDefinitionControlImplementationTestData}
    components={componentDefinitionTestData.components}
    controls={controlsData}
  />
);
