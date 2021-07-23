import { metadataTestData, responsibleRolesTestData } from "./CommonData";
import { fedRampHighBaselineUrl, revFourCatalog } from "./Urls";

export const exampleByComponents = [
  {
    "component-uuid": "component-1",
    "set-parameters": [
      {
        "param-id": "control-1_prm_1",
        values: ["param 1 value"],
      },
      {
        "param-id": "control-1_prm_2",
        values: ["param 2 value"],
      },
    ],
  },
];

export const exampleImplReqStatements = [
  {
    "statement-id": "a_smt",
    "by-components": exampleByComponents,
  },
];

export const exampleComponents = [
  {
    uuid: "component-1",
    title: "Component 1 Title",
  },
];

export const componentDefinitionControlImplementationTestData = [
  {
    uuid: "control-implementation-1",
    source: revFourCatalog,
    description: "This is an example description for control implementation-1",
    "implemented-requirements": [
      {
        uuid: "implemented-requirements-1",
        description: "Component 1 description of implementing control 1",
        "control-id": "control-1",
      },
    ],
  },
  {
    uuid: "control-implementation-2",
    source: fedRampHighBaselineUrl,
    description: "This is an example description for control implementation-2",
    "implemented-requirements": [
      {
        uuid: "implemented-requirements-2",
        description: "Component 2 description of implementing control 2",
        "control-id": "control-2.1",
      },
    ],
  },
];

export const componentDefinitionTestData = {
  uuid: "aabcfa61-c6eb-4979-851f-35b461f6a0ef",
  metadata: metadataTestData,
  components: {
    "component-1": {
      type: "Example Type",
      title: "Example Component",
      description: "An example component.",
      "responsible-roles": responsibleRolesTestData,
      "control-implementations": [
        {
          uuid: "control-implementation-1",
          source: revFourCatalog,
          description:
            "This is an example description for control implementations",
          "implemented-requirements": [
            {
              uuid: "implemented-requirements-1",
              description: "Component 1 description of implementing control 1",
              "control-id": "example-1",
            },
          ],
        },
      ],
    },
  },
};

export const externalComponentDefinitionTestData = {
  uuid: "8223d65f-57a9-4689-8f06-2a975ae2ad72",
  metadata: {
    title: "Test Component Definition",
    version: "External Component Definition",
    parties: [
      {
        uuid: "ee47836c-877c-4007-bbf3-c9d9bd805a9a",
        name: "Test Vendor External Component",
        type: "organization",
      },
    ],
  },
  components: [
    {
      uuid: "b036a6ac-6cff-4066-92bc-74ddfd9ad6fa",
      type: "software",
      title: "test component 1",
      description:
        "This is a software component that implements basic authentication mechanisms.",
      "responsible-roles": [
        {
          "role-id": "supplier",
          "party-uuids": ["ee47836c-877c-4007-bbf3-c9d9bd805a9a"],
        },
      ],
      "control-implementations": [
        {
          uuid: "cfcdd674-8595-4f98-a9d1-3ac70825c49f",
          source:
            "../../../nist.gov/SP800-53/rev4/json/NIST_SP-800-53_rev4_catalog.json",
          description:
            "This is a partial implementation of the SP 800-53 rev4 catalog, focusing on the control enhancement AC-2 (3).",
          "implemented-requirements": [
            {
              uuid: "d1016df0-9b5c-4839-86cd-f9c1d113077b",
              description:
                "Inactive accounts are automatically disabled based on the duration specified by the duration parameter. Disabled accounts are expected to be reviewed and removed when appropriate.",
              "control-id": "ac-2.3",
            },
          ],
        },
      ],
    },
  ],
};

export const exampleComponentStories = [
  {
    uuid: "b036a6ac-6cff-4066-92bc-74ddfd9ad6fa",
    type: "software",
    title: "test component 1",
    description:
      "This is a software component that implements basic authentication mechanisms.",
    "responsible-roles": [
      {
        "role-id": "supplier",
        "party-uuids": ["ee47836c-877c-4007-bbf3-c9d9bd805a9a"],
      },
    ],
  },
];

export const componentsTestData = [
  {
    uuid: "component-1",
    title: "Component 1 Title",
  },
];

export const exampleComponentDefinitionComponent = {
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
