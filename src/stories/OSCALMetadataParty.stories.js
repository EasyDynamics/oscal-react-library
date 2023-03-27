import React from "react";
import { OSCALMetadataParty } from "../components/OSCALMetadata";

import { exampleParties } from "../test-data/CommonData";

export default {
  title: "Components/Metadata Party",
  component: OSCALMetadataParty,
};

function Template(args) {
  return <OSCALMetadataParty {...args} />;
}

export const Default = Template.bind({});

Default.args = {
  party: exampleParties[0],
  partyRolesText: ["Example party role text"],
};
