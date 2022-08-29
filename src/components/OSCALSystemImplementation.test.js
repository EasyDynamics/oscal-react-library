import React from "react";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import OSCALSystemImplementation from "./OSCALSystemImplementation";
import { metadataTestData } from "../test-data/CommonData";
import { systemImplementationTestData } from "../test-data/SystemData";

describe("SystemImplementation", () => {
  beforeEach(() => {
    render(
      <OSCALSystemImplementation
        systemImplementation={systemImplementationTestData}
        parties={metadataTestData.parties}
      />
    );
  });

  test(`shows remarks`, () => {
    const result = screen.getByText("Example system implementation remarks.");
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
