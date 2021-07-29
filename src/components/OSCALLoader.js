import React, { useState, useEffect, useRef } from "react";
import Alert from "@material-ui/lab/Alert";
import CircularProgress from "@material-ui/core/CircularProgress";
import OSCALSsp from "./OSCALSsp";
import OSCALCatalog from "./OSCALCatalog";
import OSCALComponentDefinition from "./OSCALComponentDefinition";
import OSCALProfile from "./OSCALProfile";
import OSCALLoaderForm from "./OSCALLoaderForm";

const onError = (error) => (
  <Alert severity="error">
    Yikes! Something went wrong loading the OSCAL data. Sorry, we&apos;ll look
    into it. ({error.message})
  </Alert>
);

const defaultOscalCatalogUrl =
  "https://raw.githubusercontent.com/usnistgov/oscal-content/master/nist.gov/SP800-53/rev5/json/NIST_SP-800-53_rev5_catalog.json";

const defaultOSCALComponentUrl =
  "https://raw.githubusercontent.com/EasyDynamics/oscal-content/manual-fix-of-component-paths/examples/component-definition/json/example-component.json";

const defaultOSCALProfileUrl =
  "https://raw.githubusercontent.com/usnistgov/oscal-content/master/nist.gov/SP800-53/rev4/json/NIST_SP-800-53_rev4_MODERATE-baseline_profile.json";

const defaultOscalSspUrl =
  "https://raw.githubusercontent.com/usnistgov/oscal-content/master/examples/ssp/json/ssp-example.json";

export default function OSCALLoader(props) {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [oscalData, setOscalData] = useState([]);
  const [oscalUrl, setOscalUrl] = useState(props.oscalUrl);
  const unmounted = useRef(false);

  const loadOscalData = (newOscalUrl) => {
    fetch(newOscalUrl)
      .then((res) => res.json())
      .then(
        (result) => {
          if (!unmounted.current) {
            setOscalData(result);
            setIsLoaded(true);
            setError(null);
          }
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (e) => {
          setError(e);
          setIsLoaded(true);
        }
      );
  };

  const handleChange = (event) => {
    setOscalUrl(event.target.value);
  };

  const handleReloadClick = () => {
    setIsLoaded(false);
    loadOscalData(oscalUrl);
  };

  // Note: the empty deps array [] means
  // this useEffect will run once
  // similar to componentDidMount()
  useEffect(() => {
    loadOscalData(oscalUrl);

    return () => {
      unmounted.current = true;
    };
  }, []);

  let form;
  if (props.renderForm) {
    form = (
      <OSCALLoaderForm
        oscalModelType={props.oscalModelType}
        oscalUrl={oscalUrl}
        onUrlChange={handleChange}
        onReloadClick={handleReloadClick}
      />
    );
  }

  let result;
  if (error) {
    result = onError(error);
  } else if (!isLoaded) {
    result = <CircularProgress />;
  } else {
    result = props.renderer(oscalData, oscalUrl);
  }

  return (
    <>
      {form}
      {result}
    </>
  );
}

export function getRequestedUrl() {
  // Returns url parameter provided by the browser url, if
  //  it exists. If the url parameter exists, we want to
  //  override the default viewer url.
  return new URLSearchParams(window.location.search).get("url");
}

export function OSCALCatalogLoader(props) {
  const renderer = (oscalData, oscalUrl) => (
    <OSCALCatalog
      catalog={oscalData.catalog}
      parentUrl={oscalUrl}
      onError={onError}
    />
  );
  return (
    <OSCALLoader
      oscalModelType="Catalog"
      oscalUrl={getRequestedUrl() || defaultOscalCatalogUrl}
      renderer={renderer}
      renderForm={props.renderForm}
    />
  );
}

export function OSCALSSPLoader(props) {
  const renderer = (oscalData, oscalUrl) => (
    <OSCALSsp
      system-security-plan={oscalData["system-security-plan"]}
      parentUrl={oscalUrl}
      onError={onError}
    />
  );
  return (
    <OSCALLoader
      oscalModelType="SSP"
      oscalUrl={getRequestedUrl() || defaultOscalSspUrl}
      renderer={renderer}
      renderForm={props.renderForm}
    />
  );
}

export function OSCALComponentLoader(props) {
  const renderer = (oscalData, oscalUrl) => (
    <OSCALComponentDefinition
      componentDefinition={oscalData["component-definition"]}
      parentUrl={oscalUrl}
      onError={onError}
    />
  );
  return (
    <OSCALLoader
      oscalModelType="Component"
      oscalUrl={getRequestedUrl() || defaultOSCALComponentUrl}
      renderer={renderer}
      renderForm={props.renderForm}
    />
  );
}
export function OSCALProfileLoader(props) {
  const renderer = (oscalData, oscalUrl) => (
    <OSCALProfile profile={oscalData.profile} parentUrl={oscalUrl} />
  );
  return (
    <OSCALLoader
      oscalModelType="Profile"
      oscalUrl={getRequestedUrl() || defaultOSCALProfileUrl}
      renderer={renderer}
      renderForm={props.renderForm}
    />
  );
}
