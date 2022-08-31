import React from "react";
import { systemImplementationTestData } from "../test-data/SystemData";
import OSCALSystemImplementationUsers from "../components/OSCALSystemImplementationUsers";

export default {
  title: "Components/System Implementation Users",
  component: OSCALSystemImplementationUsers,
};

function Template(args) {
  return <OSCALSystemImplementationUsers {...args} />;
}

export const Default = Template.bind({});

Default.args = {
  users: systemImplementationTestData.users,
};
