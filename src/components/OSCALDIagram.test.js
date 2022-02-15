import React from "react";
import { render, screen } from "@testing-library/react";
import OSCALDiagram from "./OSCALDiagram";
import { backMatterTestData } from "../test-data/BackMatterData";
import diagramTestData from "../test-data/DiagramData";

function diagramRenderer() {
  render(
    <OSCALDiagram
      diagram={diagramTestData}
      backMatter={backMatterTestData}
      parentUrl="./"
    />
  );
}

export default function testOSCALDiagram(parentElementName, renderer) {
  test(`${parentElementName} displays diagram`, () => {
    renderer();
    const result = screen.getByAltText("Authorization Boundary Diagram");
    expect(result).toBeVisible();
    expect(result).toHaveAttribute("src", ".//../diagram.png");
  });
}

if (!require.main) {
  testOSCALDiagram("OSCALDiagram", diagramRenderer);
}
