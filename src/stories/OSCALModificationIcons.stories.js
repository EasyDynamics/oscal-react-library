import React from "react";
import OSCALModificationIcons from "../components/OSCALModificationIcons";

export default {
  title: "Components/Modification Icons",
  component: OSCALModificationIcons,
};

function Template(args) {
  return <OSCALModificationIcons {...args} />;
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
