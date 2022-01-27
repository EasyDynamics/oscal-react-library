import React from "react";
import OSCALControlPart from "../components/OSCALControlPart";
import { exampleControl } from "../test-data/ControlsData";
import {
  exampleModificationAlters,
  exampleModificationSetParameters,
} from "../test-data/ModificationsData";

export default {
  title: "Components/Control Part",
  component: OSCALControlPart,
};

function Template(args) {
  return <OSCALControlPart {...args} />;
}

export const Default = Template.bind({});

export const WithConstraints = Template.bind({});

export const WithModifications = Template.bind({});

WithConstraints.args = {
  control: exampleControl,
  part: exampleControl.parts[0],
  parameters: exampleControl.params,
  modificationSetParameters: exampleModificationSetParameters,
  componentId: "control-1_smt",
};

WithModifications.args = {
  control: exampleControl,
  part: exampleControl.parts[0],
  parameters: exampleControl.params,
  modificationAlters: exampleModificationAlters,
  componentId: "control-1_smt",
};

Default.args = {
  control: exampleControl,
  part: exampleControl.parts[0],
  parameters: exampleControl.params,
  componentId: "control-1_smt",
};
