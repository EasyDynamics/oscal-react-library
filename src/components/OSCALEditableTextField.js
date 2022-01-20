import React from "react";
import Typography from "@material-ui/core/Typography";
import { TextField } from "@material-ui/core";
import { getElementLabel } from "./OSCALModificationIcons";

export default function OSCALEditableTextField(props) {
  return props.modifiableData.isInEditState[0] ? (
    <Typography variant={props.textElement.typographyVariant}>
      <TextField
        inputProps={{
          "data-testid": `textField-${getElementLabel(props.editedField)}`,
        }}
        inputRef={props.modifiableData.ref}
        size={props.textElement.textFieldSize}
        variant={props.textElement.textFieldVariant}
      >
        {props.modifiableData.value}
      </TextField>
    </Typography>
  ) : (
    <Typography variant={props.textElement.typographyVariant}>
      {props.modifiableData.value}
    </Typography>
  );
}
