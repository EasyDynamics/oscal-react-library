const props = [
  {
    name: "Some prop name",
    value: "Some prop value",
  },
];

export const exampleModificationSetParameters = [
  {
    "param-id": "control-1_prm_1",
    constraints: [
      {
        description: "some constraint",
      },
    ],
  },
  {
    "param-id": "control-1_prm_2",
    constraints: [
      {
        description: "another constraint",
      },
    ],
  },
];

export const exampleModificationAlters = [
  {
    "control-id": "control-1",
    adds: [
      {
        "by-id": "control-1_smt.a",
        position: "starting",
        props,
      },
    ],
  },
];

export const exampleModificationAltersTopLevel = [
  {
    "control-id": "control-1",
    adds: [
      {
        "by-id": "control-1",
        position: "starting",
        props,
      },
    ],
  },
];

export const profileModifyTestData = {
  "set-parameters": [
    {
      "param-id": "control-1_prm_1",
      constraints: [
        {
          description: "at least every 3 years",
        },
      ],
    },
    {
      "param-id": "control-1_prm_2",
      constraints: [
        {
          description: "at least annually",
        },
      ],
    },
  ],
  alters: [
    {
      "control-id": "control-1",
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
};
