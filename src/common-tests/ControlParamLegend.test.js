import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import OSCALCatalogGroup from "../components/OSCALCatalogGroup";

const testCatalogGroup = {
  id: "parent-group",
  class: "family",
  title: "Parent Group",
  groups: [
    {
      id: "ac",
      class: "family",
      title: "Access Control",
      controls: [{ id: "ac-1" }],
    },
  ],
};

export default function testOSCALControlParamLegend(parentElementName, group) {
  test(`${parentElementName} shows component title`, () => {
    render(group);
    if (group.type === (<OSCALCatalogGroup />).type) {
      const parentGroup = screen.getByText("Parent Group");
      fireEvent.click(parentGroup);
    }
    const placeholderBox = screen.getByLabelText("legend-placeholder-label");
    expect(placeholderBox).toBeVisible();
    const placeholderBoxLabel = screen.getByText("Placeholder");
    expect(placeholderBoxLabel).toBeVisible();
    const valueBox = screen.getByLabelText("legend-value-label");
    expect(valueBox).toBeVisible();
    const valueBoxLabel = screen.getByText("Value");
    expect(valueBoxLabel).toBeVisible();
  });
}

testOSCALControlParamLegend(
  "Simple OSCALCatalogGroup",
  <OSCALCatalogGroup group={testCatalogGroup} />
);
