import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import OSCALComponentDefinitionControlImplementation from "./OSCALComponentDefinitionControlImplementation";
import getByTextIncludingChildern from "./oscal-utils/TestUtils";
import { controlsData } from "../test-data/ControlsData";
import {
  componentDefinitionControlImplementationTestData,
  componentDefinitionTestData,
} from "../test-data/ComponentsData";

const profileModifyTestData = {
  "set-parameters": [
    {
      "param-id": "control-1_prm_1",
      constraints: [
        {
          description: "at least every 3 years",
        },
      ],
    },
    {
      "param-id": "control-1_prm_2",
      constraints: [
        {
          description: "at least annually",
        },
      ],
    },
  ],
  alters: [
    {
      "control-id": "control-1",
      adds: [
        {
          position: "starting",
          props: [
            {
              name: "priority",
              value: "P1",
            },
          ],
        },
      ],
    },
  ],
};

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
  const resultByProse = getByTextIncludingChildern(
    "Does something with < control 1 / parameter 1 label > and < control 1 / parameter 2 label >"
  );
  expect(resultByProse).toBeVisible();
});

test(`OSCALComponentDefinitionControlImplementation does not display control modifications`, async () => {
  render(
    <OSCALComponentDefinitionControlImplementation
      controlImplementations={componentDefinitionControlImplementationTestData}
      components={componentDefinitionTestData.components}
      controls={controlsData}
    />
  );
  expect(
    await screen.findByText("Control Implementations", {
      timeout: 10000,
    })
  ).toBeInTheDocument();

  expect(() =>
    screen.findByRole("button").toThrow("Unable to find an element")
  );
});

test(`OSCALComponentDefinitionControlImplementation displays control modifications`, async () => {
  render(
    <OSCALComponentDefinitionControlImplementation
      controlImplementations={componentDefinitionControlImplementationTestData}
      components={componentDefinitionTestData.components}
      controls={controlsData}
      modifications={profileModifyTestData}
    />
  );

  expect(
    await screen.findByText("Control Implementations", {
      timeout: 10000,
    })
  ).toBeInTheDocument();

  const modButton = await screen.findByRole("button", { timeout: 10000 });

  fireEvent.click(modButton);
  expect(await screen.findByText("Modifications")).toBeVisible();
  expect(await screen.findByText("Adds")).toBeVisible();
});
