import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import OSCALControlImplementation from "./OSCALControlImplementation";
import getByTextIncludingChildern from "./oscal-utils/TestUtils";

const controlImplData = {
  "implemented-requirements": [
    {
      uuid: "implemented-requirements-1",
      "control-id": "control-1",
      statements: {
        "control-1_smt": {},
        "control-1_smt.a": {
          "by-components": {
            "component-1": {
              description: "Component 1 description of implementing control 1",
              "parameter-settings": {
                "control-1_prm_1": {
                  values: ["control 1 / component 1 / parameter 1 value"],
                },
                "control-1_prm_2": {
                  values: ["control 1 / component 1 / parameter 2 value"],
                },
              },
            },
          },
        },
      },
    },
  ],
};
const componentsData = {
  "component-1": {
    title: "Component 1 Title",
  },
};
const controlsData = [
  {
    id: "control-1",
    title: "Control 1 Title",
    params: [
      {
        id: "control-1_prm_1",
        label: "control 1 / parameter 1 label",
      },
      {
        id: "control-1_prm_2",
        label: "control 1 / parameter 2 label",
      },
    ],
    parts: [
      {
        id: "control-1_smt",
        name: "statement",
        prose: "Some organizational group:",
        parts: [
          {
            id: "control-1_smt.a",
            name: "item",
            props: [
              {
                name: "label",
                value: "a.",
              },
            ],
            prose:
              "Does something with {{ insert: param, control-1_prm_1 }} and {{ insert: param, control-1_prm_2 }}:",
          },
        ],
      },
    ],
  },
];

test("OSCALControlImplementationImplReq displays control ID", () => {
  render(
    <OSCALControlImplementation
      controlImplementation={controlImplData}
      components={componentsData}
      controls={controlsData}
    />
  );
  const result = screen.getByText("control-1");
  expect(result).toBeVisible();
});

test("OSCALControlImplementationImplReq displays component parameters in control prose", () => {
  render(
    <OSCALControlImplementation
      controlImplementation={controlImplData}
      components={componentsData}
      controls={controlsData}
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
      controlImplementation={controlImplData}
      components={componentsData}
      controls={controlsData}
    />
  );
  userEvent.hover(screen.getByRole("link", { name: "a." }));
  expect(
    await screen.findByText("Component 1 description of implementing control 1")
  ).toBeInTheDocument();
});
