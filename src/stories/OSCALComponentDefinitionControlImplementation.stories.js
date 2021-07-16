import React from "react";
import OSCALComponentDefinitionControlImplementation from "../components/OSCALComponentDefinitionControlImplementation";

export default {
  title: "Components/Component Definition Control Implementation",
  component: OSCALComponentDefinitionControlImplementation,
};

const Template = (args) => (
  <OSCALComponentDefinitionControlImplementation {...args} />
);

export const Default = Template.bind({});

const exampleComponentDefinitionControlImplementation = [
  {
    uuid: "control-implementation-1",
    source:
      "https://raw.githubusercontent.com/usnistgov/oscal-content/master/nist.gov/SP800-53/rev4/json/NIST_SP-800-53_rev4_catalog.json",
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
    source:
      "https://raw.githubusercontent.com/usnistgov/oscal-content/master/fedramp.gov/json/FedRAMP_HIGH-baseline_profile.json",
    description: "This is an example description for control implementation-2",
    "implemented-requirements": [
      {
        uuid: "implemented-requirements-2",
        description: "Component 2 description of implementing control 2",
        "control-id": "control-2",
      },
    ],
  },
];

const exampleControls = [
  {
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
              "Does something with {{ insert: param, control-1_prm_1 }} and {{ insert: param, control-1_prm_2 }}:",
          },
        ],
      },
    ],
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

const exampleComponent = [
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

Default.args = {
  controlImplementations: exampleComponentDefinitionControlImplementation,
  components: exampleComponent,
  controls: exampleControls,
};
