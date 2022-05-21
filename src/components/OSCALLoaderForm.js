import React, { useState, useEffect, useRef } from "react";
import makeStyles from "@mui/styles/makeStyles";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import ReplayIcon from "@mui/icons-material/Replay";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";

const useStyles = makeStyles((theme) => ({
  catalogForm: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(2),
  },
}));

export default function OSCALLoaderForm(props) {
  const classes = useStyles();
  const [oscalObjects, setOscalObjects] = useState([]);
  const unmounted = useRef(false);

  const findAllObjects = () => {
    fetch(`${props.backendUrl}/${props.oscalObjectType.restPath}`)
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
    if (props.isRestMode) findAllObjects();
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
        {!props.isRestMode ? (
          <>
            <Grid item xs={6} md={9}>
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
            <Grid item xs={4} md={2}>
              <Button
                variant="contained"
                size="large"
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
          <Grid item xs={10} md={11}>
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
        {props.backendUrl && (
          <Grid item xs={2} md={1}>
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
        )}
      </Grid>
    </form>
  );
}
