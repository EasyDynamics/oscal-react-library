import React from "react";
import { render, screen } from "@testing-library/react";
import OSCALInventoryItems from "./OSCALInventoryItems";
import { exampleComponents } from "../test-data/ComponentsData";
import { exampleParties, inventoryItemsTestData } from "../test-data/CommonData";

function inventoryItemsRenderer() {
  render(
    <OSCALInventoryItems
      inventoryItems={inventoryItemsTestData}
      parties={exampleParties}
      components={exampleComponents}
    />
  );
}

export default function testOSCALInventoryItems(parentElementName, renderer) {
  test(`${parentElementName} shows description`, () => {
    renderer();
    const result = screen.getByText("An example set of inventory items.");
    expect(result).toBeVisible();
  });

  test(`${parentElementName} shows remarks`, () => {
    renderer();
    const result = screen.getByText("Additional information about this item.");
    expect(result).toBeVisible();
  });

  test(`${parentElementName} shows prop item`, async () => {
    renderer();
    const result = screen.getByText("An example item.");
    expect(result).toBeVisible();
  });

  test(`${parentElementName} shows parties`, () => {
    renderer();
    const result = screen.getByText("Some group of people");
    expect(result).toBeVisible();
  });

  test(`${parentElementName} shows implemented components`, () => {
    renderer();
    const result = screen.getByText("Component 1 Title");
    expect(result).toBeVisible();
  });
}

if (!require.main) {
  testOSCALInventoryItems("OSCALInventoryItems", inventoryItemsRenderer);
}
