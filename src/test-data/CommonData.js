export const exampleParties = [
  {
    uuid: "party-1",
    type: "organization",
    name: "Some group of people",
  },
];

export const profileCatalogInheritanceData = {
  inherited: [
    {
      title: "Example Catalog",
      type: "catalog",
    },
    {
      title: "Example Inherited Profile",
      type: "profile",
      inherited: [
        {
          title: "Nested Inherited Catalog",
          type: "catalog",
        },
      ],
    },
  ],
};

export const metadataTestData = {
  title: "Test Title",
  parties: exampleParties,
  version: "Revision 5",
};

export const responsibleRolesTestData = [
  {
    "party-uuids": ["party-1"],
    "role-id": "provider",
  },
];

export const inventoryItemTestData = {
  uuid: "inventory-item",
  description: "An example set of inventory items.",
  props: [
    {
      name: "item-1",
      value: "An example item.",
      remarks: "This is an example item.",
    },
  ],
  "responsible-parties": [
    {
      "role-id": "provider",
      "party-uuids": ["party-1"],
    },
  ],
  "implemented-components": [
    {
      "component-uuid": "component-1",
      remarks: "This is an example component.",
    },
  ],
  remarks: "Additional information about this item.",
};

export const implementedComponentsRolesTestData = [
  {
    "component-uuid": "component-1",
    remarks: "An example component.",
  },
];
