import React from "react";
import OSCALControlPartEditor from "../components/OSCALControlPartEditor";
import { controlImplTestData } from "../test-data/ControlsData";

export default {
  title: "Components/Control Part Editor",
  component: OSCALControlPartEditor,
};

function Template(args) {
  return <OSCALControlPartEditor {...args} />;
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
