import React from "react";
import Typography from "@material-ui/core/Typography";
import { Grid, TextField } from "@material-ui/core";
import { getElementLabel } from "./OSCALEditableFieldActions";

function inEditStateTextField(props) {
  return (
    <Grid item xs={props.size} className={props.className}>
      <Typography>
        <TextField
          fullWidth
          inputProps={{
            "data-testid": `textField-${getElementLabel(props.editedField)}`,
          }}
          inputRef={props.reference}
          size={props.textElement.textFieldSize}
          defaultValue={props.value}
          variant={props.textElement.textFieldVariant}
        />
      </Typography>
    </Grid>
  );
}

export default function OSCALEditableTextField(props) {
  return props.isInEditState ? (
    inEditStateTextField(props)
  ) : (
    <Grid item className={props.className}>
      <Typography variant={props.textElement.typographyVariant}>
        {props.value}
      </Typography>
    </Grid>
  );
}
