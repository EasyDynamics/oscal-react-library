import React, { useRef, useState } from "react";
import Typography from "@material-ui/core/Typography";
import { Grid, TextField } from "@material-ui/core";
import OSCALEditableFieldActions, {
  getElementLabel,
} from "./OSCALEditableFieldActions";

function textFieldWithEditableActions(
  props,
  reference,
  inEditState,
  setInEditState
) {
  return inEditState ? (
    <>
      <Typography display="inline" variant={props.typographyVariant}>
        <TextField
          inputProps={{
            "data-testid": `textField-${getElementLabel(props.editedField)}`,
          }}
          inputRef={reference}
          size={props.textFieldSize}
          defaultValue={props.defaultValue}
          variant={props.textFieldVariant}
        />
      </Typography>
      <OSCALEditableFieldActions
        appendToLastFieldInPath={props.appendToLastFieldInPath}
        inEditState={inEditState}
        editedField={props.editedField}
        setInEditState={setInEditState}
        onFieldSave={props.onFieldSave}
        patchData={props.patchData}
        reference={reference}
        update={props.update}
      />
    </>
  ) : (
    <>
      <Typography display="inline" variant={props.typographyVariant}>
        {props.value}
      </Typography>
      <OSCALEditableFieldActions
        editedField={props.editedField}
        inEditState={inEditState}
        patchData={props.patchData}
        setInEditState={setInEditState}
      />
    </>
  );
}

export default function OSCALEditableTextField(props) {
  const reference = useRef("reference to text field");
  const [inEditState, setInEditState] = useState(false);

  return props.canEdit ? (
    textFieldWithEditableActions(props, reference, inEditState, setInEditState)
  ) : (
    <Grid item className={props.className}>
      <Typography variant={props.typographyVariant}>{props.value}</Typography>
    </Grid>
  );
}

OSCALEditableTextField.defaultProps = {
  textFieldVariant: "outlined",
};
