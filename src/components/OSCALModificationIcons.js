import React from "react";
import CancelIcon from "@material-ui/icons/Cancel";
import EditIcon from "@material-ui/icons/Edit";
import SaveIcon from "@material-ui/icons/Save";
import { IconButton } from "@material-ui/core";

export function getElementLabel(editedField) {
  return editedField.toString().replace(/,/g, "-");
}

function getIconButtons(props) {
  return props.isInEditState[0] ? (
    <>
      <IconButton
        aria-label={`save-${getElementLabel(props.editedField)}`}
        onClick={() => {
          props.isInEditState[1](!props.isInEditState[0]);
          props.onSaveComplete(
            props.data,
            props.update,
            props.editedField,
            props.reference.current.value
          );
        }}
      >
        <SaveIcon fontSize={props.iconFontSize} />
      </IconButton>
      <IconButton
        aria-label={`cancel-${getElementLabel(props.editedField)}`}
        onClick={() => {
          props.isInEditState[1](!props.isInEditState[0]);
        }}
      >
        <CancelIcon fontSize={props.iconFontSize} />
      </IconButton>
    </>
  ) : (
    <IconButton
      aria-label={`edit-${getElementLabel(props.editedField)}`}
      onClick={() => {
        props.isInEditState[1](!props.isInEditState[0]);
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
