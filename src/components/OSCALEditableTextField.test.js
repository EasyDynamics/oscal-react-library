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
  test(`Tests ${parentElementName} to see if the textfield has the default value "Test Title"`, () => {
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

  test(`${parentElementName} tests if textfield value remains same after 'Esc' key pressed`, () => {
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

  test(`${parentElementName} tests textfield remains the same after pressing Enter without editing`, () => {
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

    fireEvent.keyDown(textField, {
      key: "Enter",
      charCode: 13,
    });
    expect(textField).not.toBeVisible();
  });
}
