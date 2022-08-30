import React, { render, screen, within } from "@testing-library/react";
import { responsiblePartiesTestData } from "../test-data/CommonData";
import {
  inventoryItemsTestData,
  componentsTestData,
} from "../test-data/SystemData";
import OSCALAssessmentImplementationInventoryItems from "./OSCALAssessmentImplementationInventoryItems";

describe("OSCALAssessmentImplementationInventoryItems", () => {
  beforeEach(() => {
    render(
      <OSCALAssessmentImplementationInventoryItems
        inventoryItems={inventoryItemsTestData}
        parties={responsiblePartiesTestData}
        components={componentsTestData}
      />
    );
  });

  test(`shows description`, () => {
    const result = screen.getByText("An example set of inventory items.");
    expect(result).toBeVisible();
  });

  test(`shows remarks`, () => {
    const result = screen.getByText("Additional information about this item.");
    expect(result).toBeVisible();
  });

  test(`shows prop item name`, async () => {
    const result = screen.getByText("item-1");
    expect(result).toBeVisible();
  });

  test(`shows prop item value`, async () => {
    const result = screen.getByText("An example item.");
    expect(result).toBeVisible();
  });

  test(`shows parties`, () => {
    const result = screen.getByText("provider");
    expect(result).toBeVisible();
  });

  test(`shows implemented components name`, () => {
    const result = screen.getByText("Example Component");
    expect(result).toBeVisible();
  });

  test(`shows implemented component type`, () => {
    const component = screen.getByText("Example Component").closest("tr");
    const result = within(component).getByText("software");
    expect(result).toBeVisible();
  });
});
