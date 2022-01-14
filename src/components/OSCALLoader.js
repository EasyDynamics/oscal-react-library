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

const oscalObjectTypes = {
  "catalog": {
    "name": "Catalog",
    "defaultUrl": "https://raw.githubusercontent.com/usnistgov/oscal-content/master/nist.gov/SP800-53/rev5/json/NIST_SP-800-53_rev5_catalog.json",
    "jsonRootName": "catalog",
    "restPath": "catalogs"
  },
  "component": {
    "name": "Component",
    "defaultUrl": "https://raw.githubusercontent.com/EasyDynamics/oscal-content/manual-fix-of-component-paths/examples/component-definition/json/example-component.json",
    "jsonRootName": "component-definition",
    "restPath": "component-definitions"
  },
  "profile": {
    "name": "Profile",
    "defaultUrl": "https://raw.githubusercontent.com/usnistgov/oscal-content/master/nist.gov/SP800-53/rev4/json/NIST_SP-800-53_rev4_MODERATE-baseline_profile.json",
    "jsonRootName": "profile",
    "restPath": "profiles"
  },
  "ssp": {
    "name": "SSP",
    "defaultUrl": "https://raw.githubusercontent.com/usnistgov/oscal-content/master/examples/ssp/json/ssp-example.json",
    "jsonRootName": "system-security-plan",
    "restPath": "ssps"
  }
}

export default function OSCALLoader(props) {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isResolutionComplete, setIsResolutionComplete] = useState(false);
  const [oscalData, setOscalData] = useState([]);
  const [oscalUrl, setOscalUrl] = useState(props.oscalUrl);
  const unmounted = useRef(false);

  const loadOscalData = (newOscalUrl) => {
    if (newOscalUrl) {
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
    } else {
      setIsLoaded(true);
    }
  };

  const handleUrlChange = (event) => {
    setOscalUrl(event.target.value);
  };

  const handleUuidChange = (event) => {
    const newOscalUrl = process.env.REACT_APP_REST_BASE_URL + "/" +
      props.oscalObjectType.restPath + "/" + event.target.value;
    setOscalUrl(newOscalUrl);
    setIsLoaded(false);
    setIsResolutionComplete(false);
    loadOscalData(newOscalUrl);
  };

  const handleReloadClick = () => {
    // Only reload if we're done loading
    if (isLoaded && isResolutionComplete) {
      setIsLoaded(false);
      setIsResolutionComplete(false);
      loadOscalData(oscalUrl);
    }
  };

  const onResolutionComplete = () => {
    setIsResolutionComplete(true);
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
        oscalObjectType={props.oscalObjectType}
        oscalUrl={oscalUrl}
        onUrlChange={handleUrlChange}
        onUuidChange={handleUuidChange}
        onReloadClick={handleReloadClick}
        isResolutionComplete={isResolutionComplete}
      />
    );
  }

  let result;
  if (error) {
    result = onError(error);
  } else if (!isLoaded) {
    result = <CircularProgress />;
  } else {
    if (oscalUrl) {
      result = props.renderer(oscalData, oscalUrl, onResolutionComplete);
    }
  }

  return (
    <>
      {form}
      {result}
    </>
  );
}

/**
 * Returns url parameter provided by the browser url, if it exists. If the url
 * parameter exists, we want to override the default viewer url.
 *
 * @returns The url parameter of the browser url, or null if it doesn't exist
 */
export function getRequestedUrl() {
  return new URLSearchParams(window.location.search).get("url");
}

export function isRestMode() {
  return process.env.REACT_APP_REST_BASE_URL;
}

export function OSCALCatalogLoader(props) {
  const oscalObjectType = oscalObjectTypes.catalog;
  const renderer = (oscalData, oscalUrl, onResolutionComplete) => (
    <OSCALCatalog
      catalog={oscalData[oscalObjectType.jsonRootName]}
      parentUrl={oscalUrl}
      onError={onError}
      onResolutionComplete={onResolutionComplete}
    />
  );
  return (
    <OSCALLoader
      oscalObjectType={oscalObjectType}
      oscalUrl={!isRestMode() && (getRequestedUrl() || oscalObjectType.defaultUrl)}
      renderer={renderer}
      renderForm={props.renderForm}
    />
  );
}

export function OSCALSSPLoader(props) {
  const oscalObjectType = oscalObjectTypes.ssp;
  const renderer = (oscalData, oscalUrl, onResolutionComplete) => (
    <OSCALSsp
      system-security-plan={oscalData[oscalObjectType.jsonRootName]}
      parentUrl={oscalUrl}
      onError={onError}
      onResolutionComplete={onResolutionComplete}
    />
  );
  return (
    <OSCALLoader
      oscalObjectType={oscalObjectType}
      oscalUrl={!isRestMode() && (getRequestedUrl() || oscalObjectType.defaultUrl)}
      renderer={renderer}
      renderForm={props.renderForm}
    />
  );
}

export function OSCALComponentLoader(props) {
  const oscalObjectType = oscalObjectTypes.component;
  const renderer = (oscalData, oscalUrl, onResolutionComplete) => (
    <OSCALComponentDefinition
      componentDefinition={oscalData[oscalObjectType.jsonRootName]}
      parentUrl={oscalUrl}
      onError={onError}
      onResolutionComplete={onResolutionComplete}
    />
  );
  return (
    <OSCALLoader
      oscalObjectType={oscalObjectType}
      oscalUrl={!isRestMode() && (getRequestedUrl() || oscalObjectType.defaultUrl)}
      renderer={renderer}
      renderForm={props.renderForm}
    />
  );
}
export function OSCALProfileLoader(props) {
  const oscalObjectType = oscalObjectTypes.profile;
  const renderer = (oscalData, oscalUrl, onResolutionComplete) => (
    <OSCALProfile
      profile={oscalData[oscalObjectType.jsonRootName]}
      parentUrl={oscalUrl}
      onResolutionComplete={onResolutionComplete}
    />
  );
  return (
    <OSCALLoader
      oscalObjectType={oscalObjectType}
      oscalUrl={!isRestMode() && (getRequestedUrl() || oscalObjectType.defaultUrl)}
      renderer={renderer}
      renderForm={props.renderForm}
    />
  );
}
