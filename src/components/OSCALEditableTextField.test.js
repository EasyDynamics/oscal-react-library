import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import OSCALEditableTextField from "./OSCALEditableTextField";
import { testModifiableMetadata } from "../test-data/MetadataData";

test("OSCALEditableTextField loads", () => {
  render(
    <OSCALEditableTextField
      canEdit
      editedField={["version"]}
      isInEditState={[false, () => {}]}
      modifiableData={testModifiableMetadata.version}
    />
  );

  render(
    <OSCALEditableTextField
      canEdit
      editedField={["version"]}
      isInEditState={[true, () => {}]}
      modifiableData={testModifiableMetadata.version}
    />
  );
});

export default function testOSCALEditableTextField(
  parentElementName,
  renderer
) {
  test(`${parentElementName} displays text field and can be edited`, () => {
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

  test(`${parentElementName} tests if editing ends after 'Esc' key pressed`, () => {
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
      key: 'Escape',
      charCode: 27,
    });

    const editButton = screen.getByRole("button", {
        name: "edit-system-security-plan-metadata-title",
      });
    expect(editButton).toBeVisible();
  });

  /* test(`${parentElementName} tests if text value remains same after 'Esc' key pressed`, () => {
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
      code: "Escape",
      keyCode: 27,
      charCode: 27,
    });

    screen
        .getByRole("button", {
            name: "edit-system-security-plan-metadata-title",
        })
        .click();

    const textFieldAfterEvent = screen.getByTestId(
        "textField-system-security-plan-metadata-title"
    );

    expect(textFieldAfterEvent).toBe(textField);
  }); */

  test(`${parentElementName} tests if editing ends after 'Enter' key is pressed`, () => {
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
      key: 'Enter',
      charCode: 13,
     });

    const editButton = screen.getByRole("button", {
        name: "edit-system-security-plan-metadata-title",
    });
    expect(editButton).toBeVisible();
  });

  /*test(`${parentElementName} tests if saved after 'Enter' key is pressed`, () => {
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
      key: "Enter",
      code: "Enter",
      keyCode: 13,
      charCode: 13,
    });

    console.log(textField);

    const editButton = screen.getByRole("button", {
        name: "edit-system-security-plan-metadata-title",
      });
    expect(editButton).toBeVisible();
  }); */
}