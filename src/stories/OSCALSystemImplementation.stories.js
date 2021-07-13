import React from "react";
import OSCALSystemImplementation from "../components/OSCALSystemImplementation";
import { responsibleRolesTestData } from "../components/OSCALResponsibleRoles.test";

export default {
  title: "Components/System Implementation",
  component: OSCALSystemImplementation,
};

const Template = (args) => <OSCALSystemImplementation {...args} />;

export const Default = Template.bind({});

const exampleSystemImplementation = {
  remarks: "Example system implementation remarks.",
  users: {
    "user-1": {
      title: "User 1",
      "role-ids": ["asset-administrator"],
      annotations: [
        {
          name: "type",
          value: "internal",
        },
      ],
    },
  },
  components: {
    "component-1": {
      title: "Example Component",
      description: "An example component.",
      status: {
        state: "operational",
      },
      type: "software",
      props: [
        {
          name: "version",
          value: "1.1",
        },
      ],
      "responsible-roles": responsibleRolesTestData,
    },
  },
  "inventory-items": [
    {
      uuid: "inventory-item-1",
      description: "An inventory item.",
      props: [
        {
          name: "asset-id",
          value: "asset-id-inventory-item",
        },
      ],
      "responsible-parties": {
        "asset-administrator": {
          "party-uuids": ["party-1"],
        },
      },
      "implemented-components": [
        {
          "component-uuid": "component-1",
        },
      ],
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
  systemImplementation: exampleSystemImplementation,
  parties: exampleParties,
};
