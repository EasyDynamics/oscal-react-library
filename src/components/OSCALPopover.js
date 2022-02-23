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

export default function OSCALPopover(props) {
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
          Editing control {props.controlId}, statement {props.statementId}
        </Typography>
        <Grid container xs={12}>
          {props.statementByComponent["set-parameters"] ? (
            <>
              <Grid item xs={3}>
                <Typography>Implementation: </Typography>
              </Grid>
              <Grid item xs={9}>
                <TextField
                  fullWidth
                  defaultValue={props.statementByComponent[
                    "set-parameters"
                  ][0].values.toString()}
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
              inputRef={descriptionReference}
              defaultValue={props.statementByComponent.description}
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
