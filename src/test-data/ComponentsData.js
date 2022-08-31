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
  components: [
    {
      uuid: "component-1",
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

export const componentsDecimalTestData = [
  {
    uuid: "component-1.1",
    title: "Component 1.1 Title",
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
