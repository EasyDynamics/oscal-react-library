import React from "react";
import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import {
  profileCatalogInheritanceData,
} from "../test-data/CommonData";
import OSCALProfileCatalogInheritance from "./OSCALProfileCatalogInheritance";

function profileCatalogInheritanceRenderer() {
  render(<OSCALProfileCatalogInheritance inheritedProfilesAndCatalogs={profileCatalogInheritanceData}/>);
}

test("OSCALProfileCatalogInheritance displays top-level inherited objects", async () => {
  profileCatalogInheritanceRenderer();
  const result = await waitFor(
    () => screen.getByText("Catalog: Example Catalog"),
    {timeout: 5000}
  );
  expect(result).toBeVisible();
});

test("OSCALProfileCatalogInheritance displays nested inherited objects", async () => {
  profileCatalogInheritanceRenderer();
  const inheritanceButton = await screen.findByRole(
    "button",
    { name: "expand-profiles-and-catalogs 2" },
    { timeout: 5000 }
  );
  fireEvent.click(inheritanceButton);
  expect(await screen.findByText("Catalog: Nested Inherited Catalog")).toBeVisible();
});