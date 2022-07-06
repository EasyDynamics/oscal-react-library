import React from "react";
import { render, screen } from "@testing-library/react";
import OSCALDrawerSelector from "./OSCALDrawerSelector";

test("OSCALDrawerSelector loads", () => {
  render(<OSCALDrawerSelector open />);
});

test(`OSCALDrawerSelector displays expected tree items`, () => {
  render(<OSCALDrawerSelector open />);

  const catalogItem = screen.getByRole("treeitem", {
    name: "Catalog",
  });

  const componentItem = screen.getByRole("treeitem", {
    name: "Component",
  });

  const profileItem = screen.getByRole("treeitem", {
    name: "Profile",
  });

  const SSPItem = screen.getByRole("treeitem", {
    name: "System Security Plan",
  });

  expect(catalogItem).toBeVisible();
  expect(componentItem).toBeVisible();
  expect(profileItem).toBeVisible();
  expect(SSPItem).toBeVisible();
});

test(`OSCALDrawerSelector displays close button`, () => {
  render(<OSCALDrawerSelector open />);

  const closeButton = screen.getByTestId("ChevronLeftIcon", {
    role: "button",
  });

  expect(closeButton).toBeVisible();
});