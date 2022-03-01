import React, { useState, useEffect, useRef } from "react";
import CircularProgress from "@material-ui/core/CircularProgress";
import { populatePartialRestData } from "./oscal-utils/OSCALUtils";
import ErrorBoundary, { BasicError } from "./ErrorBoundary";
import OSCALSsp from "./OSCALSsp";
import OSCALCatalog from "./OSCALCatalog";
import OSCALComponentDefinition from "./OSCALComponentDefinition";
import OSCALProfile from "./OSCALProfile";
import OSCALLoaderForm from "./OSCALLoaderForm";

const oscalObjectTypes = {
  catalog: {
    name: "Catalog",
    defaultUrl:
      "https://raw.githubusercontent.com/EasyDynamics/oscal-demo-content/main/catalogs/NIST_SP-800-53_rev5_catalog.json",
    defaultUuid: "613fca2d-704a-42e7-8e2b-b206fb92b456",
    jsonRootName: "catalog",
    restPath: "catalogs",
  },
  component: {
    name: "Component",
    defaultUrl:
      "https://raw.githubusercontent.com/EasyDynamics/oscal-demo-content/main/component-definitions/example-component.json",
    defaultUuid: "8223d65f-57a9-4689-8f06-2a975ae2ad72",
    jsonRootName: "component-definition",
    restPath: "component-definitions",
  },
  profile: {
    name: "Profile",
    defaultUrl:
      "https://raw.githubusercontent.com/EasyDynamics/oscal-demo-content/main/profiles/NIST_SP-800-53_rev4_MODERATE-baseline_profile.json",
    defaultUuid: "8b3beca1-fcdc-43e0-aebb-ffc0a080c486",
    jsonRootName: "profile",
    restPath: "profiles",
  },
  ssp: {
    name: "SSP",
    defaultUrl:
      "https://raw.githubusercontent.com/EasyDynamics/oscal-demo-content/main/system-security-plans/ssp-example.json",
    defaultUuid: "cff8385f-108e-40a5-8f7a-82f3dc0eaba8",
    jsonRootName: "system-security-plan",
    restPath: "system-security-plans",
  },
};

export default function OSCALLoader(props) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isResolutionComplete, setIsResolutionComplete] = useState(false);
  const [isRestMode, setIsRestMode] = useState(
    process.env.REACT_APP_REST_BASE_URL
  );
  const [oscalData, setOscalData] = useState([]);
  const [oscalUrl, setOscalUrl] = useState(isRestMode ? null : props.oscalUrl);
  const unmounted = useRef(false);
  const [error, setError] = useState(null);
  // We "count" the number of times the reload button has been pressed (when active).
  // This will force a redraw of the form on each click, allowing us to reset after
  // an error and to ensure.
  const [reloadCount, setReloadCount] = useState(0);

  const handleFetchError = (err) => {
    setIsLoaded(true);
    setIsResolutionComplete(true);
    setError(err);
  };

  const loadOscalData = (newOscalUrl) => {
    if (!newOscalUrl) {
      setIsLoaded(true);
      return;
    }
    fetch(newOscalUrl)
      .then(
        (response) => {
          if (!response.ok) throw new Error(response.status);
          else return response.json();
        },
        (err) => handleFetchError(err)
      )
      .then(
        (result) => {
          if (!unmounted.current) {
            setOscalData(result);
            setIsLoaded(true);
          }
        },
        (err) => handleFetchError(err)
      );
  };

  /**
   * Sends a REST request of type restMethod to a backend service and updates the viewer if
   * the request is successful.
   *
   * @param appendToLastFieldInPath boolean indicating if the updated value should be appended to an array or replace an existing value
   * @param partialRestData data that will be passed into the body of the REST request, may not initially contain the updates
   * @param editedFieldJsonPath path to the field that is being updated
   * @param newValue updated value for the edited field
   * @param restMethod the REST request type
   * @param restUrlPath path defining where in the file the modifications are made
   * @param jsonRootName root OSCAL object, as it appears on the corresponding object file, of the JSON file
   * @param restPath main url path for access the OSCAL files in REST mode
   */
  const restRequest = (
    appendToLastFieldInPath,
    partialRestData,
    editedFieldJsonPath,
    newValue,
    restMethod,
    restUrlPath,
    jsonRootName,
    restPath
  ) => {
    let url;
    if (restUrlPath === "") {
      url = `${process.env.REACT_APP_REST_BASE_URL}/${restPath}/${partialRestData[jsonRootName].uuid}`;
    } else {
      url = `${process.env.REACT_APP_REST_BASE_URL}/${restUrlPath}`;
    }

    if (newValue) {
      populatePartialRestData(
        partialRestData,
        editedFieldJsonPath,
        newValue,
        appendToLastFieldInPath
      );
    }

    setIsLoaded(false);
    setIsResolutionComplete(false);

    fetch(url, {
      method: restMethod,
      body: JSON.stringify(partialRestData),
    })
      .then(
        (response) => {
          if (!response.ok) throw new Error(response.status);
          else return response.json();
        },
        (err) => handleFetchError(err)
      )
      .then(
        (result) => {
          if (!unmounted.current) {
            setOscalData(result);
            setIsLoaded(true);
          }
        },
        (err) => handleFetchError(err)
      );
  };

  const handleUrlChange = (event) => {
    setOscalUrl(event.target.value);
  };

  const handleUuidChange = (event) => {
    const newOscalUrl = `${process.env.REACT_APP_REST_BASE_URL}/${props.oscalObjectType.restPath}/${event.target.value}`;
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
      setReloadCount((current) => current + 1);
      loadOscalData(oscalUrl);
    }
  };

  const handleChangeRestMode = (event) => {
    setIsRestMode(event.target.checked);
    if (event.target.checked) {
      setOscalUrl(null);
      setIsLoaded(true);
      setIsResolutionComplete(true);
    } else {
      setIsLoaded(false);
      setIsResolutionComplete(false);
      setOscalUrl(props.oscalObjectType.defaultUrl);
      loadOscalData(props.oscalObjectType.defaultUrl);
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
        isRestMode={isRestMode}
        onChangeRestMode={handleChangeRestMode}
        isResolutionComplete={isResolutionComplete}
        onError={handleFetchError}
      />
    );
  }

  let result;
  if (error) {
    result = <BasicError error={error} />;
  } else if (!isLoaded) {
    result = <CircularProgress />;
  } else if (oscalUrl) {
    result = props.renderer(
      isRestMode,
      oscalData,
      oscalUrl,
      onResolutionComplete,
      restRequest
    );
  }

  return (
    <>
      {form}
      <ErrorBoundary
        key={reloadCount}
        onError={() => {
          setIsLoaded(true);
          setIsResolutionComplete(true);
        }}
      >
        {result}
      </ErrorBoundary>
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

export function OSCALCatalogLoader(props) {
  const oscalObjectType = oscalObjectTypes.catalog;
  const renderer = (
    isRestMode,
    oscalData,
    oscalUrl,
    onResolutionComplete,
    restRequest
  ) => (
    <OSCALCatalog
      catalog={oscalData[oscalObjectType.jsonRootName]}
      parentUrl={oscalUrl}
      onResolutionComplete={onResolutionComplete}
      onFieldSave={(
        appendToLastFieldInPath,
        data,
        editedField,
        newValue,
        restMethod,
        restUrlPath
      ) => {
        restRequest(
          appendToLastFieldInPath,
          data,
          editedField,
          newValue,
          restMethod,
          restUrlPath,
          oscalObjectType.jsonRootName,
          oscalObjectType.restPath
        );
      }}
    />
  );
  return (
    <OSCALLoader
      oscalObjectType={oscalObjectType}
      oscalUrl={getRequestedUrl() || oscalObjectType.defaultUrl}
      renderer={renderer}
      renderForm={props.renderForm}
    />
  );
}

export function OSCALSSPLoader(props) {
  const oscalObjectType = oscalObjectTypes.ssp;
  const renderer = (
    isRestMode,
    oscalData,
    oscalUrl,
    onResolutionComplete,
    restRequest
  ) => (
    <OSCALSsp
      system-security-plan={oscalData[oscalObjectType.jsonRootName]}
      isEditable={isRestMode}
      parentUrl={oscalUrl}
      onResolutionComplete={onResolutionComplete}
      onFieldSave={(
        appendToLastFieldInPath,
        data,
        editedField,
        newValue,
        restMethod,
        restUrlPath
      ) => {
        restRequest(
          appendToLastFieldInPath,
          data,
          editedField,
          newValue,
          restMethod,
          restUrlPath,
          oscalObjectType.jsonRootName,
          oscalObjectType.restPath
        );
      }}
    />
  );
  return (
    <OSCALLoader
      oscalObjectType={oscalObjectType}
      oscalUrl={getRequestedUrl() || oscalObjectType.defaultUrl}
      renderer={renderer}
      renderForm={props.renderForm}
    />
  );
}

export function OSCALComponentLoader(props) {
  const oscalObjectType = oscalObjectTypes.component;
  const renderer = (
    isRestMode,
    oscalData,
    oscalUrl,
    onResolutionComplete,
    restRequest
  ) => (
    <OSCALComponentDefinition
      componentDefinition={oscalData[oscalObjectType.jsonRootName]}
      parentUrl={oscalUrl}
      onResolutionComplete={onResolutionComplete}
      onFieldSave={(
        appendToLastFieldInPath,
        data,
        editedField,
        newValue,
        restMethod,
        restUrlPath
      ) => {
        restRequest(
          appendToLastFieldInPath,
          data,
          editedField,
          newValue,
          restMethod,
          restUrlPath,
          oscalObjectType.jsonRootName,
          oscalObjectType.restPath
        );
      }}
    />
  );
  return (
    <OSCALLoader
      oscalObjectType={oscalObjectType}
      oscalUrl={getRequestedUrl() || oscalObjectType.defaultUrl}
      renderer={renderer}
      renderForm={props.renderForm}
    />
  );
}

export function OSCALProfileLoader(props) {
  const oscalObjectType = oscalObjectTypes.profile;
  const renderer = (
    isRestMode,
    oscalData,
    oscalUrl,
    onResolutionComplete,
    restRequest
  ) => (
    <OSCALProfile
      profile={oscalData[oscalObjectType.jsonRootName]}
      parentUrl={oscalUrl}
      onResolutionComplete={onResolutionComplete}
      onFieldSave={(
        appendToLastFieldInPath,
        data,
        editedField,
        newValue,
        restMethod,
        restUrlPath
      ) => {
        restRequest(
          appendToLastFieldInPath,
          data,
          editedField,
          newValue,
          restMethod,
          restUrlPath,
          oscalObjectType.jsonRootName,
          oscalObjectType.restPath
        );
      }}
    />
  );
  return (
    <OSCALLoader
      oscalObjectType={oscalObjectType}
      oscalUrl={getRequestedUrl() || oscalObjectType.defaultUrl}
      renderer={renderer}
      renderForm={props.renderForm}
    />
  );
}
