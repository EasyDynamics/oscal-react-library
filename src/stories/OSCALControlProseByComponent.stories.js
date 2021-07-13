// Storybook docs for Replaced Prose with By-Component Parameter Value

import React from "react";
import { OSCALReplacedProseWithByComponentParameterValue } from "../components/OSCALControlProse";

export default {
  title: "Components/Replaced Prose with By-Component Parameter Value",
  component: OSCALReplacedProseWithByComponentParameterValue,
};

const Template = (args) => (
  <OSCALReplacedProseWithByComponentParameterValue {...args} />
);

export const Default = Template.bind({});

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

const exampleByComponents = [
  {
    "set-parameters": [
      {
        "param-id": "control-1_prm_1",
        values: ["param 1 value"],
      },
      {
        "param-id": "control-1_prm_2",
        values: ["param 2 value"],
      },
    ],
  },
];

const exampleImplReqStatements = [
  {
    "statement-id": "a_smt",
    "by-components": exampleByComponents,
  },
];

Default.args = {
  label: "a.",
  prose:
    "Does something with {{ insert: param, control-1_prm_1 }} and {{ insert: param, control-1_prm_2 }}",
  parameters: exampleParams,
  statementId: "a_smt",
  implReqStatements: exampleImplReqStatements,
};
