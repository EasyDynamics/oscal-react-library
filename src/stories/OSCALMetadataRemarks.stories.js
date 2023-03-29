import React from "react";
import { OSCALMetadataRemarks } from "../components/OSCALMetadata";
import { metadataTestData } from "../test-data/CommonData";

export default {
  title: "Components/Metadata Remarks",
  component: OSCALMetadataRemarks,
};

function Template(args) {
  return <OSCALMetadataRemarks {...args} />;
}

export const Default = Template.bind({});

Default.args = {
  remarks: metadataTestData.remarks,
};
