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

export const exampleControl = {
  id: "control-1",
  title: "Control 1 Title",
  params: [
    {
      id: "control-1_prm_1",
      label: "control 1 / parameter 1 label",
    },
    {
      id: "control-1_prm_2",
      label: "control 1 / parameter 2 label",
    },
  ],
  parts: [
    {
      id: "control-1_smt",
      name: "statement",
      prose: "Some organizational group:",
      parts: [
        {
          id: "control-1_smt.a",
          name: "item",
          props: [
            {
              name: "label",
              value: "a.",
            },
          ],
          prose:
            "Does something with {{ insert: param, control-1_prm_1 }} and {{ insert: param, control-1_prm_2 }}",
        },
      ],
    },
  ],
};

export const controlsData = [
  {
    id: exampleControl.id,
    title: exampleControl.title,
    params: exampleControl.params,
    parts: exampleControl.parts,
    controls: [
      {
        id: "control-1.1",
        title: "Control 1 Enhancement",
      },
    ],
    props: [
      {
        name: "label",
        value: "control-1",
      },
    ],
  },
  {
    id: "control-2",
    title: "Control 2 Title",
    params: [
      {
        id: "control-2_prm_1",
        label: "control 2 / parameter 1 label",
      },
      {
        id: "control-2_prm_2",
        label: "control 1 / parameter 2 label",
      },
    ],
    parts: [
      {
        id: "control-2_smt",
        name: "statement",
        prose: "Some organizational group:",
        parts: [
          {
            id: "control-2_smt.a",
            name: "item",
            props: [
              {
                name: "label",
                value: "b.",
              },
            ],
            prose:
              "Does something with {{ insert: param, control-2_prm_1 }} and {{ insert: param, control-2_prm_2 }}:",
          },
        ],
      },
    ],
    controls: [
      {
        id: "control-2.1",
        title: "Control 2 Enhancement",
      },
    ],
    props: [
      {
        name: "label",
        value: "control-2",
      },
    ],
  },
];

export const controlImplTestData = {
  description: "This is the control implementation for the system.",
  "implemented-requirements": [
    {
      uuid: "implemented-requirements-1",
      "control-id": "control-1",
      statements: [
        {
          "statement-id": "control-1_smt.a",
          uuid: "f3887a91-9ed3-425c-b305-21e4634a1c34",
          "by-components": [
            {
              "component-uuid": "component-1",
              uuid: "a74681b2-fbcb-46eb-90fd-0d55aa74ac7b",
              description: "Component 1 description of implementing control 1",
              "set-parameters": [
                {
                  "param-id": "control-1_prm_1",
                  values: ["control 1 / component 1 / parameter 1 value"],
                },
                {
                  "param-id": "control-1_prm_2",
                  values: ["control 1 / component 1 / parameter 2 value"],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};

export const controlProseTestData =
  "Does something with {{ insert: param, control-1_prm_1 }} and {{ insert: param, control-1_prm_2 }}";

export const exampleImplNoStatements = {
  description: "This is the control implementation for the system.",
  "implemented-requirements": [
    {
      uuid: "implemented-requirements-1",
      "control-id": "control-1",
      statements: [],
    },
  ],
};

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
