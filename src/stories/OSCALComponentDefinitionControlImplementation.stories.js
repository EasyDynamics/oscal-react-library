import React from "react";
import OSCALComponentDefinitionControlImplementation from "../components/OSCALComponentDefinitionControlImplementation";
import {
  componentDefinitionControlImplementationTestData,
  exampleComponentStories,
} from "../test-data/ComponentsData";
import { controlsData } from "../test-data/ControlsData";

export default {
  title: "Components/Component Definition Control Implementation",
  component: OSCALComponentDefinitionControlImplementation,
};

function Template(args) {
  return <OSCALComponentDefinitionControlImplementation {...args} />;
}

export const Default = Template.bind({});

Default.args = {
  controlImplementations: componentDefinitionControlImplementationTestData,
  components: exampleComponentStories,
  controls: controlsData,
};
