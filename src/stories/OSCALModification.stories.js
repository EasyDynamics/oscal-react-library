import React from "react";
import OSCALControlModification from "../components/OSCALControlModification";

export default {
  title: "Control Modification",
  component: OSCALControlModification,
};

const Template = (args) => <OSCALControlModification {...args} />;

export const Example = Template.bind({});

const exampleModifications = {
  alters: [
    {
      "control-id": "control-1",
      adds: [
        {
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

Example.args = {
  modifications: exampleModifications,
  controlId: "control-1",
};
