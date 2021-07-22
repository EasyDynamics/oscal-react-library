import React from "react";
import OSCALMetadata from "../components/OSCALMetadata";
import {
  exampleMetadata,
  exampleMetadataParties,
  exampleMetadataRoles,
} from "../test-data/MetadataData";

export default {
  title: "Components/Metadata",
  component: OSCALMetadata,
};

const Template = (args) => <OSCALMetadata {...args} />;

export const Default = Template.bind({});

export const MetadataParties = Template.bind({});

export const MetadataRoles = Template.bind({});

Default.args = {
  metadata: exampleMetadata,
};

MetadataParties.args = {
  metadata: exampleMetadataParties,
};

MetadataRoles.args = {
  metadata: exampleMetadataRoles,
};
