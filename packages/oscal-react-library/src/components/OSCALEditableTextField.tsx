import React from "react";
import Typography from "@mui/material/Typography";
import { TypographyVariant } from "@mui/material";

interface EditableTextFieldProps {
  /**
   * The value of the field that is being changed.
   *
   * @example resource.title
   */
  value?: string;
  /**
   * The variant of the non editable Typography
   */
  typographyVariant?: TypographyVariant;
}

export default function OSCALEditableTextField(props: EditableTextFieldProps) {
  return <Typography variant={props.typographyVariant}>{props.value}</Typography>;
}

OSCALEditableTextField.defaultProps = {
  textFieldVariant: "outlined",
};
