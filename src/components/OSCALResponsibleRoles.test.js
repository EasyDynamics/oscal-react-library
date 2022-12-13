import React from "react";
import { render, screen, within } from "@testing-library/react";
import OSCALResponsibleRoles from "./OSCALResponsibleRoles";
import {
  metadataTestData,
  responsibleRolesTestData,
} from "../test-data/CommonData";

describe("OSCALResponsibleRoles", () => {
  test(`shows component roles`, () => {
    render(
      <OSCALResponsibleRoles
        responsibleRoles={responsibleRolesTestData}
        parties={metadataTestData.parties}
      />
    );

    const roleTypeResult = screen.getByText("provider");
    expect(roleTypeResult).toBeVisible();

    const rolePartyResult = within(roleTypeResult.closest("tr")).getByText(
      "Some group of people"
    );
    expect(rolePartyResult).toBeVisible();
  });
});
