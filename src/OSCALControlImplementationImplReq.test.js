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
      statements: [
        {
          "statement-id": "statement-1",
          uuid: "f3887a91-9ed3-425c-b305-21e4634a1c34",
          "by-components": [
            {
              "component-uuid": "by-component-1",
              uuid: "a74681b2-fbcb-46eb-90fd-0d55aa74ac7b",
              description: "Component 1 description of implementing control 1",
              "set-parameters": [
                {
                  "param-id": "param-1",
                  values: ["control 1 / component 1 / parameter 1 value"]
                },
              ]
            },
          ]
        },
      ]
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
            prose: "Does something with {{ insert: param, control-1_prm_1 }} and {{ insert: param, control-1_prm_2 }}:",
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
