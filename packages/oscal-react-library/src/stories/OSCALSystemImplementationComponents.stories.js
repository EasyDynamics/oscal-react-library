import React from "react";
import { systemImplementationTestData } from "../test-data/SystemData";
import { exampleParties } from "../test-data/CommonData";
import { OSCALSystemImplementationComponents } from "../components/OSCALSystemImplementationComponents";

export default {
  title: "Components/System Implementation Components",
  component: OSCALSystemImplementationComponents,
};

function Template(args) {
  return <OSCALSystemImplementationComponents {...args} />;
}

export const Default = Template.bind({});

Default.args = {
  components: systemImplementationTestData.components,
  parties: exampleParties,
};
