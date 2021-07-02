import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import ReplayIcon from "@material-ui/icons/Replay";

const useStyles = makeStyles((theme) => ({
  catalogForm: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(4),
  },
}));


export default function OSCALLoaderForm(props) {
  const classes = useStyles();

  return (
    <>
      <form
        className={classes.catalogForm}
        noValidate
        autoComplete="off"
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <Grid container spacing={3}>
          <Grid item xs={10}>
            <TextField
              id="oscal-url"
              label={`OSCAL ${props.oscalModelType} URL`}
              defaultValue={props.oscalUrl}
              helperText="(JSON Format)"
              variant="outlined"
              fullWidth
              onChange={props.onUrlChange}
            />
          </Grid>
          <Grid item xs={2}>
            <Button
              variant="contained"
              color="primary"
              endIcon={<ReplayIcon>send</ReplayIcon>}
              onClick={props.onReloadClick}
            >
              Reload
            </Button>
          </Grid>
        </Grid>
      </form>
    </>
  );
}
