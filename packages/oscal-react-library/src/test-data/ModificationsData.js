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
  {
    "param-id": "control-1_prm_3",
    values: ["param 3 value"],
  },
];

export const exampleModificationSetParametersDecimal = [
  {
    "param-id": "control-1.1_prm_1",
    constraints: [
      {
        description: "some constraint",
      },
    ],
  },
  {
    "param-id": "control-1.1_prm_2",
    constraints: [
      {
        description: "another constraint",
      },
    ],
  },
  {
    "param-id": "control-1.1_prm_3",
    values: ["param 3 value"],
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

const exampleModificationAltersSmt = [
  {
    "control-id": "control-1",
    adds: [
      {
        "by-id": "control-1_smt",
        position: "starting",
        props,
      },
    ],
  },
];

export const profileModifyTestData = {
  "set-parameters": exampleModificationSetParameters,
  alters: exampleModificationAltersTopLevel,
};

export const profileModifyDecSmtTestData = {
  "set-parameters": exampleModificationSetParametersDecimal,
  alters: exampleModificationAltersTopLevel,
};

export const profileModifySmtTestData = {
  "set-parameters": exampleModificationSetParameters,
  alters: exampleModificationAltersSmt,
};
