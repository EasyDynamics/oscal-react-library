import React from "react";
import OSCALControlGuidance from "../components/OSCALControlGuidance";

export default {
  title: "Components/Control Guidance",
  component: OSCALControlGuidance,
};

function Template(args) {
  return <OSCALControlGuidance {...args} />;
}

export const Default = Template.bind({});

Default.args = {
  prose: "This is some text about guidance.",
  id: "ac-1",
};
