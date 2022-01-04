import React from "react";
import CloseIcon from "@material-ui/icons/Close";
import EditIcon from "@material-ui/icons/Edit";
import SaveIcon from "@material-ui/icons/Save";
import { IconButton } from "@material-ui/core";

function getIconButtons(props) {
  return props.editedField.edit[0] ? (
    <>
      <IconButton
        onClick={() => {
          props.editedField.edit[1](!props.editedField.edit[0]);
        }}
      >
        <CloseIcon fontSize={props.iconFontSize} />
      </IconButton>
      <IconButton
        onClick={() => {
          props.editedField.edit[1](!props.editedField.edit[0]);
        }}
      >
        <SaveIcon fontSize={props.iconFontSize} />
      </IconButton>
    </>
  ) : (
    <IconButton
      onClick={() => {
        props.editedField.edit[1](!props.editedField.edit[0]);
      }}
    >
      <EditIcon fontSize={props.iconFontSize} />
    </IconButton>
  );
}

export default function OSCALModificationIcons(props) {
  return props.canEdit ? getIconButtons(props) : null;
}

// Default values for some of this OSCALModificationIcon's props
OSCALModificationIcons.defaultProps = {
  iconFontSize: "small",
};
