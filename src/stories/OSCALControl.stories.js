import React from "react";
import OSCALControl from "../components/OSCALControl";
import { exampleControl } from "../test-data/ControlsData";
import {
  exampleModificationsAddsThree,
  exampleModificationsConstraints,
} from "../test-data/ModificationsData";

export default {
  title: "Components/Control Display",
  component: OSCALControl,
};

const Template = (args) => <OSCALControl {...args} />;

export const Default = Template.bind({});

export const AddsModifications = Template.bind({});

Default.args = {
  control: exampleControl,
  modifications: exampleModificationsConstraints,
};

AddsModifications.args = {
  control: exampleControl,
  modifications: exampleModificationsAddsThree,
};
