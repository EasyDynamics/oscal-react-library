import { metadataTestData } from "./CommonData";
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
const removes = [
  {
    "by-id": "ac-1_smt.a",
  },
  {
    "by-id": "ac-1_smt.b",
  },
];

export default {
  uuid: "3afae418-b105-47ba-b51d-653a1a6b9267",
  metadata: metadataTestData,
  imports: [
    {
      href: "#dc380596-027f-423b-83f2-82757554ee27",
      "include-controls": [
        {
          "with-ids": ["ac-1", "ac-2", "ac-2.1", "ac-3"],
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
        removes,
      },
      {
        "control-id": "ac-2.1",
        removes,
      },
      {
        "control-id": "ac-2",
        removes: [
          {
            "by-id": "ac-2_smt.b",
          },
          {
            "by-id": "ac-2_smt.c",
          },
          {
            "by-name": "objective",
          },
          {
            "by-name": "assessment",
          },
        ],
        adds: [
          {
            position: "starting",
            props: [
              {
                name: "priority",
                value: "P1",
              },
            ],
          },
          {
            position: "before",
            "by-id": "ac-2_smt.a",
            title: "Improve Reporting",
            props: [
              {
                name: "latency",
                value: "hourly",
              },
            ],
          },
          {
            position: "after",
            "by-id": "ac-2_smt.g",
            title: "Reporting",
            props: [
              {
                name: "latency",
                value: "daily",
              },
            ],
          },
        ],
      },
      {
        "control-id": "ac-3",
        adds: [
          {
            position: "starting",
            props: [
              {
                name: "priority",
                value: "P1",
              },
            ],
          },
        ],
      },
    ],
  },
  "back-matter": backMatterTestData,
};

export const profileWithIncludeAll = {
  uuid: "3afae418-b105-47ba-b51d-653a1a6b9267",
  metadata: metadataTestData,
  imports: [
    {
      href: "#dc380596-027f-423b-83f2-82757554ee27",
      "include-all": {},
    },
  ],
};
export const profileWithIncludeAllAndExcludeAC3 = {
  uuid: "3afae418-b105-47ba-b51d-653a1a6b9267",
  metadata: metadataTestData,
  imports: [
    {
      href: "#dc380596-027f-423b-83f2-82757554ee27",
      "include-all": {},
      "exclude-controls": [
        {
          "with-ids": ["ac-3"],
        },
      ],
    },
  ],
};
