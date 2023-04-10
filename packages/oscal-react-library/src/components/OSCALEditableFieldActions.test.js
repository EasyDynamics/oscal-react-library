import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import OSCALEditableFieldActions from "./OSCALEditableFieldActions";
import { testModifiableMetadata } from "../test-data/MetadataData";

test("OSCALEditableFieldActions loads", () => {
  render(
    <OSCALEditableFieldActions
      canEdit
      editedField={["version"]}
      isInEditState={[false, () => {}]}
      modifiableData={testModifiableMetadata.version}
    />
  );

  render(
    <OSCALEditableFieldActions
      canEdit
      editedField={["version"]}
      isInEditState={[true, () => {}]}
      modifiableData={testModifiableMetadata.version}
    />
  );
});

export default function testOSCALEditableFieldActions(parentElementName, renderer) {
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

    const textField = screen.getByTestId("textField-system-security-plan-metadata-title");
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

  test(`${parentElementName} show edit in tooltip`, async () => {
    renderer();

    fireEvent.mouseOver(
      screen.getByRole("button", {
        name: "edit-system-security-plan-metadata-title",
      })
    );

    expect(await screen.findByText("Edit")).toBeVisible();
  });

  test(`${parentElementName} show cancel in tooltip`, async () => {
    renderer();

    screen
      .getByRole("button", {
        name: "edit-system-security-plan-metadata-title",
      })
      .click();

    fireEvent.mouseOver(
      screen.getByRole("button", {
        name: "cancel-system-security-plan-metadata-title",
      })
    );

    expect(await screen.findByText("Cancel")).toBeVisible();
  });

  test(`${parentElementName} show save in tooltip`, async () => {
    renderer();

    screen
      .getByRole("button", {
        name: "edit-system-security-plan-metadata-title",
      })
      .click();

    fireEvent.mouseOver(
      screen.getByRole("button", {
        name: "save-system-security-plan-metadata-title",
      })
    );

    expect(await screen.findByText("Save")).toBeVisible();
  });
}
