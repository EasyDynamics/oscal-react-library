import {
  Location,
  PartyOrganizationOrPerson,
  PartyType,
  PublicationMetadata,
  RevisionHistoryEntry,
  Role,
} from "@easydynamics/oscal-types";

export const exampleParties: PartyOrganizationOrPerson[] = [
  {
    uuid: "party-1",
    type: PartyType.ORGANIZATION,
    name: "Some group of people",
    "email-addresses": ["owners@email.org"],
    "telephone-numbers": [
      {
        type: "mobile",
        number: "+18005555555",
      },
      {
        type: "office",
        number: "+18004444444",
      },
      {
        number: "+18006666666",
      },
      {
        type: "home",
        number: "+18007777777",
      },
    ],
    addresses: [
      {
        type: "work",
        "addr-lines": ["0000 St", "Suite 3"],
        city: "City",
        state: "State",
        "postal-code": "0000",
        country: "US",
      },
      {
        type: "home",
        "addr-lines": ["1111 Road St"],
        city: "City",
        state: "State",
        "postal-code": "0000",
        country: "US",
      },
      {
        "addr-lines": ["2222 St"],
        city: "City",
        state: "State",
        "postal-code": "0000",
        country: "US",
      },
    ],
  },
];

export const exampleRoles: Role[] = [
  {
    id: "creator",
    title: "Document creator",
    description: "Creates documents",
  },
  {
    id: "contact",
    title: "Contact",
  },
];

export const exampleLocations: Location[] = [
  {
    uuid: "54e8923b-56d2-46f1-bb97-9c6f734d9d9e",
    title: "Example Location",
    address: {
      type: "work",
      "addr-lines": ["0000 St", "Suite 3"],
      city: "City",
      state: "State",
      "postal-code": "0000",
      country: "US",
    },
    "email-addresses": ["owners@email.org"],
    "telephone-numbers": [
      {
        type: "office",
        number: "+18004444444",
      },
    ],
    urls: ["https://www.website.com/"],
    links: [
      {
        href: "https://www.website.com/",
        text: "Website",
      },
    ],
    remarks: "Test remarks",
  },
  {
    uuid: "6c01ae87-5410-41af-87cd-3253dd7ccfc7",
    address: {},
  },
];

export const profileCatalogInheritanceData = {
  inherited: [
    {
      title: "Example Catalog",
      type: "catalog",
      uuid: "0988f548-8ece-41b8-b098-dc340e02c344",
    },
    {
      title: "Example Inherited Profile",
      type: "profile",
      uuid: "8f204564-3e62-406b-a138-03888c6bcd08",
      inherited: [
        {
          title: "Nested Inherited Catalog",
          type: "catalog",
          uuid: "09dc20e1-85a2-4a06-9f82-1eee6104e12f",
        },
      ],
    },
  ],
};

export const keywordValuesList = {
  basic: [
    {
      name: "keywords",
      value: "Keyword_1, Keyword_2,Keyword_3",
    },
  ],
  emptyProps: [],
  emptyValue: [
    {
      name: "keywords",
      value: "",
    },
  ],
  oneKeyWord: [
    {
      name: "keywords",
      value: "Keyword_1",
    },
  ],
  setns: [
    {
      name: "keywords",
      value: "Keyword_1",
      ns: "https://test.easydynamics.com/ns/oscal",
    },
  ],
};

export const exampleRevisions: RevisionHistoryEntry[] = [
  {
    version: "V1",
    title: "Title1",
    published: new Date("2023-05-19T13:50:25+00:00"),
    "last-modified": new Date("2023-04-19T13:50:25+00:00"),
    "oscal-version": "1.0.4",
  },
  {
    version: "V2",
    title: "Title2",
    published: new Date("2024-05-19T13:50:25+00:00"),
    "last-modified": new Date("2024-04-19T13:50:25+00:00"),
    "oscal-version": "1.0.3",
  },
];

export const metadataTestData: PublicationMetadata = {
  title: "Test Title",
  parties: exampleParties,
  roles: exampleRoles,
  locations: exampleLocations,
  version: "Revision 5",
  remarks: "This is test data",
  "last-modified": new Date("2019-09-28T23:20:50.52Z"),
  "oscal-version": "1.0.4",
};

export const responsibleRolesTestData = [
  {
    "party-uuids": ["party-1"],
    "role-id": "provider",
  },
];

export const responsiblePartiesTestData = [
  {
    "party-uuids": ["party-1"],
    "role-id": "provider",
  },
];

export const implementedComponentsRolesTestData = [
  {
    "component-uuid": "component-1",
    remarks: "An example component.",
  },
];
