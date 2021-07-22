import React from "react";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import OSCALSystemImplementation from "./OSCALSystemImplementation";
import testOSCALResponsibleRoles from "./OSCALResponsibleRoles.test";
import { metadataTestData } from "../test-data/OtherData";
import { systemImplementationTestData } from "../test-data/SystemData";

function systemImplementationRenderer() {
  render(
    <OSCALSystemImplementation
      systemImplementation={systemImplementationTestData}
      parties={metadataTestData.parties}
    />
  );
}

export default function testOSCALSystemImplementation(
  parentElementName,
  renderer
) {
  test(`${parentElementName} shows remarks`, () => {
    renderer();
    const result = screen.getByText("Example system implementation remarks.");
    expect(result).toBeVisible();
  });

  test(`${parentElementName} shows component title`, () => {
    renderer();
    const result = screen.getByText("Example Component");
    expect(result).toBeVisible();
  });

  test(`${parentElementName} shows component description`, async () => {
    renderer();
    userEvent.hover(screen.getByText("Example Component"));
    expect(
      await screen.findByText("An example component.")
    ).toBeInTheDocument();
  });

  test(`${parentElementName} shows component status`, () => {
    renderer();
    const component = screen.getByText("Example Component").closest("tr");
    const result = within(component).getByText("operational");
    expect(result).toBeVisible();
  });

  test(`${parentElementName} shows component type`, () => {
    renderer();
    const component = screen.getByText("Example Component").closest("tr");
    const result = within(component).getByText("software");
    expect(result).toBeVisible();
  });

  test(`${parentElementName} shows component version`, () => {
    renderer();
    const component = screen.getByText("Example Component").closest("tr");
    const propNameResult = within(component).getByText("version");
    expect(propNameResult).toBeVisible();
    const propValueResult = within(component).getByText("1.1");
    expect(propValueResult).toBeVisible();
  });

  testOSCALResponsibleRoles(parentElementName, systemImplementationRenderer);
}

if (!require.main) {
  testOSCALSystemImplementation(
    "OSCALSystemImplementation",
    systemImplementationRenderer
  );
}
