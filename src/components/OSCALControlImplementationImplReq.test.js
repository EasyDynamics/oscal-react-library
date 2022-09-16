import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import OSCALControlImplementation from "./OSCALControlImplementation";
import getByTextIncludingChildren from "./oscal-utils/TestUtils";
import { controlImplTestData, exampleControl } from "../test-data/ControlsData";
import {
  exampleComponents,
  componentsTestData,
} from "../test-data/ComponentsData";
import { profileModifyTestData } from "../test-data/ModificationsData";
import { sspRestData } from "../test-data/SystemData";

const controlsTestData = [exampleControl];

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
    const nonplaceholder1 = getByTextIncludingChildren(/does something with/i);
    const placeholderText1 = getByTextIncludingChildren(
      /control 1 \/ component 1 \/ parameter 1 value/i
    );
    const nonplaceholder2 = getByTextIncludingChildren(/and/i);
    const placeholderText2 = getByTextIncludingChildren(
      /control 1 \/ component 1 \/ parameter 2 value/i
    );

    expect(nonplaceholder1).toBeVisible();
    expect(placeholderText1).toBeVisible();
    expect(nonplaceholder2).toBeVisible();
    expect(placeholderText2).toBeVisible();
  });

  test(`${parentElementName} displays component implementation description`, async () => {
    renderer();

    await userEvent.hover(
      screen.getByRole("link", {
        name: "a.",
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
