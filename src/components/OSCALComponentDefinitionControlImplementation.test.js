import React from "react";
import { render, screen } from "@testing-library/react";
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
  const nonplaceholder1 = getByTextIncludingChildern(/Does something with/i);
  const placeholderText1 = getByTextIncludingChildern(
    /< control 1 \/ parameter 1 label >/i
  );
  const nonplaceholder2 = getByTextIncludingChildern(/and/i);
  const placeholderText2 = getByTextIncludingChildern(
    /< control 1 \/ parameter 2 label >/i
  );

  expect(nonplaceholder1).toBeVisible();
  expect(placeholderText1).toBeVisible();
  expect(nonplaceholder2).toBeVisible();
  expect(placeholderText2).toBeVisible();
});

testOSCALControlParamLegend(
  "OSCALComponentDefinitionControlImplementation",
  <OSCALComponentDefinitionControlImplementation
    controlImplementations={componentDefinitionControlImplementationTestData}
    components={componentDefinitionTestData.components}
    controls={controlsData}
  />
);
