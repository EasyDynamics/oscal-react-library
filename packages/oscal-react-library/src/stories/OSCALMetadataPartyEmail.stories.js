import React from "react";
import { OSCALMetadataPartyEmail } from "../components/OSCALMetadata";

import { exampleParties } from "../test-data/CommonData";

export default {
  title: "Components/Metadata Party Email",
  component: OSCALMetadataPartyEmail,
};

function Template(args) {
  return <OSCALMetadataPartyEmail {...args} />;
}

export const Default = Template.bind({});

Default.args = {
  email: exampleParties[0]["email-addresses"][0],
};
