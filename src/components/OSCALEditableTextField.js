import React, { useRef, useState } from "react";
import Typography from "@material-ui/core/Typography";
import { Grid, TextField } from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import SaveIcon from "@material-ui/icons/Save";
import OSCALEditableFieldActions, {
  getElementLabel,
} from "./OSCALEditableFieldActions";

function textFieldWithEditableActions(
  props,
  reference,
  inEditState,
  setInEditState
) {
  const saveIcon = <SaveIcon fontSize="small" />;
  const editIcon = <EditIcon fontSize="small" />;

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
            />
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
            editIcon={editIcon}
            saveIcon={saveIcon}
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
        editIcon={editIcon}
        saveIcon={saveIcon}
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
