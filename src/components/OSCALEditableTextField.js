import React, { useRef, useState } from "react";
import Typography from "@mui/material/Typography";
import { Grid, TextField } from "@mui/material";
import OSCALEditableFieldActions, {
  getElementLabel,
} from "./OSCALEditableFieldActions";
import { StaticDatePicker } from "@mui/lab";

function textFieldWithEditableActions(
  props,
  reference,
  inEditState,
  setInEditState
) {
  if (inEditState) {
    return (
      <>
        <Grid item xs={props.size} className={props.className}>
          <Typography>
            <TextField
              fullWidth
              inputProps={{
                "data-testid": `textField-${getElementLabel(
                  props.editedField
                )}`,
              }}
              inputRef={reference}
              size={props.textFieldSize}
              defaultValue={props.value} 
              variant={props.textFieldVariant}
              onKeyDown={(event) => {
                if (event.key === "Escape") {
                  setInEditState(false);
                }
                else if(event.key === "Enter"){
                  props.onFieldSave(
                   props.appendToLastFieldInPath,
                   props.partialRestData,
                   props.editedField,
                   reference.current.value
                  );
                   setInEditState(false);
             
              }
            }}/>
          </Typography>
        </Grid>
        <Grid item>
          <OSCALEditableFieldActions
            appendToLastFieldInPath={props.appendToLastFieldInPath}
            inEditState={inEditState}
            editedField={props.editedField}
            setInEditState={setInEditState}
            onCancel={props.onCancel}
            onFieldSave={props.onFieldSave}
            partialRestData={props.partialRestData}
            reference={reference}
          />
        </Grid>
      </>
    );
  }

  return (
    <>
      <Typography display="inline" variant={props.typographyVariant}>
        {props.value}
      </Typography>
      <OSCALEditableFieldActions
        editedField={props.editedField}
        inEditState={inEditState}
        partialRestData={props.partialRestData}
        setInEditState={setInEditState}
      />
    </>
  );
}

export default function OSCALEditableTextField(props) {
  const reference = useRef("reference to text field");
  const [inEditState, setInEditState] = useState(props.inEditState);

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
