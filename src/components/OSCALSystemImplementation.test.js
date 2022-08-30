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

  test("shows Components section title", () => {
    const result = screen.getByText("Components");
    expect(result).toBeVisible();
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

  test("shows Users section title", () => {
    const result = screen.getByText("Users");
    expect(result).toBeVisible();
  });

  test("shows Title column", () => {
    const result = screen.getByText("Title");
    expect(result).toBeVisible();
  });

  test("shows Authorized Privileges column", () => {
    const result = screen.getByText("Authorized Privileges");
    expect(result).toBeVisible();
  });

  test("shows name of a user listed", () => {
    const result = screen.getByText("User 1");
    expect(result).toBeVisible();
  });

  test("shows name of a privilege listed", () => {
    const result = screen.getByText("privilege title");
    expect(result).toBeVisible();
  });

  test("shows name of a user listed", async () => {
    await userEvent.hover(screen.getByText("User 1"));
    expect(await screen.findByText("A system user")).toBeInTheDocument();
  });

  test("shows role id", () => {
    const result = screen.getByText("asset-administrator");
    expect(result).toBeVisible();
  });

  test("shows authorized privilege title", () => {
    const result = screen.getByText("privilege title");
    expect(result).toBeVisible();
  });

  test("shows authorized privilege description", async () => {
    await userEvent.hover(screen.getByText("privilege title"));
    expect(
      await screen.findByText("privilege description")
    ).toBeInTheDocument();
  });

  test("shows read function preformed", () => {
    const result = screen.getByText("reading function");
    expect(result).toBeVisible();
  });

  test("shows write function preformed", () => {
    const result = screen.getByText("writing function");
    expect(result).toBeVisible();
  });
});
