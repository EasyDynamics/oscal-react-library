import React from "react";
import { OSCALMetadataKeyword } from "../components/OSCALMetadata";

import { keywordValuesList } from "../test-data/CommonData";

export default {
  title: "Components/Metadata Keyword",
  component: OSCALMetadataKeyword,
};

function Template(args) {
  return <OSCALMetadataKeyword {...args} />;
}

export const Default = Template.bind({});

Default.args = {
  keyword: keywordValuesList.oneKeyWord[0].value,
};
