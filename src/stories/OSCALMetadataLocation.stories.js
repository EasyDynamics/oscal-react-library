import React from "react";
import { OSCALMetadataLocation } from "../components/OSCALMetadata";

import { exampleLocations } from "../test-data/CommonData";

export default {
  title: "Components/Metadata Location",
  component: OSCALMetadataLocation,
};

function Template(args) {
  return <OSCALMetadataLocation {...args} />;
}

export const Default = Template.bind({});

Default.args = {
  location: exampleLocations[0],
};
