import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import OSCALEditableTextField from "./OSCALEditableTextField";

const fieldName = "title";
const editedMetadataField = ["metadata"];
const value = "Test Title";

describe("OSCALEditableTextField", () => {
  test('displays default value as "Test Title"', () => {
    render(
      <OSCALEditableTextField
        isEditable
        editedField={editedMetadataField}
        fieldName={fieldName}
        value={value}
        onFieldSave={() => {}}
      />
    );

    screen
      .getByRole("button", {
        name: "edit-metadata",
      })
      .click();

    const textField = screen.getByRole("textbox", { name: /title/i });

    expect((textField as HTMLInputElement).value).toEqual(value);
  });

  test("remains same on ESC", () => {
    render(
      <OSCALEditableTextField
        isEditable
        editedField={editedMetadataField}
        fieldName={fieldName}
        value={value}
        onFieldSave={() => {}}
      />
    );

    screen
      .getByRole("button", {
        name: "edit-metadata",
      })
      .click();

    const textField = screen.getByRole("textbox", { name: /title/i });

    fireEvent.keyDown(textField, {
      key: "Escape",
      keyCode: 27,
    });

    expect((textField as HTMLInputElement).value).toEqual(value);
  });

  test("remains same Enter", () => {
    render(
      <OSCALEditableTextField
        isEditable
        editedField={editedMetadataField}
        fieldName={fieldName}
        value={value}
        onFieldSave={() => {}}
      />
    );

    screen
      .getByRole("button", {
        name: "edit-metadata",
      })
      .click();

    const textField = screen.getByRole("textbox", { name: /title/i });

    fireEvent.keyPress(textField, {
      key: "Enter",
      keyCode: 13,
    });

    expect((textField as HTMLInputElement).value).toEqual(value);
  });

  test("changes value on Enter", () => {
    render(
      <OSCALEditableTextField
        isEditable
        editedField={editedMetadataField}
        fieldName={fieldName}
        value={value}
        onFieldSave={() => {}}
      />
    );

    screen
      .getByRole("button", {
        name: "edit-metadata",
      })
      .click();

    const textField = screen.getByRole("textbox", { name: /title/i });

    fireEvent.change(textField, { target: { value: "New Test Title" } });
    fireEvent.keyPress(textField, {
      key: "Enter",
      keyCode: 13,
    });

    expect((textField as HTMLInputElement).value).toEqual("New Test Title");
  });
});

describe("OSCALEditableFieldActions", () => {
  test("displays edit icon", () => {
    render(
      <OSCALEditableTextField
        isEditable
        editedField={editedMetadataField}
        fieldName={fieldName}
        value={value}
        onFieldSave={() => {}}
      />
    );

    const editButton = screen.getByRole("button", {
      name: "edit-metadata",
    });

    expect(editButton).toBeVisible();
  });

  test("displays edit tooltip on hover", async () => {
    render(
      <OSCALEditableTextField
        isEditable
        editedField={editedMetadataField}
        fieldName={fieldName}
        value={value}
        onFieldSave={() => {}}
      />
    );

    const editButton = screen.getByRole("button", {
      name: "edit-metadata",
    });

    fireEvent.mouseOver(editButton);

    const editText = await screen.findByText("Edit");

    expect(editText).toBeVisible();
  });

  test("displays save icon on edit icon click", () => {
    render(
      <OSCALEditableTextField
        isEditable
        editedField={editedMetadataField}
        fieldName={fieldName}
        value={value}
        onFieldSave={() => {}}
      />
    );

    const editButton = screen.getByRole("button", {
      name: "edit-metadata",
    });
    fireEvent.click(editButton);

    const saveButton = screen.getByRole("button", {
      name: "save-metadata",
    });

    expect(saveButton).toBeVisible();
  });

  test("displays save tooltip on hover", async () => {
    render(
      <OSCALEditableTextField
        isEditable
        editedField={editedMetadataField}
        fieldName={fieldName}
        value={value}
        onFieldSave={() => {}}
      />
    );

    const editButton = screen.getByRole("button", {
      name: "edit-metadata",
    });
    fireEvent.click(editButton);

    const saveButton = screen.getByRole("button", {
      name: "save-metadata",
    });
    fireEvent.mouseOver(saveButton);

    const saveText = await screen.findByText("Save");

    expect(saveText).toBeVisible();
  });

  test("displays cancel icon on edit icon click", () => {
    render(
      <OSCALEditableTextField
        isEditable
        editedField={editedMetadataField}
        fieldName={fieldName}
        value={value}
        onFieldSave={() => {}}
      />
    );

    const editButton = screen.getByRole("button", {
      name: "edit-metadata",
    });
    fireEvent.click(editButton);

    const cancelButton = screen.getByRole("button", {
      name: "cancel-metadata",
    });

    expect(cancelButton).toBeVisible();
  });

  test("displays cancel tooltip on hover", async () => {
    render(
      <OSCALEditableTextField
        isEditable
        editedField={editedMetadataField}
        fieldName={fieldName}
        value={value}
        onFieldSave={() => {}}
      />
    );

    const editButton = screen.getByRole("button", {
      name: "edit-metadata",
    });
    fireEvent.click(editButton);

    const saveButton = screen.getByRole("button", {
      name: "cancel-metadata",
    });
    fireEvent.mouseOver(saveButton);

    const saveText = await screen.findByText("Cancel");

    expect(saveText).toBeVisible();
  });
});
