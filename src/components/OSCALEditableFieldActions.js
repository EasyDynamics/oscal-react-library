import React from "react";
import CancelIcon from "@material-ui/icons/Cancel";
import EditIcon from "@material-ui/icons/Edit";
import SaveIcon from "@material-ui/icons/Save";
import { IconButton } from "@material-ui/core";

export function getElementLabel(editedField) {
  return editedField.toString().replace(/,/g, "-");
}

export default function OSCALEditableFieldActions(props) {
  return props.inEditState ? (
    <>
      <IconButton
        aria-label={`save-${getElementLabel(props.editedField)}`}
        onClick={() => {
          if (props.onFieldSave.length === 4) {
            props.onFieldSave(
              props.appendToLastFieldInPath,
              props.patchData,
              props.editedField,
              props.reference.current.value
            );
          } else {
            props.onFieldSave(
              props.appendToLastFieldInPath,
              props.patchData,
              props.update,
              props.editedField,
              props.reference.current.value
            );
          }

          if (props.setInEditState) {
            props.setInEditState(!props.inEditState);
          }

          if (props.onCancel) {
            props.onCancel();
          }
        }}
      >
        <SaveIcon fontSize={props.iconFontSize} />
      </IconButton>
      <IconButton
        aria-label={`cancel-${getElementLabel(props.editedField)}`}
        onClick={() => {
          if (props.onCancel) {
            props.onCancel();
          } else {
            props.setInEditState(!props.inEditState);
          }
        }}
      >
        <CancelIcon fontSize={props.iconFontSize} />
      </IconButton>
    </>
  ) : (
    <IconButton
      aria-label={`edit-${getElementLabel(props.editedField)}`}
      onClick={() => {
        props.setInEditState(!props.inEditState);
      }}
    >
      <EditIcon fontSize={props.iconFontSize} />
    </IconButton>
  );
}

// Default values for some of this OSCALEditableFieldActions's props
OSCALEditableFieldActions.defaultProps = {
  iconFontSize: "small",
};
