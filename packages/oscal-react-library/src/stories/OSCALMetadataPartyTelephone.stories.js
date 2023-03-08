import React from "react";
import { OSCALMetadataPartyTelephone } from "../components/OSCALMetadata";

import { exampleParties } from "../test-data/CommonData";

export default {
  title: "Components/Metadata Party Telephone",
  component: OSCALMetadataPartyTelephone,
};

function Template(args) {
  return <OSCALMetadataPartyTelephone {...args} />;
}

export const Mobile = Template.bind({});

export const Office = Template.bind({});

export const Unknown = Template.bind({});

export const Home = Template.bind({});

Mobile.args = {
  telephone: exampleParties[0]["telephone-numbers"][0],
};

Office.args = {
  telephone: exampleParties[0]["telephone-numbers"][1],
};

Unknown.args = {
  telephone: exampleParties[0]["telephone-numbers"][2],
};

Home.args = {
  telephone: exampleParties[0]["telephone-numbers"][3],
};
