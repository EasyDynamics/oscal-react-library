export const exampleModificationsAddsTwo = {
  alters: [
    {
      "control-id": "control-1",
      adds: [
        {
          "by-id": "control-1_smt.a",
          position: "starting",
          props: [
            {
              name: "Name",
              value: "Value",
            },
          ],
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
