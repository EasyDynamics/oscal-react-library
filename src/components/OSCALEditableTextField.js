import React from "react";
import Typography from "@material-ui/core/Typography";
import { TextField } from "@material-ui/core";
import { getElementLabel } from "./OSCALEditableFieldActions";

export default function OSCALEditableTextField(props) {
  return props.isInEditState ? (
    <Typography variant={props.textElement.typographyVariant}>
      <TextField
        inputProps={{
          "data-testid": `textField-${getElementLabel(props.editedField)}`,
        }}
        inputRef={props.reference}
        size={props.textElement.textFieldSize}
        defaultValue={props.value}
        variant={props.textElement.textFieldVariant}
      />
    </Typography>
  ) : (
    <Typography variant={props.textElement.typographyVariant}>
      {props.value}
    </Typography>
  );
}
