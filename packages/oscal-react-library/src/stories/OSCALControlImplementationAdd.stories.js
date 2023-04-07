import React from "react";
import OSCALControlImplementationAdd from "../components/OSCALControlImplementationAdd";
import { controlsData } from "../test-data/ControlsData";

export default {
  title: "Components/ Oscal Control Implementation Add",
  component: OSCALControlImplementationAdd,
};

function Template(args) {
  return <OSCALControlImplementationAdd {...args} />;
}

const controls = controlsData.map((control) => ({
  id: control.id,
  title: control.title,
}));

const implementedControls = [controlsData[0].id];

export const Default = Template.bind({});

Default.args = {
  controls,
  implementedControls,
};
