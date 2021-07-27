import React from "react";
import OSCALControlGuidance from "../components/OSCALControlGuidance";

export default {
  title: "Components/Control Guidance",
  component: OSCALControlGuidance,
};

const Template = (args) => <OSCALControlGuidance {...args} />;

export const Default = Template.bind({});

Default.args = {
  prose: "This is some text about guidance.",
};
