import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import OSCALControlImplementation from "./OSCALControlImplementation";
import getByTextIncludingChildern from "./oscal-utils/TestUtils";
import { controlImplTestData, exampleControl } from "../test-data/ControlsData";
import { exampleComponents } from "../test-data/ComponentsData";

const controlsTestData = [exampleControl];

test("OSCALControlImplementationImplReq displays control ID", () => {
  render(
    <OSCALControlImplementation
      controlImplementation={controlImplTestData}
      components={exampleComponents}
      controls={controlsTestData}
    />
  );
  const result = screen.getByText("control-1");
  expect(result).toBeVisible();
});

test("OSCALControlImplementationImplReq displays component parameters in control prose", () => {
  render(
    <OSCALControlImplementation
      controlImplementation={controlImplTestData}
      components={exampleComponents}
      controls={controlsTestData}
    />
  );
  const result = getByTextIncludingChildern(
    "Does something with control 1 / component 1 / parameter 1 value and control 1 / component 1 / parameter 2 value"
  );
  expect(result).toBeVisible();
});

test("OSCALControlImplementationImplReq displays component implementation description", async () => {
  render(
    <OSCALControlImplementation
      controlImplementation={controlImplTestData}
      components={exampleComponents}
      controls={controlsTestData}
    />
  );

  userEvent.hover(
    screen.getByRole("link", {
      name: "Component 1 description of implementing control 1",
    })
  );
  expect(
    await screen.findByText("Component 1 description of implementing control 1")
  ).toBeInTheDocument();
});
