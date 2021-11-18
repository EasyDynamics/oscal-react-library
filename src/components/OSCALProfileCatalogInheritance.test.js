import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { profileCatalogInheritanceData } from "../test-data/CommonData";
import OSCALProfileCatalogInheritance from "./OSCALProfileCatalogInheritance";

function profileCatalogInheritanceRenderer() {
  render(
    <OSCALProfileCatalogInheritance
      inheritedProfilesAndCatalogs={profileCatalogInheritanceData}
    />
  );
}

test("OSCALProfileCatalogInheritance displays top-level inherited objects", async () => {
  profileCatalogInheritanceRenderer();
  const resultCatalog = await waitFor(
    () => screen.getByText("Catalog: Example Catalog"),
    { timeout: 5000 }
  );
  expect(resultCatalog).toBeVisible();

  const resultProfile = await waitFor(
    () => screen.getByText("Profile: Example Inherited Profile"),
    { timeout: 5000 }
  );

  expect(resultProfile).toBeVisible();
});

test("OSCALProfileCatalogInheritance displays nested inherited objects", async () => {
  profileCatalogInheritanceRenderer();
  const nestedCatalog = await waitFor(
    () => screen.getByText("Catalog: Nested Inherited Catalog"),
    { timeout: 5000 }
  );

  expect(nestedCatalog).toBeVisible();
});
