import React from "react";
import { render, screen } from "@testing-library/react";
import { profileCatalogInheritanceData } from "../test-data/CommonData";
import OSCALProfileCatalogInheritance from "./OSCALProfileCatalogInheritance";

describe("OSCALProfileCatalogInheritance", () => {
  test("displays top-level Catalog", () => {
    render(
      <OSCALProfileCatalogInheritance
        inheritedProfilesAndCatalogs={profileCatalogInheritanceData}
      />
    );

    const resultCatalog = screen.getByText("Example Catalog");
    expect(resultCatalog).toBeVisible();
  });

  test("displays top-level Profile", () => {
    render(
      <OSCALProfileCatalogInheritance
        inheritedProfilesAndCatalogs={profileCatalogInheritanceData}
      />
    );
    const resultProfile = screen.getByText("Example Inherited Profile");
    expect(resultProfile).toBeVisible();
  });

  test("displays Catalog imported from Profile", () => {
    render(
      <OSCALProfileCatalogInheritance
        inheritedProfilesAndCatalogs={profileCatalogInheritanceData}
      />
    );
    screen.getByText("Example Inherited Profile").click();

    const nestedCatalog = screen.getByText("Nested Inherited Catalog");
    expect(nestedCatalog).toBeVisible();
  });
});
