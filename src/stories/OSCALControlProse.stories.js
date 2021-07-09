import React from "react";
import { OSCALReplacedProseWithParameterLabel } from "../components/OSCALControlProse";

export default {
  title: "Control Prose",
  component: OSCALReplacedProseWithParameterLabel,
};

const Template = (args) => <OSCALReplacedProseWithParameterLabel {...args} />;

export const ParameterConstraints = Template.bind({});

export const NoConstraints = Template.bind({});

const exampleParams = [
  {
    id: "control-1_prm_1",
    label: "control 1 label",
  },
  {
    id: "control-1_prm_2",
    label: "control 2 label",
  },
];

const exampleModifications = {
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

ParameterConstraints.args = {
  modifications: exampleModifications,
  label: "a.",
  prose:
    "Does something with {{ insert: param, control-1_prm_1 }} and {{ insert: param, control-1_prm_2 }}",
  parameters: exampleParams,
};

NoConstraints.args = {
  label: "a.",
  prose:
    "Does something with {{ insert: param, control-1_prm_1 }} and {{ insert: param, control-1_prm_2 }}",
  parameters: exampleParams,
};
