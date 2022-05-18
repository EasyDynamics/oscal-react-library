import React, { useState } from "react";
import Grid from "@material-ui/core/Grid";
import { TextField } from "@material-ui/core";
import AddBoxIcon from "@material-ui/icons/AddBox";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import SaveIcon from "@material-ui/icons/Save";
import { Autocomplete } from "@material-ui/lab";
import { v4 as uuidv4 } from "uuid";
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
  const [inEditState, setInEditState] = useState(false);
  const [inSaveMode, setInSaveMode] = useState(true);
  const [newControl, setNewControl] = useState("");
  const editIcon = <AddBoxIcon />;
  const continueIcon = <CheckCircleIcon fontSize="small" />;
  const saveIcon = <SaveIcon fontSize="small" />;
  const [saveIconButton, setSaveIconButton] = useState(continueIcon);

  const rootOscalObjectName = props.restData
    ? Object.keys(props.restData)[0]
    : null;
  const editedFieldContents = [rootOscalObjectName, "control-implementations"];

  return (
    <Grid container xs={12} justifyContent="flex-start" alignItems="center">
      {!inSaveMode ? (
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
          inEditState={inEditState}
          onCancel={() => {
            setSaveIconButton(continueIcon);
            setNewControl("");
            setInSaveMode(true);
            setInEditState(false);
            props.setImplementedRequirements(props.oldImplementedRequirements);
          }}
          onFieldSave={() => {
            if (!inSaveMode) {
              setSaveIconButton(saveIcon);
              const implementationId = newControl.substring(0, 4).toLowerCase();
              const implementedRequirement = {
                "control-id": implementationId,
                uuid: uuidv4(),
                statements: [],
              };
              props.setImplementedRequirements(
                props.implementedRequirements.concat([implementedRequirement])
              );
            } else {
              setInEditState(false);
              setInSaveMode(true);
            }
          }}
          restData={props.restData}
          saveIcon={saveIconButton}
          saveMode={inSaveMode}
          setSaveMode={setInSaveMode}
          setInEditState={setInEditState}
          value={newControl}
        />
      </Grid>
    </Grid>
  );
}
