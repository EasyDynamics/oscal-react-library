// Storybook docs for Replaced Prose with By-Component Parameter Value

import React from "react";
import { OSCALReplacedProseWithByComponentParameterValue } from "../components/OSCALControlProse";
import { exampleImplReqStatements } from "../test-data/ComponentsData";
import { exampleParams } from "../test-data/OtherData";

export default {
  title: "Components/Replaced Prose with By-Component Parameter Value",
  component: OSCALReplacedProseWithByComponentParameterValue,
};

const Template = (args) => (
  <OSCALReplacedProseWithByComponentParameterValue {...args} />
);

export const Default = Template.bind({});

Default.args = {
  label: "a.",
  prose:
    "Does something with {{ insert: param, control-1_prm_1 }} and {{ insert: param, control-1_prm_2 }}",
  parameters: exampleParams,
  statementId: "a_smt",
  implReqStatements: exampleImplReqStatements,
};
