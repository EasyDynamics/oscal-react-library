import React from "react";
import OSCALPopover from "../components/OSCALPopover";
import { controlImplTestData } from "../test-data/ControlsData";

export default {
  title: "Components/Popover",
  component: OSCALPopover,
};

function Template(args) {
  return <OSCALPopover {...args} />;
}

export const Default = Template.bind({});

const implementedRequirement =
  controlImplTestData["implemented-requirements"][0];
const statement = implementedRequirement.statements[0];

Default.args = {
  anchorEl: true,
  controlId: implementedRequirement["control-id"],
  statementByComponent: statement["by-components"][0],
  statementId: statement["statement-id"],
};
