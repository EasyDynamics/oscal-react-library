import { backMatterTestData } from "./BackMatterData";

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

export const responsibleRolesTestData = [
  {
    "party-uuids": ["party-1"],
    "role-id": "provider",
  },
];
