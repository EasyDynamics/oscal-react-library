import React from "react";
import { render, screen } from "@testing-library/react";
import OSCALModificationIcons from "./OSCALModificationIcons";
import { testModifiableMetadata } from "../test-data/MetadataData";

test("OSCALModificationIcons loads", () => {
  render(
    <OSCALModificationIcons
      canEdit
      editedField={["version"]}
      modifiableData={testModifiableMetadata.version}
    />
  );
});

export default function testOSCALModificationIcons(
  parentElementName,
  renderer
) {
  test(`${parentElementName} displays edit icon`, () => {
    renderer();

    const editButton = screen.getByRole("button", {
      name: "edit-system-security-plan-metadata-title",
    });
    expect(editButton).toBeVisible();
  });

  test(`${parentElementName} displays text field on edit icon click`, () => {
    renderer();

    screen
      .getByRole("button", {
        name: "edit-system-security-plan-metadata-title",
      })
      .click();

    const textField = screen.getByTestId(
      "textField-system-security-plan-metadata-title"
    );
    expect(textField).toBeVisible();
  });

  test(`${parentElementName} displays save/cancel icons on edit icon click`, () => {
    renderer();

    screen
      .getByRole("button", {
        name: "edit-system-security-plan-metadata-title",
      })
      .click();

    const saveButton = screen.getByRole("button", {
      name: "save-system-security-plan-metadata-title",
    });
    expect(saveButton).toBeVisible();

    const cancelButton = screen.getByRole("button", {
      name: "cancel-system-security-plan-metadata-title",
    });
    expect(cancelButton).toBeVisible();
  });
}
