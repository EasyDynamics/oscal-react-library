import React from "react";
import OSCALComponentDefinitionComponent from "../components/OSCALComponentDefinitionComponent";

export default {
  title: "Components/Component Definition Component",
  component: OSCALComponentDefinitionComponent,
};

const Template = (args) => <OSCALComponentDefinitionComponent {...args} />;

export const Default = Template.bind({});

const exampleComponentDefinitionComponent = {
  uuid: "b036a6ac-6cff-4066-92bc-74ddfd9ad6fa",
  type: "software",
  title: "test component 1",
  description:
    "This is a software component that implements basic authentication mechanisms.",
  "responsible-roles": [
    {
      "role-id": "supplier",
      "party-uuids": ["party-1"],
    },
  ],
};

const exampleParties = [
  {
    uuid: "party-1",
    type: "organization",
    name: "Some group of people",
  },
];

Default.args = {
  component: exampleComponentDefinitionComponent,
  parties: exampleParties,
};
