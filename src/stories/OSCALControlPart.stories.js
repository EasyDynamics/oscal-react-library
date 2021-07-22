import React from "react";
import OSCALControlPart from "../components/OSCALControlPart";
import { exampleControl } from "../test-data/ControlsData";
import {
  exampleModificationsAddsTwo,
  exampleModificationsConstraints,
} from "../test-data/ModificationsData";

export default {
  title: "Components/Control Part",
  component: OSCALControlPart,
};

const Template = (args) => <OSCALControlPart {...args} />;

export const Default = Template.bind({});

export const ParameterConstraints = Template.bind({});

export const AddsModifications = Template.bind({});

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
  modifications: exampleModificationsAddsTwo,
  componentId: "control-1_smt",
};

Default.args = {
  control: exampleControl,
  part: exampleControl.parts[0],
  parameters: exampleControl.params,
  componentId: "control-1_smt",
};
