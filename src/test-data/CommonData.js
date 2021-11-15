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
      type: "catalog"
    },
    {
      title: "Example Inherited Profile",
      type: "profile",
      inherited: [
        {
          title: "Nested Inherited Catalog",
          type: "catalog"
        },
      ]
    }
  ]
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
