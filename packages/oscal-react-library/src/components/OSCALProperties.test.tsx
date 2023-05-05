import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { OSCALPropertiesDialog } from "./OSCALProperties";
import { Property } from "@easydynamics/oscal-types";
import { NIST_DEFAULT_NAMESPACE } from "./oscal-utils/OSCALPropUtils";

const TEST_NAMESPACE = "http://easydynamics.com/ns/oscal/test";
const props: Property[] = [
  {
    name: "Test Property",
    value: "Test Value",
    ns: TEST_NAMESPACE,
  },
  {
    name: "marking",
    value: "test",
    ns: NIST_DEFAULT_NAMESPACE,
  },
  {
    name: "status",
    value: "test",
  },
];

const NAMESPACES = [TEST_NAMESPACE, NIST_DEFAULT_NAMESPACE];

describe("OSCAL Properties", () => {
  test("displays the property button", async () => {
    render(<OSCALPropertiesDialog properties={props} />);
    expect(await screen.findByRole("button", { name: "Open Properties" })).toBeInTheDocument();
  });
  test("clicking the button opens the dialog", async () => {
    render(<OSCALPropertiesDialog properties={props} title="Test" />);
    const button = await screen.findByRole("button", { name: "Open Properties" });
    fireEvent.click(button);
    expect(screen.getByText("Test Properties")).toBeVisible();
  });
  test.each(NAMESPACES)("namespace title appears (%s)", async (ns) => {
    render(<OSCALPropertiesDialog properties={props} title="Test" />);
    const button = await screen.findByRole("button", { name: "Open Properties" });
    fireEvent.click(button);
    expect(screen.getByText(ns)).toBeVisible();
  });
  test.each(props.map(({ name }) => name))("property name appears (%s)", async (name) => {
    render(<OSCALPropertiesDialog properties={props} title="Test" />);
    const button = await screen.findByRole("button", { name: "Open Properties" });
    fireEvent.click(button);
    expect(screen.getByText(name)).toBeVisible();
  });
});
