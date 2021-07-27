import React from "react";
import OSCALResponsibleRoles from "../components/OSCALResponsibleRoles";
import {
  exampleParties,
  responsibleRolesTestData,
} from "../test-data/CommonData";

export default {
  title: "Components/Responsible Roles",
  component: OSCALResponsibleRoles,
};

const Template = (args) => <OSCALResponsibleRoles {...args} />;

export const Default = Template.bind({});

Default.args = {
  responsibleRoles: responsibleRolesTestData,
  parties: exampleParties,
};
