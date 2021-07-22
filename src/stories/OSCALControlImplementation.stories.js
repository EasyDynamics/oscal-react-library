import React from "react";
import OSCALControlImplementation from "../components/OSCALControlImplementation";
import { exampleComponents } from "../test-data/ComponentsData";
import {
  controlImplTestData,
  exampleControl,
  exampleImplNoStatements,
} from "../test-data/ControlsData";

export default {
  title: "Components/Control Implementation",
  component: OSCALControlImplementation,
};

const Template = (args) => <OSCALControlImplementation {...args} />;

export const Default = Template.bind({});

export const ImplementedStatements = Template.bind({});

const exampleControls = [exampleControl];

ImplementedStatements.args = {
  controls: exampleControls,
  components: exampleComponents,
  controlImplementation: controlImplTestData,
};

Default.args = {
  controls: exampleControls,
  components: exampleComponents,
  controlImplementation: exampleImplNoStatements,
};
