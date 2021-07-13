import React from "react";
import OSCALControlPart from "../components/OSCALControlPart";

export default {
  title: "Components/Control Part",
  component: OSCALControlPart,
};

const Template = (args) => <OSCALControlPart {...args} />;

export const Default = Template.bind({});

export const ParameterConstraints = Template.bind({});

export const AddsModifications = Template.bind({});

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
          "by-id": "control-1_smt.a",
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
};

ParameterConstraints.args = {
  control: exampleControl,
  part: exampleControl.parts[0],
  parameters: exampleControl.params,
  modifications: exampleModificationsConstraints,
  componentId: "control-1_smt",
};

AddsModifications.args = {
  control: exampleControl,
  part: exampleControl.parts[0],
  parameters: exampleControl.params,
  modifications: exampleModificationsAdds,
  componentId: "control-1_smt",
};

Default.args = {
  control: exampleControl,
  part: exampleControl.parts[0],
  parameters: exampleControl.params,
  componentId: "control-1_smt",
};
