import React from "react";
import { systemImplementationTestData, componentsTestData } from "../test-data/SystemData";
import { exampleParties } from "../test-data/CommonData";
import OSCALSystemImplementationInventoryItems from "../components/OSCALSystemImplementationInventoryItems";

export default {
  title: "Components/System Implementation Inventory Items",
  component: OSCALSystemImplementationInventoryItems,
};

function Template(args) {
  return <OSCALSystemImplementationInventoryItems {...args} />;
}

export const Default = Template.bind({});

Default.args = {
  inventoryItems: systemImplementationTestData["inventory-items"],
  parties: exampleParties,
  components: componentsTestData,
};
