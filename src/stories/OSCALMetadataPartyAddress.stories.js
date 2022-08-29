import React from "react";
import { OSCALMetadataPartyAddress } from "../components/OSCALMetadata";

import { exampleParties } from "../test-data/CommonData";

export default {
  title: "Components/Metadata Party Address",
  component: OSCALMetadataPartyAddress,
};

function Template(args) {
  return <OSCALMetadataPartyAddress {...args} />;
}

export const Home = Template.bind({});

export const Work = Template.bind({});

export const Unknown = Template.bind({});

Home.args = {
  address: exampleParties[0].addresses[0],
};

Work.args = {
  address: exampleParties[0].addresses[1],
};

Unknown.args = {
  address: exampleParties[0].addresses[2],
};
