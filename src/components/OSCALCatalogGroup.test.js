import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import OSCALCatalogGroup from "./OSCALCatalogGroup";

test("OSCALCatalog displays control groups", () => {
  const testGroup = {
    id: "ac",
    class: "family",
    title: "Access Control",
    controls: [{ id: "ac-1" }],
  };
  render(<OSCALCatalogGroup group={testGroup} />);
  const result = screen.getByText("Access Control");
  expect(result).toBeVisible();
});

test("OSCALCatalog displays nested control groups", () => {
  const testGroup = {
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
  render(<OSCALCatalogGroup group={testGroup} />);
  const parentGroup = screen.getByText("Parent Group");
  fireEvent.click(parentGroup);
  const childGroup = screen.getByText("Access Control");
  fireEvent.click(childGroup);
  const control = screen.getByText("ac-1");
  expect(control).toBeVisible();
});
