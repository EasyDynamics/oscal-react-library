import React from "react";
import CancelIcon from "@mui/icons-material/Cancel";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import { IconButton } from "@mui/material";
import StyledTooltip from "./OSCALStyledTooltip";
import { ReactElement } from "react-markdown/lib/react-markdown";

export function getElementLabel(editedField: any): string {
  return editedField.toString().replace(/,/g, "-");
}

interface EditableListItem {
  uuid: string;
  [key: string]: any;
}

/**
 * Updates an item in a json list.
 *
 * @example Updating resources[i].title
 *
 * @param list - List of json objects
 * @param uuid - UUID of the object to update
 * @param field - Field to update with new value
 * @param value - New json/string value
 *
 * @returns the updated json list
 */
export function updateListItem(
  list: EditableListItem[],
  uuid: string,
  field: string,
  value: EditableListItem
): EditableListItem[] {
  const updatedItem = list.find((item) => item.uuid === uuid);

  if (updatedItem) {
    updatedItem[field] = value;
  }

  return list;
}

export default function OSCALEditableFieldActions(props: any): ReactElement {
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
