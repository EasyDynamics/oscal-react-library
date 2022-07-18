import React, { useState, useEffect, useRef } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { styled } from "@mui/material/styles";
import CircularProgress from "@mui/material/CircularProgress";
import Split from "react-split";
import { Box, Fab } from "@mui/material";
import CodeIcon from "@mui/icons-material/Code";
import { useParams } from "react-router-dom";
import * as restUtils from "./oscal-utils/OSCALRestUtils";
import { BasicError, ErrorThrower } from "./ErrorHandling";
import OSCALSsp from "./OSCALSsp";
import OSCALCatalog from "./OSCALCatalog";
import OSCALComponentDefinition from "./OSCALComponentDefinition";
import OSCALProfile from "./OSCALProfile";
import OSCALLoaderForm from "./OSCALLoaderForm";
import OSCALJsonEditor from "./OSCALJsonEditor";

const EditorToolbar = styled(Box)(
  ({ theme }) => `
  position: sticky;
  display: flex;
  justify-content: flex-start;
  margin-bottom: ${theme.spacing(1)};
  z-index: 1;
`
);

const EditorSplit = styled(Split)`
  display: flex;
  flex-direction: row;

  & > .gutter {
    background-color: #eee;
    background-repeat: no-repeat;
    background-position: 50%;
  }

  & .gutter-horizontal {
    background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAeCAYAAADkftS9AAAAIklEQVQoU2M4c+bMfxAGAgYYmwGrIIiDjrELjpo5aiZeMwF+yNnOs5KSvgAAAABJRU5ErkJggg==");
    cursor: col-resize;
  }
`;

export default function OSCALLoader(props) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isResolutionComplete, setIsResolutionComplete] = useState(false);
  const { isRestMode, setIsRestMode } = props;
  const [oscalData, setOscalData] = useState([]);
  const [editorIsVisible, setEditorIsVisible] = useState(true);
  const unmounted = useRef(false);
  const [error, setError] = useState(null);
  const handleError = setError;
  // We "count" the number of times the reload button has been pressed (when active).
  // This will force a redraw of the form on each click, allowing us to reset after
  // an error and to ensure.
  const [reloadCount, setReloadCount] = useState(0);
  const oscalObjectUuid = useParams()?.id ?? "";
  const buildOscalUrl = (uuid) =>
    `${props.backendUrl}/${props.oscalObjectType.restPath}/${uuid}`;
  const [oscalUrl, setOscalUrl] = useState(
    isRestMode ? null : props.oscalUrl || props.oscalObjectType.defaultUrl
  );

  const loadOscalData = (newOscalUrl) => {
    if (!newOscalUrl) {
      setIsLoaded(true);
      return;
    }
    fetch(newOscalUrl)
      .then((response) => {
        if (!response.ok) throw new Error(response.status);
        else return response.json();
      }, handleError)
      .then((result) => {
        if (!unmounted.current) {
          /* TODO: Currently data is passed to components through modifying objects.
          /* This approach should be revisited. https://github.com/EasyDynamics/oscal-react-library/issues/297 */
          /* eslint no-param-reassign: "error" */
          result.oscalSource = JSON.stringify(result, null, "\t");
          setOscalData(result);
          setIsLoaded(true);
        }
      }, handleError);
  };

  const handleFieldSave = (
    appendToLastFieldInPath,
    partialRestData,
    editedFieldJsonPath,
    newValue,
    restUrlPath,
    oscalObjectType
  ) => {
    const requestUrl = restUtils.buildRequestUrl(
      partialRestData,
      restUrlPath,
      oscalObjectType
    );

    if (newValue) {
      restUtils.populatePartialRestData(
        partialRestData,
        editedFieldJsonPath,
        newValue,
        appendToLastFieldInPath
      );
    }

    restUtils.performRequest(
      partialRestData,
      restUtils.restMethods.PATCH,
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
      handleError
    );
  };

  const handleUrlChange = (event) => {
    setOscalUrl(event.target.value);
  };

  const handleUuidChange = (objectUuid) => {
    const newOscalUrl = buildOscalUrl(objectUuid);
    setOscalUrl(newOscalUrl);
    setIsLoaded(false);
    setIsResolutionComplete(false);
    loadOscalData(newOscalUrl);
  };

  const handleReload = (isForced) => {
    // Only reload if we're done loading
    if (isForced || (isLoaded && isResolutionComplete)) {
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
    restUtils.performRequest(
      JSON.parse(jsonString),
      restUtils.restMethods.PUT,
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
      handleError
    );
  };

  const handleRestSuccess = () => {
    handleReload(true);
  };

  const onResolutionComplete = () => {
    setIsResolutionComplete(true);
  };

  useEffect(() => {
    if (oscalObjectUuid) {
      handleUuidChange(oscalObjectUuid);
    }
  }, [oscalObjectUuid]);

  // Note: the empty deps array [] means
  // this useEffect will run once
  // similar to componentDidMount()
  useEffect(() => {
    if (!isRestMode) {
      loadOscalData(oscalUrl);
    }
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
        onReloadClick={handleReload}
        isRestMode={isRestMode}
        onChangeRestMode={handleChangeRestMode}
        isResolutionComplete={isResolutionComplete}
        onError={handleError}
        backendUrl={props.backendUrl}
      />
    );
  }

  let result;
  if (!isLoaded) {
    result = <CircularProgress />;
  } else if (oscalUrl) {
    result = isRestMode ? (
      <>
        <EditorToolbar>
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
        </EditorToolbar>
        <EditorSplit
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
              onResolutionComplete,
              handleFieldSave,
              handleRestSuccess,
              handleError
            )}
          </Box>
        </EditorSplit>
      </>
    ) : (
      <>
        {props.renderer(
          isRestMode,
          oscalData,
          oscalUrl,
          onResolutionComplete,
          handleFieldSave,
          handleRestSuccess,
          handleError
        )}
      </>
    );
  }

  return (
    <>
      {form}
      <ErrorBoundary
        FallbackComponent={BasicError}
        onResetKeysChange={() => {
          setError(null);
        }}
        onError={() => {
          setIsResolutionComplete(true);
          setIsLoaded(true);
        }}
        resetKeys={[reloadCount, isRestMode, oscalUrl]}
      >
        <ErrorThrower error={error} />
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
  const { id } = useParams();
  const oscalObjectType = restUtils.oscalObjectTypes.catalog;
  const renderer = (
    isRestMode,
    oscalData,
    oscalUrl,
    onResolutionComplete,
    handleFieldSave,
    handleRestSuccess,
    handleRestError
  ) => (
    <OSCALCatalog
      catalog={oscalData[oscalObjectType.jsonRootName]}
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
      onRestSuccess={handleRestSuccess}
      onRestError={(error) => {
        handleRestError(error);
      }}
    />
  );
  return (
    <OSCALLoader
      oscalObjectType={oscalObjectType}
      oscalObjectUuid={id}
      oscalUrl={getRequestedUrl()}
      renderer={renderer}
      renderForm={props.renderForm}
      backendUrl={props.backendUrl}
      isRestMode={props.isRestMode}
      setIsRestMode={props.setIsRestMode}
    />
  );
}

export function OSCALSSPLoader(props) {
  const { id } = useParams();
  const oscalObjectType = restUtils.oscalObjectTypes.ssp;
  const renderer = (
    isRestMode,
    oscalData,
    oscalUrl,
    onResolutionComplete,
    handleFieldSave,
    handleRestSuccess,
    handleRestError
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
      onRestSuccess={handleRestSuccess}
      onRestError={(error) => {
        handleRestError(error);
      }}
    />
  );

  return (
    <OSCALLoader
      oscalObjectType={oscalObjectType}
      oscalObjectUuid={id}
      oscalUrl={getRequestedUrl()}
      renderer={renderer}
      renderForm={props.renderForm}
      backendUrl={props.backendUrl}
      isRestMode={props.isRestMode}
      setIsRestMode={props.setIsRestMode}
    />
  );
}

export function OSCALComponentLoader(props) {
  const { id } = useParams();
  const oscalObjectType = restUtils.oscalObjectTypes.component;
  const renderer = (
    isRestMode,
    oscalData,
    oscalUrl,
    onResolutionComplete,
    handleFieldSave,
    handleRestSuccess,
    handleRestError
  ) => (
    <OSCALComponentDefinition
      componentDefinition={oscalData[oscalObjectType.jsonRootName]}
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
      onRestSuccess={handleRestSuccess}
      onRestError={(error) => {
        handleRestError(error);
      }}
    />
  );
  return (
    <OSCALLoader
      oscalObjectType={oscalObjectType}
      oscalObjectUuid={id}
      oscalUrl={getRequestedUrl()}
      renderer={renderer}
      renderForm={props.renderForm}
      backendUrl={props.backendUrl}
      isRestMode={props.isRestMode}
      setIsRestMode={props.setIsRestMode}
    />
  );
}

export function OSCALProfileLoader(props) {
  const { id } = useParams();
  const oscalObjectType = restUtils.oscalObjectTypes.profile;
  const renderer = (
    isRestMode,
    oscalData,
    oscalUrl,
    onResolutionComplete,
    handleFieldSave,
    handleRestSuccess,
    handleRestError
  ) => (
    <OSCALProfile
      profile={oscalData[oscalObjectType.jsonRootName]}
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
      onRestSuccess={handleRestSuccess}
      onRestError={(error) => {
        handleRestError(error);
      }}
    />
  );
  return (
    <OSCALLoader
      oscalObjectType={oscalObjectType}
      oscalObjectUuid={id}
      oscalUrl={getRequestedUrl()}
      renderer={renderer}
      renderForm={props.renderForm}
      backendUrl={props.backendUrl}
      isRestMode={props.isRestMode}
      setIsRestMode={props.setIsRestMode}
    />
  );
}
