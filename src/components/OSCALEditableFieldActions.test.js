import React from "react";
import { render, screen } from "@testing-library/react";
import EditIcon from "@material-ui/icons/Edit";
import OSCALEditableFieldActions from "./OSCALEditableFieldActions";
import { testModifiableMetadata } from "../test-data/MetadataData";

test("OSCALEditableFieldActions loads", () => {
  render(
    <OSCALEditableFieldActions
      canEdit
      editedField={["version"]}
      editIcon={<EditIcon />}
      isInEditState={[false, () => {}]}
      modifiableData={testModifiableMetadata.version}
    />
  );

  render(
    <OSCALEditableFieldActions
      canEdit
      editedField={["version"]}
      editIcon={<EditIcon />}
      isInEditState={[true, () => {}]}
      modifiableData={testModifiableMetadata.version}
    />
  );
});

export default function testOSCALEditableFieldActions(
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
