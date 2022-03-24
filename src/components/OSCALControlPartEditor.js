import React, { useRef } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Popover from "@material-ui/core/Popover";
import { Grid, TextField } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import OSCALEditableFieldActions from "./OSCALEditableFieldActions";

const useStyles = makeStyles((theme) => ({
  ControlProseEditor: {
    padding: theme.spacing(2),
    width: 500,
  },
}));

export default function OSCALControlPartEditor(props) {
  const classes = useStyles();
  const implementationReference = useRef("Reference to control implementation");
  const descriptionReference = useRef("Reference to control description");

  return (
    <Popover
      open={props.anchorEl}
      onClose={() => {
        props.setAnchorEl(null);
      }}
      anchorEl={props.anchorEl}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "center",
      }}
    >
      <Grid container className={classes.ControlProseEditor} xs={12}>
        <Typography variant="h6">
          Implementation of Statement &apos;{props.statementId}&apos; for
          Control &apos;{props.controlId}&apos;
        </Typography>
        <Grid container xs={12}>
          {props.isUserDefinedImplementation ? (
            <>
              <Grid item xs={3}>
                <Typography>Parameter Values: </Typography>
              </Grid>
              <Grid item xs={9}>
                <TextField
                  fullWidth
                  defaultValue={
                    props.statementByComponent?.[
                      "set-parameters"
                    ]?.[0]?.values.toString() || "Enter Implementation"
                  }
                  inputProps={{
                    "data-testid": "Popover Implementation TextField",
                  }}
                  inputRef={implementationReference}
                />
              </Grid>
            </>
          ) : null}
        </Grid>
        <Grid container xs={12}>
          <Grid item xs={3}>
            <Typography>Description: </Typography>
          </Grid>
          <Grid item xs={9}>
            <TextField
              fullWidth
              multiline
              inputProps={{
                "data-testid": "Popover Description TextField",
              }}
              inputRef={descriptionReference}
              defaultValue={
                props.statementByComponent?.description || "Enter Description"
              }
            />
          </Grid>
        </Grid>
        <Grid container xs={12} justifyContent="flex-end">
          <OSCALEditableFieldActions
            inEditState
            editedFieldPath="statement-statement-id-by-components-component-uuid-description/values"
            onCancel={props.onCancel}
            onFieldSave={() => {
              props.onFieldSave(descriptionReference, implementationReference);
            }}
            update={props.update}
          />
        </Grid>
      </Grid>
    </Popover>
  );
}
