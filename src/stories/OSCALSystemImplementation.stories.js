import React from "react";
import OSCALSystemImplementation from "../components/OSCALSystemImplementation";
import {
  exampleSystemImplementation,
  exampleSystemImplementationLastModified,
  exampleSystemImplementationVersion,
} from "../test-data/SystemData";
import { exampleParties } from "../test-data/OtherData";

export default {
  title: "Components/System Implementation",
  component: OSCALSystemImplementation,
};

const Template = (args) => <OSCALSystemImplementation {...args} />;

export const Default = Template.bind({});

export const SystemImplementationLastModified = Template.bind({});

export const SystemImplementationVersion = Template.bind({});

Default.args = {
  systemImplementation: exampleSystemImplementation,
  parties: exampleParties,
};

SystemImplementationLastModified.args = {
  systemImplementation: exampleSystemImplementationLastModified,
  parties: exampleParties,
};

SystemImplementationVersion.args = {
  systemImplementation: exampleSystemImplementationVersion,
  parties: exampleParties,
};
