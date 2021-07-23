import React from "react";
import OSCALControl from "../components/OSCALControl";
import { exampleControl } from "../test-data/ControlsData";
import {
  exampleModificationSetParameters,
  exampleModificationAltersTopLevel,
} from "../test-data/ModificationsData";

export default {
  title: "Components/Control",
  component: OSCALControl,
};

const Template = (args) => <OSCALControl {...args} />;

export const Default = Template.bind({});

export const WithParameterConstraints = Template.bind({});

export const WithModifications = Template.bind({});

Default.args = {
  control: exampleControl,
};

WithParameterConstraints.args = {
  control: exampleControl,
  modificationSetParameters: exampleModificationSetParameters,
};

WithModifications.args = {
  control: exampleControl,
  modificationAlters: exampleModificationAltersTopLevel,
};
