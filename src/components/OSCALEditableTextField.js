import React from "react";
import Typography from "@material-ui/core/Typography";
import { TextField } from "@material-ui/core";
import { getElementLabel } from "./OSCALModificationIcons";

export default function OSCALEditableTextField(props) {
  return props.modifiableData.edit[0] ? (
    <Typography variant={props.modifiableData.typographyVariant}>
      <TextField
        inputProps={{
          "data-testid": `textField-${getElementLabel(props.editedField)}`,
        }}
        inputRef={props.modifiableData.ref}
        size={props.textFieldSize}
        variant={props.textFieldVariant}
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
