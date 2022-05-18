import React from "react";
import CancelIcon from "@material-ui/icons/Cancel";
import { IconButton } from "@material-ui/core";

export function getElementLabel(editedField) {
  return editedField.toString().replace(/,/g, "-");
}

export default function OSCALEditableFieldActions(props) {
  return props.inEditState ? (
    <>
      <IconButton
        aria-label={
          props.editedField
            ? `save-${getElementLabel(props.editedField)}`
            : `save-${props.editedFieldPath}`
        }
        onClick={() => {
          if (props.onFieldSave.length > 0) {
            props.onFieldSave(
              props.appendToLastFieldInPath,
              props.partialRestData,
              props.editedField,
              props.reference.current.value
            );
          } else {
            props.onFieldSave();
          }

          if (!props.saveMode && props.setSaveMode) {
            props.setSaveMode(true);
            return;
          }

          if (props.setInEditState) {
            props.setInEditState(!props.inEditState);
          }

          if (props.onCancel) {
            props.onCancel();
          }
        }}
      >
        {props.saveIcon}
      </IconButton>
      <IconButton
        aria-label={
          props.editedField
            ? `cancel-${getElementLabel(props.editedField)}`
            : `cancel-${props.editedFieldPath}`
        }
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
      aria-label={
        props.editedField
          ? `edit-${getElementLabel(props.editedField)}`
          : `edit-${props.editedFieldPath}`
      }
      onClick={() => {
        props.setInEditState(!props.inEditState);
        props.setSaveMode(false);
      }}
    >
      {props.editIcon}
    </IconButton>
  );
}

// Default values for some of this OSCALEditableFieldActions's props
OSCALEditableFieldActions.defaultProps = {
  iconFontSize: "small",
};
