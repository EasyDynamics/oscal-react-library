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
  test(`${parentElementName} verifies default value "Test Title"`, () => {
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

  test(`${parentElementName} verifies textfield remains same (ESC)`, () => {
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

  test(`${parentElementName} verifies textfield without editing (Enter)`, () => {
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
      charCode: 13,
    });

    const textFieldAfterEvent = screen.getByTestId(
      "textField-system-security-plan-metadata-title"
    );

    expect(textFieldAfterEvent.value).toEqual(textField.value);
  });

  test(`${parentElementName} verifies value changes to "New Test Title (Enter)`, () => {
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
      charCode: 13,
    });

    const textFieldAfterEvent = screen.getByTestId(
      "textField-system-security-plan-metadata-title"
    );
    expect(textFieldAfterEvent.value).toEqual("New Test Title");
  });
}
