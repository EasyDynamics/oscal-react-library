import React from "react";
import OSCALControlGuidance from "../components/OSCALControlGuidance";

export default {
  title: "Control Guidance",
  component: OSCALControlGuidance,
};

const Template = (args) => <OSCALControlGuidance {...args} />;

export const Example = Template.bind({});

Example.args = {
  prose: "This is some text about guidance.",
};
