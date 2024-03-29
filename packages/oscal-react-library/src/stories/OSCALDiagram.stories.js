import React from "react";
import OSCALDiagram from "../components/OSCALDiagram";
import { backMatterTestData } from "../test-data/BackMatterData";
import { localReferenceDiagram } from "../test-data/DiagramData";

export default {
  title: "Components/Diagram",
  component: OSCALDiagram,
};

function Template(args) {
  return <OSCALDiagram {...args} />;
}

export const Default = Template.bind({});

Default.args = {
  diagram: localReferenceDiagram,
  backMatter: backMatterTestData,
  parentUrl: "./",
};
