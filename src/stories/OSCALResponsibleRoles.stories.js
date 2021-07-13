import React from "react";
import OSCALResponsibleRoles from "../components/OSCALResponsibleRoles";

export default {
  title: "Components/Responsible Roles",
  component: OSCALResponsibleRoles,
};

const Template = (args) => <OSCALResponsibleRoles {...args} />;

export const Default = Template.bind({});

const exampleResponsibleRoles = [
  {
    "party-uuids": ["party-1"],
    "role-id": "provider",
  },
];

const exampleParties = [
  {
    uuid: "party-1",
    type: "organization",
    name: "Some group of people",
  },
];

Default.args = {
  responsibleRoles: exampleResponsibleRoles,
  parties: exampleParties,
};
