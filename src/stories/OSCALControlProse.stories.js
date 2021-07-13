import React from "react";
import { OSCALReplacedProseWithParameterLabel } from "../components/OSCALControlProse";

export default {
  title: "Components/Replaced Prose with Parameter Label",
  component: OSCALReplacedProseWithParameterLabel,
};

const Template = (args) => <OSCALReplacedProseWithParameterLabel {...args} />;

export const Default = Template.bind({});

export const ParameterConstraints = Template.bind({});

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

Default.args = {
  label: "a.",
  prose:
    "Does something with {{ insert: param, control-1_prm_1 }} and {{ insert: param, control-1_prm_2 }}",
  parameters: exampleParams,
};
