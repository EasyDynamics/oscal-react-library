import React from "react";
import OSCALEditableTextField from "../components/OSCALEditableTextField";
import { testModifiableMetadata, textFieldEditModeMetadata } from "../test-data/MetadataData";

export default {
  title: "Components/Editable Text Field",
  component: OSCALEditableTextField,
};

function Template(args) {
  return <OSCALEditableTextField {...args} />;
}

export const Default = Template.bind({});

export const InEditMode = Template.bind({});

Default.args = {
  modifiableData: testModifiableMetadata.title,
};

InEditMode.args = {
  modifiableData: textFieldEditModeMetadata.title,
  textFieldSize: "medium",
  editedField: ["storybook", "editable-text-field", "edit-mode"],
};
