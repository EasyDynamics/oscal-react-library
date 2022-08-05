import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import OSCALControlImplementation from "./OSCALControlImplementation";
import getByTextIncludingChildern from "./oscal-utils/TestUtils";
import {
  controlImplTestData,
  controlImplWithDecSmtTestData,
  exampleControl,
  exampleControlWithDecSmt,
} from "../test-data/ControlsData";
import {
  exampleComponents,
  componentsTestData,
  componentsDecimalTestData,
} from "../test-data/ComponentsData";
import {
  profileModifyTestData,
  profileModifyDecSmtTestData,
} from "../test-data/ModificationsData";
import { sspRestData } from "../test-data/SystemData";
import testOSCALControlParamLegend from "../common-tests/ControlParamLegend.test";

const controlsTestData = [exampleControl];
const controlsDecTestData = [exampleControlWithDecSmt];

const emptyProfileModifyTestData = {};

function controlImplementationImplReqRenderer() {
  render(
    <OSCALControlImplementation
      controlImplementation={controlImplTestData}
      components={exampleComponents}
      controls={controlsTestData}
      modifications={profileModifyTestData}
      partialRestData={sspRestData}
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

  test(`${parentElementName}WithDecimalStatements displays component parameters in control prose`, () => {
    render(
      <OSCALControlImplementation
        controlImplementation={controlImplWithDecSmtTestData}
        components={componentsDecimalTestData}
        controls={controlsDecTestData}
        modifications={profileModifyDecSmtTestData}
        partialRestData={sspRestData}
      />
    );
    const result = getByTextIncludingChildern(
      "Does something with control 1.1 / component 1.1 / parameter 1 value and control 1.1 / component 1.1 / parameter 2 value"
    );
    expect(result).toBeVisible();
  });

  test(`${parentElementName} displays component implementation description`, async () => {
    renderer();

    await userEvent.hover(
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

  test(`${parentElementName} does not display control modifications`, async () => {
    render(
      <OSCALControlImplementation
        controlImplementation={controlImplTestData}
        components={componentsTestData}
        controls={controlsTestData}
        modifications={emptyProfileModifyTestData}
        partialRestData={sspRestData}
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

testOSCALControlParamLegend(
  "OSCALComponentControlImplementationImplReq",
  <OSCALControlImplementation
    controlImplementation={controlImplTestData}
    components={exampleComponents}
    controls={controlsTestData}
    modifications={profileModifyTestData}
    partialRestData={sspRestData}
  />
);
