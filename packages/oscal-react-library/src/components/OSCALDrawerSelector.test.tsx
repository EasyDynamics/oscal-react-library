import React from "react";
import { render, screen } from "@testing-library/react";
import { OSCALDrawerSelector } from "./OSCALDrawerSelector";

describe("OSCALDrawerSelector", () => {
  test("loads", () => {
    render(<OSCALDrawerSelector open handleClose={() => {}} />);
  });

  test(`displays expected tree items`, () => {
    render(<OSCALDrawerSelector open handleClose={() => {}} />);

    const catalogItem = screen.getByRole("treeitem", {
      name: "Catalogs",
    });

    const componentItem = screen.getByRole("treeitem", {
      name: "Components",
    });

    const profileItem = screen.getByRole("treeitem", {
      name: "Profiles",
    });

    const sspItem = screen.getByRole("treeitem", {
      name: "System Security Plans",
    });

    expect(catalogItem).toBeVisible();
    expect(componentItem).toBeVisible();
    expect(profileItem).toBeVisible();
    expect(sspItem).toBeVisible();
  });

  test(`displays close button`, () => {
    render(<OSCALDrawerSelector open handleClose={() => {}} />);

    const closeButton = screen.getByTestId("ChevronLeftIcon");

    expect(closeButton).toBeVisible();
  });
});
