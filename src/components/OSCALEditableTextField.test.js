import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import OSCALEditableTextField from "./OSCALEditableTextField";
import { testModifiableMetadata } from "../test-data/MetadataData";

test("OSCALEditableTextField loads", () => {
  render(
    <OSCALEditableTextField
      canEdit
      editedField={["version"]}
      modifiableData={testModifiableMetadata.version}
    />
  );

  render(
    <OSCALEditableTextField
      canEdit
      editedField={["version"]}
      modifiableData={testModifiableMetadata.version}
    />
  );
});

export default function testOSCALEditableTextField(
  parentElementName,
  renderer
) {
  test(`${parentElementName} displays default value as "Test Title"`, () => {
    renderer();

    screen
      .getByRole("button", {
        name: "edit-system-security-plan-metadata-title",
      })
      .click();

    const textField = screen.getByTestId(
      "textField-system-security-plan-metadata-title"
    );
    expect(textField.value).toEqual("Test Title");
    expect(textField).toBeVisible();
  });

  test(`${parentElementName} remains same on ESC`, () => {
    renderer();

    screen
      .getByRole("button", {
        name: "edit-system-security-plan-metadata-title",
      })
      .click();

    const textField = screen.getByTestId(
      "textField-system-security-plan-metadata-title"
    );

    fireEvent.keyDown(textField, {
      key: "Escape",
      keyCode: 27,
    });

    expect(textField.value).toEqual("Test Title");
  });

  test(`${parentElementName} remains same Enter`, () => {
    renderer();

    screen
      .getByRole("button", {
        name: "edit-system-security-plan-metadata-title",
      })
      .click();

    const textField = screen.getByTestId(
      "textField-system-security-plan-metadata-title"
    );

    fireEvent.keyPress(textField, {
      key: "Enter",
      keyCode: 13,
    });

    const textFieldAfterEvent = screen.getByTestId(
      "textField-system-security-plan-metadata-title"
    );

    expect(textFieldAfterEvent.value).toEqual(textField.value);
  });

  test(`${parentElementName} changes value on Enter`, () => {
    renderer();

    screen
      .getByRole("button", {
        name: "edit-system-security-plan-metadata-title",
      })
      .click();

    const textField = screen.getByTestId(
      "textField-system-security-plan-metadata-title"
    );
    fireEvent.change(textField, { target: { value: "New Test Title" } });
    fireEvent.keyPress(textField, {
      key: "Enter",
      keyCode: 13,
    });

    const textFieldAfterEvent = screen.getByTestId(
      "textField-system-security-plan-metadata-title"
    );
    expect(textFieldAfterEvent.value).toEqual("New Test Title");
  });
}
