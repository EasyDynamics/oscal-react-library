import React from "react";
import OSCALComponentDefinitionComponent from "../components/OSCALComponentDefinitionComponent";
import { exampleComponentDefinitionComponent } from "../test-data/ComponentsData";
import { exampleParties } from "../test-data/CommonData";

export default {
  title: "Components/Component Definition Component",
  component: OSCALComponentDefinitionComponent,
};

const Template = (args) => <OSCALComponentDefinitionComponent {...args} />;

export const Default = Template.bind({});

Default.args = {
  component: exampleComponentDefinitionComponent,
  parties: exampleParties,
};
