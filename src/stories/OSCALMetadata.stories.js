import React from "react";
import OSCALMetadata from "../components/OSCALMetadata";

export default {
  title: "Components/Metadata",
  component: OSCALMetadata,
};

const Template = (args) => <OSCALMetadata {...args} />;

export const Default = Template.bind({});

export const MetadataParties = Template.bind({});

export const MetadataRoles = Template.bind({});

const exampleMetadata = {
  title: "Test Title",
  "last-modified": "7/12/2021",
  version: "Revision 5",
  "oscal-version": "1.0.0",
};

const exampleMetadataParties = {
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

const exampleMetadataRoles = {
  title: "Test Title",
  "last-modified": "7/12/2021",
  version: "Revision 5",
  "oscal-version": "1.0.0",
  roles: [
    {
      id: "creator",
      title: "Document creator",
    },
  ],
  parties: [
    {
      uuid: "party-1",
      type: "organization",
      name: "Some group of people",
    },
  ],
  "responsible-parties": [
    {
      "role-id": "creator",
      "party-uuids": ["party-1"],
    },
  ],
};

Default.args = {
  metadata: exampleMetadata,
};

MetadataParties.args = {
  metadata: exampleMetadataParties,
};

MetadataRoles.args = {
  metadata: exampleMetadataRoles,
};
