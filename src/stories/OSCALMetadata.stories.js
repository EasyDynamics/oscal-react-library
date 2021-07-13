import React from "react";
import OSCALMetadata from "../components/OSCALMetadata";

export default {
  title: "Components/Metadata",
  component: OSCALMetadata,
};

const Template = (args) => <OSCALMetadata {...args} />;

export const Default = Template.bind({});

const exampleMetadata = {
  title: "Test Title",
  "last-modified": "7/12/2021",
  version: "Revision 5",
  "oscal-version": "1.0.0",
  parties: [
    {
      uuid: "party-1",
      type: "organization",
      name: "Some group of people",
    },
  ],
};

Default.args = {
  metadata: exampleMetadata,
};
