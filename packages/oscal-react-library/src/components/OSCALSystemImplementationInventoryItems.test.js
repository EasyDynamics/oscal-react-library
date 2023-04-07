import React from "react";
import { render, screen, within } from "@testing-library/react";
import { responsiblePartiesTestData } from "../test-data/CommonData";
import {
  inventoryItemsTestData,
  componentsTestData,
} from "../test-data/SystemData";
import OSCALSystemImplementationInventoryItems from "./OSCALSystemImplementationInventoryItems";

const setup = () => {
  render(
    <OSCALSystemImplementationInventoryItems
      inventoryItems={inventoryItemsTestData}
      parties={responsiblePartiesTestData}
      components={componentsTestData}
    />
  );
};

describe("OSCALSystemImplementationInventoryItems", () => {
  test(`shows description`, () => {
    setup();
    const result = screen.getByText("An example inventory item.");
    expect(result).toBeVisible();
  });

  test(`shows remarks`, () => {
    setup();
    const result = screen.getByText("Additional information about this item.");
    expect(result).toBeVisible();
  });

  test(`shows prop name`, async () => {
    setup();
    const result = screen.getByText("prop-1");
    expect(result).toBeVisible();
  });

  test(`shows prop value`, async () => {
    setup();
    const result = screen.getByText("An example property.");
    expect(result).toBeVisible();
  });

  test(`shows parties`, () => {
    setup();
    const result = screen.getByText("provider");
    expect(result).toBeVisible();
  });

  test(`shows implemented components name`, () => {
    setup();
    const result = screen.getByText("Example Component");
    expect(result).toBeVisible();
  });

  test(`shows implemented component type`, () => {
    setup();

    // Grab example party row beneath heading row
    const exampleResponsiblePartiesRow = screen.getAllByRole("row")[1];

    const component = within(exampleResponsiblePartiesRow).getByText(
      "Example Component"
    );
    expect(component).toBeVisible();

    const propNameResult = within(exampleResponsiblePartiesRow).getByText(
      "software"
    );
    expect(propNameResult).toBeVisible();
  });
});
