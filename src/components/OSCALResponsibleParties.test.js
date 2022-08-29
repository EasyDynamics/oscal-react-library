import React from "react";
import { render, screen, within } from "@testing-library/react";
import OSCALResponsibleParties from "./OSCALResponsibleParties";
import {
  metadataTestData,
  responsiblePartiesTestData,
} from "../test-data/CommonData";

function responsiblePartiesRenderer() {
  render(
    <OSCALResponsibleParties
      responsibleParties={responsiblePartiesTestData}
      parties={metadataTestData.parties}
    />
  );
}

export default function testOSCALResponsibleParties(parentElementName, renderer) {
  test(`${parentElementName} shows component parties`, () => {
    renderer();
    const partyTypeResult = screen.getByText("provider");
    expect(partyTypeResult).toBeVisible();

    const partyResult = within(partyTypeResult.closest("tr")).getByText(
      "Some group of people"
    );
    expect(partyResult).toBeVisible();
  });
}

if (!require.main) {
  testOSCALResponsibleParties("OSCALResponsibleParties", responsiblePartiesRenderer);
}
