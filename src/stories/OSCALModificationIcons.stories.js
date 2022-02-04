import React from "react";
import OSCALEditableFieldActions from "../components/OSCALEditableFieldActions";

export default {
  title: "Components/Modification Icons",
  component: OSCALEditableFieldActions,
};

function Template(args) {
  return <OSCALEditableFieldActions {...args} />;
}

export const Default = Template.bind({});

export const InEditMode = Template.bind({});

Default.args = {
  canEdit: true,
  modifiableData: { edit: [false, () => {}] },
  editedField: ["storybook", "default"],
};

InEditMode.args = {
  canEdit: true,
  modifiableData: { edit: [true, () => {}] },
  editedField: ["storybook", "edit-mode"],
};
