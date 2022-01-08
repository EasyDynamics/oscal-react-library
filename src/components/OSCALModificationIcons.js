import React from "react";
import CloseIcon from "@material-ui/icons/Close";
import EditIcon from "@material-ui/icons/Edit";
import SaveIcon from "@material-ui/icons/Save";
import { IconButton } from "@material-ui/core";

function getIconButtons(props) {
  return props.modifiableData.edit[0] ? (
    <>
      <IconButton
        onClick={() => {
          props.modifiableData.edit[1](!props.modifiableData.edit[0]);
        }}
      >
        <CloseIcon fontSize={props.iconFontSize} />
      </IconButton>
      <IconButton
        onClick={() => {
          props.modifiableData.edit[1](!props.modifiableData.edit[0]);
          props.onSave(
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
      onClick={() => {
        props.modifiableData.edit[1](!props.modifiableData.edit[0]);
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
