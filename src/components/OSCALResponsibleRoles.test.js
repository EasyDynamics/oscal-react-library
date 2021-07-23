import React from "react";
import { render, screen, within } from "@testing-library/react";
import OSCALResponsibleRoles from "./OSCALResponsibleRoles";
import {
  metadataTestData,
  responsibleRolesTestData,
} from "../test-data/CommonData";

function responsibleRolesRenderer() {
  render(
    <OSCALResponsibleRoles
      responsibleRoles={responsibleRolesTestData}
      parties={metadataTestData.parties}
    />
  );
}

export default function testOSCALResponsibleRoles(parentElementName, renderer) {
  test(`${parentElementName} shows component roles`, () => {
    renderer();
    const roleTypeResult = screen.getByText("provider");
    expect(roleTypeResult).toBeVisible();

    const rolePartyResult = within(roleTypeResult.closest("tr")).getByText(
      "Some group of people"
    );
    expect(rolePartyResult).toBeVisible();
  });
}

export function testExternalOSCALResponsibleRoles(
  parentElementName,
  renderer,
  externalUrl
) {
  test(`${parentElementName} shows component roles`, () => {
    renderer(externalUrl);
    const roleTypeResult = screen.getByText("supplier");
    expect(roleTypeResult).toBeVisible();

    const rolePartyResult = within(roleTypeResult.closest("tr")).getByText(
      "Test Vendor External Component"
    );
    expect(rolePartyResult).toBeVisible();
  });
}

if (!require.main) {
  testOSCALResponsibleRoles("OSCALResponsibleRoles", responsibleRolesRenderer);
}
