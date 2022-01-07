import React from "react";
import Typography from "@material-ui/core/Typography";
import { TextField } from "@material-ui/core";

export default function OSCALEditableTextField(props) {
  return props.modifiableData.edit[0] ? (
    <Typography variant={props.modifiableData.typographyVariant}>
      <TextField
        size={props.textFieldSize}
        variant={props.textFieldVariant}
        inputRef={props.modifiableData.ref}
      >
        {props.modifiableData.value}
      </TextField>
    </Typography>
  ) : (
    <Typography variant={props.modifiableData.typographyVariant}>
      {props.modifiableData.value}
    </Typography>
  );
}

// Default values for some of this OSCALEditableTextField's props
OSCALEditableTextField.defaultProps = {
  textFieldSize: "medium",
  textFieldVariant: "outlined",
};
