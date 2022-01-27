import React from "react";
import OSCALSystemCharacteristics from "../components/OSCALSystemCharacteristics";
import { systemCharacteristicsTestData } from "../test-data/SystemData";

export default {
  title: "Components/System Characteristics",
  component: OSCALSystemCharacteristics,
};

function Template(args) {
  return <OSCALSystemCharacteristics {...args} />;
}

export const Default = Template.bind({});

Default.args = {
  systemCharacteristics: systemCharacteristicsTestData,
};
