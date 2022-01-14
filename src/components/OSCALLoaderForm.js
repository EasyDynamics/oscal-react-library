import React, { useState, useEffect, useRef } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Button from "@material-ui/core/Button";
import ReplayIcon from "@material-ui/icons/Replay";
import Select from '@material-ui/core/Select';

const useStyles = makeStyles((theme) => ({
  catalogForm: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(4),
  },
}));

export default function OSCALLoaderForm(props) {
  const classes = useStyles();
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [oscalObjects, setOscalObjects] = useState([]);
  const unmounted = useRef(false);

  const findAllObjects = () => {
    // fetch(process.env.REACT_APP_REST_BASE_URL + "/" +
    //     props.oscalObjectType.restPath)
    //   .then((res) => res.json())
    //   .then(
    //     (result) => {
    //       if (!unmounted.current) {
    //         setOscalObjects(result);
    //         setIsLoaded(true);
    //         setError(null);
    //       }
    //     },
    //     // Note: it's important to handle errors here
    //     // instead of a catch() block so that we don't swallow
    //     // exceptions from actual bugs in components.
    //     (e) => {
    //       setError(e);
    //       setIsLoaded(true);
    //     }
    //   );

    // Set dummy data until backend REST call is implemented, real code above
    if (!unmounted.current) {
      setOscalObjects(
        [
          { "catalog":
            {
              "uuid": "613fca2d-704a-42e7-8e2b-b206fb92b456",
              "metadata": {
                "title": "Catalog 1234"
              }
            }
          }
        ]
      );
      setIsLoaded(true);
      setError(null);
    }
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
        {!process.env.REACT_APP_REST_BASE_URL ? (
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
          <Grid item xs={12}>
            <InputLabel id="oscal-object-select-label">Oscal {props.oscalObjectType.name}</InputLabel>
            <Select
              labelId="oscal-object-select-label"
              id="oscal-object-simple-select"
              label={`Oscal ${props.oscalObjectType.name}`}
              onChange={props.onUuidChange}
            >
            {oscalObjects &&
              oscalObjects.map((oscalObject, index) => (
                <MenuItem value={oscalObject[props.oscalObjectType.jsonRootName].uuid}>
                  {oscalObject[props.oscalObjectType.jsonRootName].metadata.title}
                </MenuItem>
            ))}
            </Select>
          </Grid>
        )}
      </Grid>
    </form>
  );
}
