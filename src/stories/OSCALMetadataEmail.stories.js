import React from "react";
import { OSCALMetadataEmail } from "../components/OSCALMetadata";

import { exampleParties } from "../test-data/CommonData";

export default {
  title: "Components/Metadata Party Email",
  component: OSCALMetadataEmail,
};

function Template(args) {
  return <OSCALMetadataEmail {...args} />;
}

export const Default = Template.bind({});

Default.args = {
  email: exampleParties[0]["email-addresses"][0],
};
