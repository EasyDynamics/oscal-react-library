import { backMatterTestData } from "./BackMatterData";
import { rev4LowBaselineProfileJson } from "./Urls";

const adds = [
  {
    position: "starting",
    props: [
      {
        name: "priority",
        value: "P1",
      },
    ],
  },
];

export const controlProseTestData =
  "Does something with {{ insert: param, control-1_prm_1 }} and {{ insert: param, control-1_prm_2 }}";

export const exampleParams = [
  {
    id: "control-1_prm_1",
    label: "control 1 label",
  },
  {
    id: "control-1_prm_2",
    label: "control 2 label",
  },
];

export const exampleParties = [
  {
    uuid: "party-1",
    type: "organization",
    name: "Some group of people",
  },
];

export const metadataTestData = {
  title: "Test Title",
  parties: exampleParties,
  version: "Revision 5",
};

export const profileTestData = {
  uuid: "3afae418-b105-47ba-b51d-653a1a6b9267",
  metadata: metadataTestData,
  imports: [
    {
      href: "#dc380596-027f-423b-83f2-82757554ee27",
      "include-controls": [
        {
          "with-ids": ["ac-1", "ac-2", "ac-2.1"],
        },
      ],
    },
  ],
  modify: {
    "set-parameters": [
      {
        "param-id": "ac-1_prm_2",
        constraints: [
          {
            description: "at least every 3 years",
          },
        ],
      },
      {
        "param-id": "ac-1_prm_3",
        constraints: [
          {
            description: "at least annually",
          },
        ],
      },
    ],
    alters: [
      {
        "control-id": "ac-1",
        adds,
      },
      {
        "control-id": "ac-2",
        adds,
      },
    ],
  },
  "back-matter": backMatterTestData,
};

export const externalProfileTestData = {
  uuid: "0e15a0fe-fa2a-40e9-847d-53e8c13e60f0",
  metadata: {
    title: "NIST Special Publication 800-53 Revision 4 LOW IMPACT BASELINE",
    version: "2015-01-22",
    parties: [
      {
        uuid: "96310e12-f661-41a7-bed9-842b6a931875",
        type: "organization",
        name: "Joint Task Force, Transformation Initiative",
      },
    ],
  },
  imports: [
    {
      href: "#31dbc4f2-c0e6-4e85-9cf4-b5d4843a32e8",
      "include-controls": [
        {
          "with-ids": ["ca-1", "ca-2", "ca-3"],
        },
      ],
    },
  ],
  modify: {
    alters: [
      {
        "control-id": "ca-1",
        adds,
      },
      {
        "control-id": "ca-2",
        adds: [
          {
            position: "starting",
            props: [
              {
                name: "priority",
                value: "P2",
              },
            ],
          },
        ],
      },
      {
        "control-id": "ca-3",
        adds,
      },
    ],
  },
  "back-matter": {
    resources: [
      {
        uuid: "31dbc4f2-c0e6-4e85-9cf4-b5d4843a32e8",
        title: "External Back Matter Resource",
        description:
          "NIST Special Publication 800-53 Revision 4: Security and Privacy Controls for Federal Information Systems and Organizations",
        rlinks: [
          {
            href: rev4LowBaselineProfileJson,
            "media-type": "application/oscal.catalog+json",
          },
        ],
      },
    ],
  },
};

export const responsibleRolesTestData = [
  {
    "party-uuids": ["party-1"],
    "role-id": "provider",
  },
];
