import React, { useState, useEffect, useRef } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Button from "@material-ui/core/Button";
import ReplayIcon from "@material-ui/icons/Replay";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import Switch from "@material-ui/core/Switch";
import FormControlLabel from "@material-ui/core/FormControlLabel";

const useStyles = makeStyles((theme) => ({
  catalogForm: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(4),
  },
}));

export default function OSCALLoaderForm(props) {
  const classes = useStyles();
  const [oscalObjects, setOscalObjects] = useState([]);
  const unmounted = useRef(false);

  const findAllObjects = () => {
    fetch(
      `${process.env.REACT_APP_REST_BASE_URL}/${props.oscalObjectType.restPath}`
    )
      .then((response) => {
        if (!response.ok) throw new Error(response.status);
        else return response.json();
      })
      .then(
        (result) => {
          if (!unmounted.current) {
            setOscalObjects(result);
          }
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (e) => {
          props.onError(e);
        }
      );
  };

  useEffect(() => {
    findAllObjects();
    return () => {
      unmounted.current = true;
    };
  }, []);

  return (
    <form
      className={classes.catalogForm}
      noValidate
      autoComplete="off"
      onSubmit={(e) => {
        e.preventDefault();
      }}
    >
      <Grid container spacing={3}>
        {process.env.REACT_APP_REST_BASE_URL && (
          <>
            <Grid item xs={10} />
            <Grid item xs={2}>
              <FormControlLabel
                control={
                  <Switch
                    checked={props.isRestMode}
                    color="primary"
                    onChange={props.onChangeRestMode}
                    name="isRestMode"
                  />
                }
                label="REST Mode"
              />
            </Grid>
          </>
        )}
        {!props.isRestMode ? (
          <>
            <Grid item xs={10}>
              <TextField
                id="oscal-url"
                label={`OSCAL ${props.oscalObjectType.name} URL`}
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
                disabled={!props.isResolutionComplete}
              >
                Reload
              </Button>
            </Grid>
          </>
        ) : (
          <Grid item xs={10}>
            <FormControl fullWidth variant="outlined">
              <InputLabel id="oscal-object-select-label">
                Select OSCAL {props.oscalObjectType.name}
              </InputLabel>
              <Select
                labelId="oscal-object-select-label"
                id="oscal-object-simple-select"
                label={`Select OSCAL ${props.oscalObjectType.name}`}
                onChange={props.onUuidChange}
              >
                {oscalObjects &&
                  oscalObjects.map((oscalObject) => (
                    <MenuItem
                      value={
                        oscalObject[props.oscalObjectType.jsonRootName].uuid
                      }
                    >
                      {
                        oscalObject[props.oscalObjectType.jsonRootName].metadata
                          .title
                      }
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </Grid>
        )}
      </Grid>
    </form>
  );
}
