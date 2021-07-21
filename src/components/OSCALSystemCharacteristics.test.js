import React from "react";
import { render, screen } from "@testing-library/react";
import OSCALSystemCharacteristics from "./OSCALSystemCharacteristics";
import { systemCharacteristicsTestData } from "../test-data/SystemData";

function systemCharacteristicsRenderer() {
  render(
    <OSCALSystemCharacteristics
      systemCharacteristics={systemCharacteristicsTestData}
    />
  );
}

export function testOSCALSystemCharacteristics(parentElementName, renderer) {
  test(`${parentElementName} shows system name`, () => {
    renderer();
    const result = screen.getByRole("heading", { name: "Example System Name" });
    expect(result).toBeVisible();
  });

  test(`${parentElementName} shows security sensitivity level`, () => {
    renderer();
    const result = screen.getByLabelText("sensitivity-level");
    expect(result).toHaveValue("moderate");
  });

  test(`${parentElementName} shows system information`, () => {
    renderer();
    const result = screen.getByText("Information Type Title");
    expect(result).toBeVisible();
  });

  test(`${parentElementName} shows security impact level`, () => {
    renderer();

    const confidentialityResult = screen.getByLabelText("confidentiality");
    expect(confidentialityResult).toHaveValue("confidentiality-value");

    const integrityResult = screen.getByLabelText("integrity");
    expect(integrityResult).toHaveValue("integrity-value");

    const availabilityResult = screen.getByLabelText("availability");
    expect(availabilityResult).toHaveValue("availability-value");
  });

  test(`${parentElementName} shows status`, () => {
    renderer();
    const result = screen.getByLabelText("status");
    expect(result).toHaveValue("other");
  });
}
if (!require.main) {
  testOSCALSystemCharacteristics(
    "OSCALSystemCharacteristics",
    systemCharacteristicsRenderer
  );
}
