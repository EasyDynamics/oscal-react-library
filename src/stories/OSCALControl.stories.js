import React from "react";
import OSCALControl from "../components/OSCALControl";

export default {
  title: "Control Display",
  component: OSCALControl,
};

const Template = (args) => <OSCALControl {...args} />;

export const AddsModifications = Template.bind({});

export const NoAdds = Template.bind({});

const exampleControl = {
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
            "Does something with {{ insert: param, control-1_prm_1 }} and {{ insert: param, control-1_prm_2 }}",
        },
      ],
    },
  ],
};

const exampleModificationsConstraints = {
  "set-parameters": [
    {
      "param-id": "control-1_prm_1",
      constraints: [
        {
          description: "some constraint",
        },
      ],
    },
    {
      "param-id": "control-1_prm_2",
      constraints: [
        {
          description: "another constraint",
        },
      ],
    },
  ],
};

const exampleModificationsAdds = {
  alters: [
    {
      "control-id": "control-1",
      adds: [
        {
          position: "starting",
          props: [
            {
              name: "Name",
              value: "Value",
            },
          ],
        },
      ],
    },
  ],

  "set-parameters": [
    {
      "param-id": "control-1_prm_1",
      constraints: [
        {
          description: "some constraint",
        },
      ],
    },
    {
      "param-id": "control-1_prm_2",
      constraints: [
        {
          description: "another constraint",
        },
      ],
    },
  ],
};

NoAdds.args = {
  control: exampleControl,
  modifications: exampleModificationsConstraints,
};

AddsModifications.args = {
  control: exampleControl,
  modifications: exampleModificationsAdds,
};
