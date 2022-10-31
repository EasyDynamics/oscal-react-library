import React from "react";
import { render, screen } from "@testing-library/react";
import OSCALDiagram from "./OSCALDiagram";
import { backMatterTestData } from "../test-data/BackMatterData";
import {
  localReferenceDiagram,
  uriReferenceDiagram,
} from "../test-data/DiagramData";

function diagramRenderer(testData) {
  render(
    <OSCALDiagram
      diagram={testData}
      backMatter={backMatterTestData}
      parentUrl="https://example.com"
    />
  );
}

export default function testOSCALDiagram(
  parentElementName,
  renderer,
  testData,
  expectedSrc
) {
  test(`${parentElementName} displays diagram`, () => {
    renderer(testData);
    const result = screen.getByAltText("Authorization Boundary Diagram");
    expect(result).toBeVisible();
    expect(result).toHaveAttribute("src", expectedSrc);
  });
}

if (!require.main) {
  testOSCALDiagram(
    "OSCALDiagram",
    diagramRenderer,
    localReferenceDiagram,
    "https://example.com/diagram.png"
  );
  testOSCALDiagram(
    "OSCALDiagram",
    diagramRenderer,
    uriReferenceDiagram,
    uriReferenceDiagram.links[0].href
  );
}
