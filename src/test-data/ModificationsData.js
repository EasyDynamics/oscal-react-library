const props = [
  {
    name: "Some prop name",
    value: "Some prop value",
  },
];

export const exampleModificationsAddsTwo = {
  alters: [
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
  ],
};

export const exampleModificationsTopLevel = {
  alters: [
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
  ],
};

export const exampleModificationsConstraints = {
  "set-parameters": [
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
  ],
};

export const exampleModificationsAddsThree = {
  alters: exampleModificationsAddsTwo.alters,
  "set-parameters": exampleModificationsConstraints["set-parameters"],
};
