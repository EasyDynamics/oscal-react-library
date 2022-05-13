import React, { useState } from "react";
import Grid from "@material-ui/core/Grid";
import { TextField } from "@material-ui/core";
import AddBoxIcon from "@material-ui/icons/AddBox";
import { Autocomplete } from "@material-ui/lab";
import OSCALEditableFieldActions, {
  getElementLabel,
} from "./OSCALEditableFieldActions";

// function to calculate possible new controls
function getControlIdsAndTitles(controls, implementedControls) {
  return controls
    .filter(
      (control) =>
        !implementedControls.find(
          (implementedControl) => implementedControl === control.id
        )
    )
    .map((control) => `${control.id.toUpperCase()} ${control.title}`);
}

export default function OSCALControlImplementationAdd(props) {
  const [addingNewImplementation, setAddingNewImplementation] = useState(false);
  const [newControl, setNewControl] = useState("");
  const editIcon = <AddBoxIcon />;

  const rootOscalObjectName = props.restData
    ? Object.keys(props.restData)[0]
    : null;
  const editedFieldContents = [rootOscalObjectName, "control-implementations"];

  return (
    <Grid container xs={12} justifyContent="flex-start" alignItems="center">
      {addingNewImplementation ? (
        <Grid item xs={6}>
          <Autocomplete
            disablePortal
            fullWidth
            aria-label={`autocomplete-${getElementLabel(editedFieldContents)}`}
            onChange={(event) => {
              setNewControl(event.target.textContent);
            }}
            onInputChange={(event) => {
              setNewControl(event.target.textContent);
            }}
            options={getControlIdsAndTitles(
              props.controls,
              props.implementedControls
            )}
            renderInput={(params) => (
              <TextField {...params} label="Select Control" />
            )}
          />
        </Grid>
      ) : null}
      <Grid item>
        <OSCALEditableFieldActions
          editedField={editedFieldContents}
          editIcon={editIcon}
          inEditState={addingNewImplementation}
          onFieldSave={(restData, editedField, value) => {
            props.onFieldSave(restData, editedField, value);
          }}
          restData={props.restData}
          setInEditState={setAddingNewImplementation}
          value={newControl}
        />
      </Grid>
    </Grid>
  );
}
