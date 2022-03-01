import React from "react";
import OSCALControlModification from "../components/OSCALControlModification";
import { exampleModificationAlters } from "../test-data/ModificationsData";

export default {
  title: "Components/Control Modification",
  component: OSCALControlModification,
};

function Template(args) {
  return <OSCALControlModification {...args} />;
}

export const Default = Template.bind({});

Default.args = {
  modificationAlters: exampleModificationAlters,
  controlId: "control-1",
  controlPartId: "control-1_smt.a",
};
