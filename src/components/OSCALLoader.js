import React, { useState, useEffect, useRef } from "react";
import CircularProgress from "@material-ui/core/CircularProgress";
import Split from "react-split";
import { makeStyles } from "@material-ui/core/styles";
import { Box, Fab } from "@material-ui/core";
import CodeIcon from "@material-ui/icons/Code";
import { populatePartialRestData, buildRestRequestUrl, performRestRequest, restMethods, oscalObjectTypes } from "./oscal-utils/OSCALRestUtils";
import ErrorBoundary, { BasicError } from "./ErrorBoundary";
import OSCALSsp from "./OSCALSsp";
import OSCALCatalog from "./OSCALCatalog";
import OSCALComponentDefinition from "./OSCALComponentDefinition";
import OSCALProfile from "./OSCALProfile";
import OSCALLoaderForm from "./OSCALLoaderForm";
import OSCALJsonEditor from "./OSCALJsonEditor";

const useStyles = makeStyles((theme) => ({
  split: {
    display: "flex",
    flexDirection: " row",
    "& > .gutter": {
      backgroundColor: "#eee",
      backgroundRepeat: "no-repeat",
      backgroundPosition: "50%",
      "&.gutter-horizontal": {
        backgroundImage:
          "url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAeCAYAAADkftS9AAAAIklEQVQoU2M4c+bMfxAGAgYYmwGrIIiDjrELjpo5aiZeMwF+yNnOs5KSvgAAAABJRU5ErkJggg==')",
        cursor: "col-resize",
      },
    },
  },
  toolbar: {
    position: "sticky",
    display: "flex",
    justifyContent: "flex-start",
    marginBottom: theme.spacing(1),
    zIndex: 1,
  },
}));

export default function OSCALLoader(props) {
  const classes = useStyles();
  const [isLoaded, setIsLoaded] = useState(false);
  const [isResolutionComplete, setIsResolutionComplete] = useState(false);
  const { isRestMode, setIsRestMode } = props;
  const [oscalData, setOscalData] = useState([]);
  const [oscalUrl, setOscalUrl] = useState(isRestMode ? null : props.oscalUrl);
  const [editorIsVisible, setEditorIsVisible] = useState(true);
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
            // TODO https://github.com/EasyDynamics/oscal-react-library/issues/297
            /* eslint no-param-reassign: "error" */
            result.oscalSource = JSON.stringify(result, null, "\t");
            setOscalData(result);
            setIsLoaded(true);
          }
        },
        (err) => handleFetchError(err)
      );
  };

  const handleFieldSave = (
    appendToLastFieldInPath,
    partialRestData,
    editedFieldJsonPath,
    newValue,
    restUrlPath,
    oscalObjectType
  ) => {
    const requestUrl = buildRestRequestUrl(partialRestData, restUrlPath, oscalObjectType);

    if (newValue) {
      populatePartialRestData(
        partialRestData,
        editedFieldJsonPath,
        newValue,
        appendToLastFieldInPath
      );
    }

    performRestRequest(
      partialRestData,
      restMethods.PATCH,
      requestUrl,
      () => {
        setIsLoaded(false);
        setIsResolutionComplete(false);
      },
      (result) => {
        if (!unmounted.current) {
          result.oscalSource = JSON.stringify(result, null, "\t");
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
    const newOscalUrl = `${props.backendUrl}/${props.oscalObjectType.restPath}/${event.target.value}`;
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

  const handleRestPut = (jsonString) => {
    performRestRequest(
      JSON.parse(jsonString),
      restMethods.PUT,
      oscalUrl,
      () => {
        setIsLoaded(false);
        setIsResolutionComplete(false);
      },
      (result) => {
        if (!unmounted.current) {
          result.oscalSource = JSON.stringify(result, null, "\t");
          setOscalData(result);
          setIsLoaded(true);
        }
      },
      (err) => handleFetchError(err)
    );
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
        backendUrl={props.backendUrl}
      />
    );
  }

  let result;
  if (error) {
    result = <BasicError error={error} />;
  } else if (!isLoaded) {
    result = <CircularProgress />;
  } else if (oscalUrl) {
    result = isRestMode ? (
      <>
        <Box className={classes.toolbar}>
          <Fab
            aria-label="show code"
            color={editorIsVisible ? "default" : "primary"}
            size="small"
            onClick={() => {
              setEditorIsVisible(!editorIsVisible);
            }}
          >
            <CodeIcon />
          </Fab>
        </Box>
        <Split
          className={classes.split}
          gutterSize={editorIsVisible ? 10 : 0}
          minSize={editorIsVisible ? 300 : 0}
          sizes={editorIsVisible ? [34, 66] : [0, 100]}
        >
          <Box display={editorIsVisible ? "block" : "none"}>
            <OSCALJsonEditor
              value={oscalData.oscalSource}
              onSave={handleRestPut}
            />
          </Box>
          <Box>
            {props.renderer(
              isRestMode,
              oscalData,
              oscalUrl,
              onResolutionComplete
            )}
          </Box>
        </Split>
      </>
    ) : (
      <>
        {props.renderer(
          isRestMode,
          oscalData,
          oscalUrl,
          onResolutionComplete
        )}
      </>
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
    onResolutionComplete
  ) => (
    <OSCALCatalog
      catalog={oscalData[oscalObjectType.jsonRootName]}
      parentUrl={oscalUrl}
      onResolutionComplete={onResolutionComplete}
      onFieldSave={(
        appendToLastFieldInPath,
        partialRestData,
        editedFieldJsonPath,
        newValue,
        restUrlPath
      ) => {
        handleFieldSave(
          appendToLastFieldInPath,
          partialRestData,
          editedFieldJsonPath,
          newValue,
          restUrlPath,
          oscalObjectType
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
      backendUrl={props.backendUrl}
      isRestMode={props.isRestMode}
      setIsRestMode={props.setIsRestMode}
    />
  );
}

export function OSCALSSPLoader(props) {
  const oscalObjectType = oscalObjectTypes.ssp;
  const renderer = (
    isRestMode,
    oscalData,
    oscalUrl,
    onResolutionComplete
  ) => (
    <OSCALSsp
      system-security-plan={oscalData[oscalObjectType.jsonRootName]}
      isEditable={isRestMode}
      parentUrl={oscalUrl}
      onResolutionComplete={onResolutionComplete}
      onFieldSave={(
        appendToLastFieldInPath,
        partialRestData,
        editedFieldJsonPath,
        newValue,
        restUrlPath
      ) => {
        handleFieldSave(
          appendToLastFieldInPath,
          partialRestData,
          editedFieldJsonPath,
          newValue,
          restUrlPath,
          oscalObjectType
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
      backendUrl={props.backendUrl}
      isRestMode={props.isRestMode}
      setIsRestMode={props.setIsRestMode}
    />
  );
}

export function OSCALComponentLoader(props) {
  const oscalObjectType = oscalObjectTypes.component;
  const renderer = (
    isRestMode,
    oscalData,
    oscalUrl,
    onResolutionComplete
  ) => (
    <OSCALComponentDefinition
      componentDefinition={oscalData[oscalObjectType.jsonRootName]}
      parentUrl={oscalUrl}
      onResolutionComplete={onResolutionComplete}
      onFieldSave={(
        appendToLastFieldInPath,
        partialRestData,
        editedFieldJsonPath,
        newValue,
        restUrlPath
      ) => {
        handleFieldSave(
          appendToLastFieldInPath,
          partialRestData,
          editedFieldJsonPath,
          newValue,
          restUrlPath,
          oscalObjectType
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
      backendUrl={props.backendUrl}
      isRestMode={props.isRestMode}
      setIsRestMode={props.setIsRestMode}
    />
  );
}

export function OSCALProfileLoader(props) {
  const oscalObjectType = oscalObjectTypes.profile;
  const renderer = (
    isRestMode,
    oscalData,
    oscalUrl,
    onResolutionComplete
  ) => (
    <OSCALProfile
      profile={oscalData[oscalObjectType.jsonRootName]}
      parentUrl={oscalUrl}
      onResolutionComplete={onResolutionComplete}
      onFieldSave={(
        appendToLastFieldInPath,
        partialRestData,
        editedFieldJsonPath,
        newValue,
        restUrlPath
      ) => {
        handleFieldSave(
          appendToLastFieldInPath,
          partialRestData,
          editedFieldJsonPath,
          newValue,
          restUrlPath,
          oscalObjectType
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
      backendUrl={props.backendUrl}
      isRestMode={props.isRestMode}
      setIsRestMode={props.setIsRestMode}
    />
  );
}
