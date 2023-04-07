import React from "react";
import { OSCALMetadataKeywords } from "../components/OSCALMetadata";

import { keywordValuesList } from "../test-data/CommonData";

export default {
  title: "Components/Metadata Keywords",
  component: OSCALMetadataKeywords,
};

function Template(args) {
  return <OSCALMetadataKeywords {...args} />;
}

export const Default = Template.bind({});

Default.args = {
  keywords: keywordValuesList.basic[0].value,
};
