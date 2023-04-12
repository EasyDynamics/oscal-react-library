import React from "react";
import CancelIcon from "@mui/icons-material/Cancel";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import { IconButton } from "@mui/material";
import StyledTooltip from "./OSCALStyledTooltip";

export function getElementLabel(editedField) {
  return editedField.toString().replace(/,/g, "-");
}

export function updateListItem(list, uuid, field, value) {
  const updatedItem = list.find((item) => item.uuid === uuid);
  updatedItem[field] = value;
  return list;
}

export default function OSCALEditableFieldActions(props) {
  return props.inEditState ? (
    <>
      <StyledTooltip title="Save">
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
                props.editedValueId
                  ? updateListItem(
                      props.editedValue,
                      props.editedValueId,
                      props.fieldName,
                      props.reference.current.value
                    )
                  : props.reference.current.value
              );
            } else {
              props.onFieldSave();
            }

            if (props.setInEditState) {
              props.setInEditState(!props.inEditState);
            }

            if (props.onCancel) {
              props.onCancel();
            }
          }}
          size="large"
        >
          <SaveIcon fontSize={props.iconFontSize} />
        </IconButton>
      </StyledTooltip>
      <StyledTooltip title="Cancel">
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
          size="large"
        >
          <CancelIcon fontSize={props.iconFontSize} />
        </IconButton>
      </StyledTooltip>
    </>
  ) : (
    <StyledTooltip title="Edit">
      <IconButton
        aria-label={
          props.editedField
            ? `edit-${getElementLabel(props.editedField)}`
            : `edit-${props.editedFieldPath}`
        }
        onClick={() => {
          props.setInEditState(!props.inEditState);
        }}
        size="large"
      >
        <EditIcon fontSize={props.iconFontSize} />
      </IconButton>
    </StyledTooltip>
  );
}

// Default values for some of this OSCALEditableFieldActions's props
OSCALEditableFieldActions.defaultProps = {
  iconFontSize: "small",
};
