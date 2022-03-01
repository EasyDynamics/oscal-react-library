import React from "react";
import OSCALProfileCatalogInheritance from "../components/OSCALProfileCatalogInheritance";
import { profileCatalogInheritanceData } from "../test-data/CommonData";

export default {
  title: "Components/Profile and Catalog Inheritance Display",
  component: OSCALProfileCatalogInheritance,
};

function Template(args) {
  return <OSCALProfileCatalogInheritance {...args} />;
}

export const Default = Template.bind({});

Default.args = {
  inheritedProfilesAndCatalogs: profileCatalogInheritanceData,
};
