import React from "react";
import { render, screen, within } from "@testing-library/react";
import OSCALResponsibleRoles from "./OSCALResponsibleRoles";
import { metadataTestData, responsibleRolesTestData } from "../test-data/CommonData";

describe("OSCALResponsibleRoles", () => {
  test(`shows component roles`, () => {
    render(
      <OSCALResponsibleRoles
        responsibleRoles={responsibleRolesTestData}
        parties={metadataTestData.parties}
      />
    );

    const responsibleRolesRow = screen.getByRole("row");

    const rowHeader = within(responsibleRolesRow).getByRole("rowheader");
    expect(rowHeader).toHaveTextContent("provider");

    const rowData = within(responsibleRolesRow).getByText("Some group of people");
    expect(rowData).toBeVisible();
  });
});
