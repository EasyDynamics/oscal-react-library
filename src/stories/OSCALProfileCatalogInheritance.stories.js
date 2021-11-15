import React from "react";
import OSCALProfileCatalogInheritance from "../components/OSCALProfileCatalogInheritance";
import { profileCatalogInheritanceData } from "../test-data/CommonData";

export default {
  title: "Components/Profile and Catalog Inheritance Display",
  component: OSCALProfileCatalogInheritance,
};

const Template = (args) => <OSCALProfileCatalogInheritance {...args} />;

export const Default = Template.bind({});

Default.args = {
  inheritedProfilesAndCatalogs: profileCatalogInheritanceData,
};
