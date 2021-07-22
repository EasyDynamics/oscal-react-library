import React from "react";
import { OSCALReplacedProseWithParameterLabel } from "../components/OSCALControlProse";
import { exampleModificationsConstraints } from "../test-data/ModificationsData";
import { controlProseTestData, exampleParams } from "../test-data/OtherData";

export default {
  title: "Components/Replaced Prose with Parameter Label",
  component: OSCALReplacedProseWithParameterLabel,
};

const Template = (args) => <OSCALReplacedProseWithParameterLabel {...args} />;

export const Default = Template.bind({});

export const ParameterConstraints = Template.bind({});

ParameterConstraints.args = {
  modifications: exampleModificationsConstraints,
  label: "a.",
  prose: controlProseTestData,
  parameters: exampleParams,
};

Default.args = {
  label: "a.",
  prose: controlProseTestData,
  parameters: exampleParams,
};
