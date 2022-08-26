import React from "react";
import { render, screen } from "@testing-library/react";
import OSCALInventoryItem from "./OSCALInventoryItem";
import { exampleComponents } from "../test-data/ComponentsData";
import {
  exampleParties,
  inventoryItemTestData,
} from "../test-data/CommonData";

function inventoryItemRenderer() {
  render(
    <OSCALInventoryItem
      inventoryItem={inventoryItemTestData}
      parties={exampleParties}
      components={exampleComponents}
    />
  );
}

export default function testOSCALInventoryItem(
  parentElementName,
  renderer
) {
  test(`${parentElementName} shows description`, () => {
    renderer();
    const result = screen.getByLabelText("An example set of inventory items.");
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
  testOSCALInventoryItem(
    "OSCALSystemImplementation",
    inventoryItemRenderer
  );
}
