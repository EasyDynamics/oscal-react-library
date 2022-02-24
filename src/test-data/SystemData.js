import { metadataTestData, responsibleRolesTestData } from "./CommonData";
import {
  systemCharacteristicsDescriptionUrl,
  systemCharacteristicsInformationUrl,
} from "./Urls";

const title = "Example Component";
const description = "An example component.";
const status = {
  state: "operational",
};
const type = "software";
const inventoryItems = [
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
];

const remarks = "Example system implementation remarks.";

const users = {
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
};

export const systemImplementationTestData = {
  remarks,
  users,
  components: {
    "component-1": {
      title,
      description,
      status,
      type,
      props: [
        {
          name: "version",
          value: "1.1",
        },
      ],
      "responsible-roles": responsibleRolesTestData,
    },
  },
  "inventory-items": inventoryItems,
};

export const exampleSystemImplementation = {
  remarks,
  users,
  components: {
    "component-1": {
      title,
      description,
      status,
      type,
      props: [
        {
          name: "version",
          value: "1.1",
        },
        {
          name: "last-modified-date",
          value: "20210712",
        },
      ],
      "responsible-roles": responsibleRolesTestData,
    },
  },
  "inventory-items": inventoryItems,
};

export const systemCharacteristicsTestData = {
  "system-name": "Example System Name",
  description: "This is an example of a system.",
  "system-ids": [
    {
      id: "system-id",
      "identifier-type": systemCharacteristicsDescriptionUrl,
    },
  ],
  "security-sensitivity-level": "moderate",
  "system-information": {
    "information-types": [
      {
        uuid: "information-type-id",
        title: "Information Type Title",
        categorizations: [
          {
            system: systemCharacteristicsInformationUrl,
            "information-type-ids": ["C.3.5.8"],
          },
        ],
        description: "Example information type.",
        "confidentiality-impact": {
          base: "fips-199-moderate",
        },
        "integrity-impact": {
          base: "fips-199-moderate",
        },
        "availability-impact": {
          base: "fips-199-low",
        },
      },
    ],
  },
  "security-impact-level": {
    "security-objective-confidentiality": "confidentiality-value",
    "security-objective-integrity": "integrity-value",
    "security-objective-availability": "availability-value",
  },
  status: {
    state: "other",
    remarks:
      "This is an example, and is not intended to be implemented as a system",
  },
  props: [
    {
      name: "deployment-model",
      value: "private",
    },
    {
      name: "service-models",
      value: "iaas",
    },
  ],
  "authorization-boundary": {
    description: "The description of the authorization boundary would go here.",
  },
};

export const sspTestData = {
  uuid: "66c2a1c8-5830-48bd-8fdd-55a1c3a52888",
  metadata: metadataTestData,
  "system-characteristics": systemCharacteristicsTestData,
  "system-implementation": systemImplementationTestData,
};

export const sspPatchData = {
  "system-security-plan": {
    uuid: "12345678-9012-3456-7890-123456789012",
  },
};
