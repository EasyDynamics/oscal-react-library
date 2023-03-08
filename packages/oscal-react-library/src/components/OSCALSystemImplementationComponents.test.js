import React, { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { responsiblePartiesTestData } from "../test-data/CommonData";
import { componentsTestData } from "../test-data/SystemData";
import OSCALSystemImplementationComponents from "./OSCALSystemImplementationComponents";

describe("OSCALSystemImplementationComponents", () => {
  test("shows Components section title", () => {
    render(
      <OSCALSystemImplementationComponents
        components={componentsTestData}
        parties={responsiblePartiesTestData}
      />
    );
    const result = screen.getByText("Components");
    expect(result).toBeVisible();
  });

  test(`shows component title`, () => {
    render(
      <OSCALSystemImplementationComponents
        components={componentsTestData}
        parties={responsiblePartiesTestData}
      />
    );
    const result = screen.getByText("Example Component");
    expect(result).toBeVisible();
  });

  test(`shows component description`, async () => {
    render(
      <OSCALSystemImplementationComponents
        components={componentsTestData}
        parties={responsiblePartiesTestData}
      />
    );
    await userEvent.hover(screen.getByText("Example Component"));
    expect(
      await screen.findByText("An example component.")
    ).toBeInTheDocument();
  });

  test(`shows component status`, () => {
    render(
      <OSCALSystemImplementationComponents
        components={componentsTestData}
        parties={responsiblePartiesTestData}
      />
    );
    // Grab example party row beneath heading row
    const exampleResponsiblePartiesRow = screen.getAllByRole("row")[1];

    const component = within(exampleResponsiblePartiesRow).getByText(
      "Example Component"
    );
    expect(component).toBeVisible();

    const result = within(exampleResponsiblePartiesRow).getByText(
      "operational"
    );
    expect(result).toBeVisible();
  });

  test(`shows component type`, () => {
    render(
      <OSCALSystemImplementationComponents
        components={componentsTestData}
        parties={responsiblePartiesTestData}
      />
    );
    // Grab example party row beneath heading row
    const exampleResponsiblePartiesRow = screen.getAllByRole("row")[1];

    const component = within(exampleResponsiblePartiesRow).getByText(
      "Example Component"
    );
    expect(component).toBeVisible();

    const result = within(exampleResponsiblePartiesRow).getByText("software");
    expect(result).toBeVisible();
  });

  test(`shows component version`, () => {
    render(
      <OSCALSystemImplementationComponents
        components={componentsTestData}
        parties={responsiblePartiesTestData}
      />
    );
    // Grab example party row beneath heading row
    const exampleResponsiblePartiesRow = screen.getAllByRole("row")[1];

    const component = within(exampleResponsiblePartiesRow).getByText(
      "Example Component"
    );
    expect(component).toBeVisible();

    const propNameResult = within(exampleResponsiblePartiesRow).getByText(
      "version"
    );
    expect(propNameResult).toBeVisible();
    const propValueResult = within(exampleResponsiblePartiesRow).getByText(
      "1.1"
    );
    expect(propValueResult).toBeVisible();
  });
});
