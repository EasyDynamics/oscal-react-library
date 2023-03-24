import React from "react";
import { OSCALMetadataLocationContent } from "../components/OSCALMetadata";

import { exampleLocations } from "../test-data/CommonData";

export default {
  title: "Components/Metadata Location Content",
  component: OSCALMetadataLocationContent,
};

function Template(args) {
  return <OSCALMetadataLocationContent {...args} />;
}

export const Default = Template.bind({});

Default.args = {
  location: exampleLocations[0],
};
