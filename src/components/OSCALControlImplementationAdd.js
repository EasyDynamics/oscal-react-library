import React, { useState } from "react";
import Grid from "@material-ui/core/Grid";
import { Button, IconButton, makeStyles, TextField } from "@material-ui/core";
import CancelIcon from "@material-ui/icons/Cancel";
import SaveIcon from "@material-ui/icons/Save";
import { Autocomplete } from "@material-ui/lab";
import { v4 as uuidv4 } from "uuid";
import { getElementLabel } from "./OSCALEditableFieldActions";
import * as restUtils from "./oscal-utils/OSCALRestUtils";

const useStyles = makeStyles(() => ({
  contained: {
    "&.MuiButton-contained": {
      backgroundColor: "white",
    },
  },
}));

// calculates possible new controls
function getControlIdsAndTitles(controls, implementedControls) {
  const controlIdsAndTitles = {};
  controls
    .filter((control) => !implementedControls.includes(control.id))
    .forEach((control) => {
      const title = `${control.id.toUpperCase()} ${control.title}`;
      controlIdsAndTitles[title] = control.id;
    });
  return controlIdsAndTitles;
}

export default function OSCALControlImplementationAdd(props) {
  const [inEditState, setInEditState] = useState(false);
  const [newControl, setNewControl] = useState("");
  const classes = useStyles();

  const rootOscalObjectName = props.restData
    ? Object.keys(props.restData)[0]
    : null;
  const editedFieldContents = [rootOscalObjectName, "control-implementation"];
  const controlIdsAndTitles = getControlIdsAndTitles(
    props.controls,
    props.implementedControls
  );

  return inEditState ? (
    <Grid container xs={12} justifyContent="flex-end" alignItems="center">
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
          options={Object.keys(controlIdsAndTitles)}
          renderInput={(params) => (
            <TextField {...params} label="Select Control" />
          )}
        />
      </Grid>
      <Grid item>
        <IconButton
          aria-label="save-system-security-plan-control-implementation"
          onClick={() => {
            const implementationId = controlIdsAndTitles[newControl];
            const implementedRequirement = {
              "control-id": implementationId,
              uuid: uuidv4(),
              statements: [],
            };
            restUtils.createSspControlImplementationImplementedRequirement(
              props.partialRestData,
              implementedRequirement,
              () => {},
              props.onRestSuccess,
              props.onRestError
            );
            setInEditState(false);
          }}
        >
          <SaveIcon fontSize="small" />
        </IconButton>
        <IconButton
          aria-label="cancel-system-security-plan-control-implementation"
          onClick={() => setInEditState(false)}
        >
          <CancelIcon fontSize="small" />
        </IconButton>
      </Grid>
    </Grid>
  ) : (
    <Grid container justifyContent="flex-end" alignItems="center">
      <Button
        aria-label="add-system-security-plan-control-implementation"
        className={classes.contained}
        variant="contained"
        onClick={() => {
          setInEditState(true);
        }}
      >
        Add Control Implementation
      </Button>
    </Grid>
  );
}
