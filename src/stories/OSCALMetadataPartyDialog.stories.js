import React from "react";
import { OSCALMetadataPartyDialog } from "../components/OSCALMetadata";

import { exampleParties } from "../test-data/CommonData";

export default {
  title: "Components/Metadata Party Dialog",
  component: OSCALMetadataPartyDialog,
};

function Template(args) {
  return <OSCALMetadataPartyDialog {...args} />;
}

export const Default = Template.bind({});

Default.args = {
  party: exampleParties[0],
};
