import React from "react";
import OSCALControlModification from "../components/OSCALControlModification";

export default {
  title: "Components/Control Modification",
  component: OSCALControlModification,
};

const Template = (args) => <OSCALControlModification {...args} />;

export const Default = Template.bind({});

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

Default.args = {
  modifications: exampleModifications,
  controlId: "control-1",
};
