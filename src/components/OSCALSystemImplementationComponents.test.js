import React, { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { responsiblePartiesTestData } from "../test-data/CommonData";
import { componentsTestData } from "../test-data/SystemData";
import OSCALSystemImplementationComponents from "./OSCALSystemImplementationComponents";

describe("OSCALSystemImplementationComponents", () => {
  beforeEach(() => {
    render(
      <OSCALSystemImplementationComponents
        components={componentsTestData}
        parties={responsiblePartiesTestData}
      />
    );
  });

  test("shows Components section title", () => {
    const result = screen.getByText("Components");
    expect(result).toBeVisible();
  });

  test(`shows component title`, () => {
    const result = screen.getByText("Example Component");
    expect(result).toBeVisible();
  });

  test(`shows component description`, async () => {
    await userEvent.hover(screen.getByText("Example Component"));
    expect(
      await screen.findByText("An example component.")
    ).toBeInTheDocument();
  });

  test(`shows component status`, () => {
    const component = screen.getByText("Example Component").closest("tr");
    const result = within(component).getByText("operational");
    expect(result).toBeVisible();
  });

  test(`shows component type`, () => {
    const component = screen.getByText("Example Component").closest("tr");
    const result = within(component).getByText("software");
    expect(result).toBeVisible();
  });

  test(`shows component version`, () => {
    const component = screen.getByText("Example Component").closest("tr");
    const propNameResult = within(component).getByText("version");
    expect(propNameResult).toBeVisible();
    const propValueResult = within(component).getByText("1.1");
    expect(propValueResult).toBeVisible();
  });
});
