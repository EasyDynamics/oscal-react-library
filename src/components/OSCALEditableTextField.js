import React from "react";
import Typography from "@material-ui/core/Typography";
import { TextField } from "@material-ui/core";

export default function OSCALEditableTextField(props) {
  return props.editedField.edit[0] ? (
    <Typography variant={props.editedField.typographyVariant}>
      <TextField
        size={props.textFieldSize}
        variant={props.textFieldVariant}
        inputRef={props.editedField.ref}
      >
        {props.editedField.value[0]}
      </TextField>
    </Typography>
  ) : (
    <Typography variant={props.editedField.typographyVariant}>
      {props.editedField.value[0]}
    </Typography>
  );
}

// Default values for some of this OSCALEditableTextField's props
OSCALEditableTextField.defaultProps = {
  textFieldSize: "medium",
  textFieldVariant: "outlined",
};
