import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import OSCALControlImplementation from "./OSCALControlImplementation";
import getByTextIncludingChildern from "./oscal-utils/TestUtils";
import { controlImplTestData, exampleControl } from "../test-data/ControlsData";
import { exampleComponents } from "../test-data/ComponentsData";

const controlsTestData = [exampleControl];

const componentsTestData = [
  {
    uuid: "component-1",
    title: "Component 1 Title",
  },
];

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

const emptyProfileModifyTestData = {};

function controlImplementationImplReqRenderer() {
  render(
    <OSCALControlImplementation
      controlImplementation={controlImplTestData}
      components={exampleComponents}
      controls={controlsTestData}
      modifications={profileModifyTestData}
    />
  );
}

export default function testOSCALControlImplementationImplReq(
  parentElementName,
  renderer
) {
  test(`${parentElementName} displays control ID`, () => {
    renderer();
    const result = screen.getByText("control-1");
    expect(result).toBeVisible();
  });

  test(`${parentElementName} displays component parameters in control prose`, () => {
    renderer();
    const result = getByTextIncludingChildern(
      "Does something with control 1 / component 1 / parameter 1 value and control 1 / component 1 / parameter 2 value"
    );
    expect(result).toBeVisible();
  });

  test(`${parentElementName} displays component implementation description`, async () => {
    renderer();

    userEvent.hover(
      screen.getByRole("link", {
        name: "Component 1 description of implementing control 1",
      })
    );
    expect(
      await screen.findByText(
        "Component 1 description of implementing control 1"
      )
    ).toBeInTheDocument();
  });

  test(`${parentElementName} displays component modifications`, async () => {
    renderer();

    const modButton = await screen.findByRole(
      "button",
      { name: "control-1 modifications" },
      { timeout: 10000 }
    );
    fireEvent.click(modButton);
    expect(await screen.findByText("Modifications")).toBeVisible();
    expect(await screen.findByText("Adds")).toBeVisible();
  });

  test(`${parentElementName} does not display control modifications`, async () => {
    render(
      <OSCALControlImplementation
        controlImplementation={controlImplTestData}
        components={componentsTestData}
        controls={controlsTestData}
        modifications={emptyProfileModifyTestData}
      />
    );
    expect(
      await screen.findByText("Control Implementation", {
        timeout: 10000,
      })
    ).toBeInTheDocument();
    expect(() =>
      screen.findByRole("button").toThrow("Unable to find an element")
    );
  });
}

testOSCALControlImplementationImplReq(
  "OSCALControlImplementationImplReq",
  controlImplementationImplReqRenderer
);
