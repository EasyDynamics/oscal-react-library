import React from "react";
import OSCALControlModification from "../components/OSCALControlModification";
import { exampleModificationsAddsTwo } from "../test-data/ModificationsData";

export default {
  title: "Components/Control Modification",
  component: OSCALControlModification,
};

const Template = (args) => <OSCALControlModification {...args} />;

export const Default = Template.bind({});

Default.args = {
  modifications: exampleModificationsAddsTwo,
  controlId: "control-1",
  controlPartId: "control-1_smt.a",
};
