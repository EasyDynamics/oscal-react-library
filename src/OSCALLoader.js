import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Alert from "@material-ui/lab/Alert";
import CircularProgress from "@material-ui/core/CircularProgress";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import ReplayIcon from "@material-ui/icons/Replay";
import OSCALSsp from "./OSCALSsp";
import OSCALCatalog from "./OSCALCatalog";
import OSCALComponentDefinition from "./OSCALComponentDefinition";
import OSCALProfile from "./OSCALProfile";

const useStyles = makeStyles((theme) => ({
  catalogForm: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(4),
  },
}));

const defaultOscalCatalogUrl =
  "https://raw.githubusercontent.com/usnistgov/oscal-content/master/nist.gov/SP800-53/rev5/json/NIST_SP-800-53_rev5_catalog.json";
const defaultOscalSspUrl =
  "https://raw.githubusercontent.com/usnistgov/oscal-content/master/examples/ssp/json/ssp-example.json";
const defaultOSCALComponentUrl =
  "https://raw.githubusercontent.com/usnistgov/oscal-content/master/examples/component-definition/json/example-component.json";
const defaultOSCALProfileUrl =
  "https://raw.githubusercontent.com/usnistgov/oscal-content/master/nist.gov/SP800-53/rev4/json/NIST_SP-800-53_rev4_MODERATE-baseline_profile.json";

export default function OSCALLoader(props) {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [oscalData, setOscalData] = useState([]);
  const [oscalUrl, setOscalUrl] = useState(props.oscalUrl);

  const classes = useStyles();

  const loadOscalData = (newOscalUrl) => {
    fetch(newOscalUrl)
      .then((res) => res.json())
      .then(
        (result) => {
          setOscalData(result);
          setIsLoaded(true);
          setError(null);
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          setError(error);
          setIsLoaded(true);
        }
      );
  };

  const handleChange = (event) => {
    setOscalUrl(event.target.value);
  };

  const handleReloadClick = (event) => {
    loadOscalData(oscalUrl);
  };

  // Note: the empty deps array [] means
  // this useEffect will run once
  // similar to componentDidMount()
  useEffect(() => {
    loadOscalData(oscalUrl);
    // eslint-disable-next-line
  }, []);

  let result;

  if (error) {
    result = (
      <Alert severity="error">
        Yikes! Something went wrong loading the OSCAL data. Sorry, we&apos;ll
        look into it. ({error.message})
      </Alert>
    );
  } else if (!isLoaded) {
    result = <CircularProgress />;
  } else {
    result = props.renderer(oscalData, oscalUrl);
  }
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
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={2}>
            <Button
              variant="contained"
              color="primary"
              endIcon={<ReplayIcon>send</ReplayIcon>}
              onClick={handleReloadClick}
            >
              Reload
            </Button>
          </Grid>
        </Grid>
      </form>
      {result}
    </>
  );
}

export function OSCALCatalogLoader(props) {
  const renderer = (oscalData, oscalUrl) => (
    <OSCALCatalog catalog={oscalData.catalog} />
  );
  return (
    <OSCALLoader
      oscalModelType="Catalog"
      oscalUrl={defaultOscalCatalogUrl}
      renderer={renderer}
    />
  );
}

export function OSCALSSPLoader(props) {
  const renderer = (oscalData, oscalUrl) => (
    <OSCALSsp
      system-security-plan={oscalData["system-security-plan"]}
      parentUrl={oscalUrl}
    />
  );
  return (
    <OSCALLoader
      oscalModelType="SSP"
      oscalUrl={defaultOscalSspUrl}
      renderer={renderer}
    />
  );
}

export function OSCALComponentLoader(props) {
  const renderer = (oscalData, oscalUrl) => (
    <OSCALComponentDefinition
      componentDefinition={oscalData["component-definition"]}
      parentUrl={oscalUrl}
    />
  );
  return (
    <OSCALLoader
      oscalModelType="Component"
      oscalUrl={defaultOSCALComponentUrl}
      renderer={renderer}
    />
  );
}
/* eslint-disable */
export function OSCALProfileLoader(props) {
  const renderer = (oscalData, oscalUrl) => (
    <OSCALProfile
      profile={oscalData["profile"]}
      parentUrl={oscalUrl}
    />
  );
  return (
    <OSCALLoader
      oscalModelType="Profile"
      oscalUrl={defaultOSCALProfileUrl}
      renderer={renderer}
    />
  );
}