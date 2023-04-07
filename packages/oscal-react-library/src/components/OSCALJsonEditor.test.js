import React from "react";
import {
  render,
  screen,
  waitFor,
  fireEvent,
  within,
} from "@testing-library/react";
import OSCALJsonEditor from "./OSCALJsonEditor";

const oscalData = {
  "component-definition": {
    metadata: {
      title: "Test Component Definition",
      version: "20200723",
      "last-modified": "2021-06-08T13:57:28.355446-04:00",
      parties: [
        {
          type: "organization",
          uuid: "ee47836c-877c-4007-bbf3-c9d9bd805a9a",
          name: "Test Vendor",
        },
      ],
      "oscal-version": "1.0.0",
    },
  },
};
oscalData.oscalSource = JSON.stringify(oscalData, null, "\t");

jest.mock(
  "@monaco-editor/react",
  () =>
    function Editor(props) {
      const fragment = (
        <textarea
          data-testid="mocked-editor"
          onChange={jest.fn()}
          value={props.value}
        />
      );
      return fragment;
    }
);

describe("OSCALJsonEditor", () => {
  // This could generally be improved by using
  // snapshot testing https://jestjs.io/docs/snapshot-testing
  it("should render as expected", async () => {
    render(<OSCALJsonEditor value={oscalData.oscalSource} />);

    const container = await screen.findByTestId("container");

    const heading = within(container).getByText("JSON Editor");
    expect(heading).toBeInstanceOf(HTMLHeadingElement);
    expect(heading).toHaveClass("MuiTypography-h6");

    const buttonGrid = within(container).getByTestId("button-grid");
    expect(buttonGrid).toHaveClass("MuiGrid-container");

    const saveButton = within(buttonGrid).getByTestId("save-button");
    expect(saveButton).toHaveTextContent("Save");
    expect(saveButton).toBeInstanceOf(HTMLButtonElement);
    expect(saveButton).toHaveClass("MuiButton-containedPrimary");

    const saveIcon = within(saveButton).getByTestId("save-icon");
    expect(saveIcon).toBeInstanceOf(SVGElement);

    const cancelButon = within(buttonGrid).getByTestId("cancel-button");
    expect(cancelButon).toHaveTextContent("Cancel");
    expect(cancelButon).toBeInstanceOf(HTMLButtonElement);
    expect(cancelButon).toHaveClass("MuiButton-contained");
  });

  it("should return JSON after clicking save", async () => {
    const mockEditorRef = {
      getValue: jest.fn().mockReturnValue(oscalData),
    };
    const handleSave = jest.fn((jsonValue) => jsonValue);

    render(
      <OSCALJsonEditor
        editorRef={mockEditorRef}
        value={oscalData.oscalSource}
        onSave={handleSave}
      />
    );

    const container = await screen.findByTestId("container");
    const saveButton = within(container).getByTestId("save-button");

    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(mockEditorRef.getValue).toBeCalledTimes(1);
    });
    expect(handleSave).toBeCalledTimes(1);
    expect(handleSave).lastReturnedWith(oscalData);
  });

  it("should replace original value after clicking cancel", async () => {
    const mockEditorRef = {
      setValue: jest.fn(),
    };
    const handleSave = jest.fn((jsonValue) => jsonValue);

    render(
      <OSCALJsonEditor
        editorRef={mockEditorRef}
        value={oscalData.oscalSource}
        onSave={handleSave}
      />
    );

    const container = await screen.findByTestId("container");
    const cancelButton = within(container).getByTestId("cancel-button");

    fireEvent.click(cancelButton);

    await waitFor(() => {
      expect(mockEditorRef.setValue).toBeCalledTimes(1);
    });
    expect(mockEditorRef.setValue).toHaveBeenLastCalledWith(
      oscalData.oscalSource
    );
  });
});
