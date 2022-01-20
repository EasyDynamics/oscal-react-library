import React from "react";
import CloseIcon from "@material-ui/icons/Close";
import EditIcon from "@material-ui/icons/Edit";
import SaveIcon from "@material-ui/icons/Save";
import { IconButton } from "@material-ui/core";

export function getElementLabel(editedField) {
  return editedField.toString().replace(/,/g, "-");
}

function getIconButtons(props) {
  return props.modifiableData.isInEditState[0] ? (
    <>
      <IconButton
        aria-label={`cancel-${getElementLabel(props.editedField)}`}
        onClick={() => {
          props.modifiableData.isInEditState[1](!props.modifiableData.isInEditState[0]);
        }}
      >
        <CloseIcon fontSize={props.iconFontSize} />
      </IconButton>
      <IconButton
        aria-label={`save-${getElementLabel(props.editedField)}`}
        onClick={() => {
          props.modifiableData.isInEditState[1](!props.modifiableData.isInEditState[0]);
          props.onSaveComplete(
            props.data,
            props.update,
            props.editedField,
            props.modifiableData.ref.current.value
          );
        }}
      >
        <SaveIcon fontSize={props.iconFontSize} />
      </IconButton>
    </>
  ) : (
    <IconButton
      aria-label={`edit-${getElementLabel(props.editedField)}`}
      onClick={() => {
        props.modifiableData.isInEditState[1](!props.modifiableData.isInEditState[0]);
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
