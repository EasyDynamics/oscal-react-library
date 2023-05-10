import React, { useState, useCallback, useEffect, useRef, useLayoutEffect } from "react";
import { useParams } from "react-router-dom";
import { ErrorBoundary } from "react-error-boundary";
import { styled } from "@mui/material/styles";
import CircularProgress from "@mui/material/CircularProgress";
import Split from "react-split";
import { Box, Fab } from "@mui/material";
import Grid from "@mui/material/Grid";
import CodeIcon from "@mui/icons-material/Code";
import * as restUtils from "./oscal-utils/OSCALRestUtils";
import { oscalObjectTypes, OscalObjectType } from "./oscal-utils/OSCALObjectData";
import { determineControlGroupFromFragment } from "./oscal-utils/OSCALLinkUtils";
import { BasicError, ErrorThrower } from "./ErrorHandling";
import OSCALSsp from "./OSCALSsp";
import OSCALCatalog from "./OSCALCatalog";
import OSCALComponentDefinition from "./OSCALComponentDefinition";
import OSCALProfile from "./OSCALProfile";
import OSCALLoaderForm from "./OSCALLoaderForm";
import OSCALJsonEditor from "./OSCALJsonEditor";
import {
  Catalog,
  ComponentDefinition,
  Convert,
  Oscal,
  Profile,
  SystemSecurityPlanSSP,
} from "@easydynamics/oscal-types";
import { ReactElement } from "react-markdown/lib/react-markdown";
import { AnchorLinkProps } from "./OSCALAnchorLinkHeader";

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

/**
 * Returns url parameter provided by the browser url, if it exists. If the url
 * parameter exists, we want to override the default viewer url.
 *
 * @returns The url parameter of the browser url, or null if it doesn't exist
 */
export function getRequestedUrl() {
  return new URLSearchParams(window.location.search).get("url");
}

type Renderer = (props: OSCALLoaderRendererProps) => ReactElement;

type OscalWithSource = Oscal & { oscalSource?: string };

export interface OSCALDocumentLoaderProps {
  renderForm: boolean;
  backendUrl: string;
  urlFragment: string;
  isRestMode: boolean;
}

export interface OSCALLoaderProps extends AnchorLinkProps {
  isRestMode?: boolean;
  hasDefaultUrl?: boolean;
  backendUrl?: string;
  oscalObjectType: any;
  renderForm?: boolean;
  renderer: Renderer;
}

export type OnFieldSaveHandlerWrapped = (
  appendToLastFieldInPath: boolean,
  partialRestData: Record<string, any>,
  editedFieldJsonPath: string[],
  newValue: string | object,
  restUrlPath: string | undefined,
  oscalObjectType: OscalObjectType
) => void;

export interface OSCALLoaderRendererProps {
  isRestMode: boolean | undefined;
  oscalData: OscalWithSource;
  oscalUrl: string;
  onResolutionComplete: () => void;
  handleRestSuccess: () => void;
  handleRestError: (e: Error) => void;
  handleFieldSave: OnFieldSaveHandlerWrapped;
}

export default function OSCALLoader(props: OSCALLoaderProps): ReactElement {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isResolutionComplete, setIsResolutionComplete] = useState(false);
  const [hasDefaultUrl, setHasDefaultUrl] = useState(props.hasDefaultUrl);
  const [oscalData, setOscalData] = useState({} as OscalWithSource);
  const [editorIsVisible, setEditorIsVisible] = useState(true);
  const unmounted = useRef(false);
  const [error, setError] = useState(null as Error | null);
  const handleError = setError;
  // We "count" the number of times the reload button has been pressed (when active).
  // This will force a redraw of the form on each click, allowing us to reset after
  // an error and to ensure.
  const [reloadCount, setReloadCount] = useState(0);
  const oscalObjectUuid = useParams()?.id ?? "";
  const buildOscalUrl = (uuid: string) =>
    `${props.backendUrl}/${props.oscalObjectType.restPath}/${uuid}`;
  const determineDefaultOscalUrl = () =>
    (props.isRestMode ? null : getRequestedUrl()) || props.oscalObjectType.defaultUrl;

  const [oscalUrl, setOscalUrl] = useState(determineDefaultOscalUrl());

  const loadOscalData = (newOscalUrl: string) => {
    if (!newOscalUrl) {
      setIsLoaded(true);
      return;
    }
    fetch(newOscalUrl)
      .then((response) => {
        if (!response.ok) throw new Error(response.status.toString());
        else return response.text();
      })
      .then((result) => Convert.toOscal(result))
      .then((oscalObj) => {
        if (!unmounted.current) {
          const source = Convert.oscalToJson(oscalObj);
          // TODO: Currently data is passed to components through modifying objects.
          // This approach should be revisited.
          // https://github.com/EasyDynamics/oscal-react-library/issues/297
          setOscalData({ ...oscalObj, oscalSource: source });
          setIsLoaded(true);
        }
      }, handleError);
  };

  const handleFieldSave: OnFieldSaveHandlerWrapped = (
    appendToLastFieldInPath,
    partialRestData,
    editedFieldJsonPath,
    newValue,
    restUrlPath,
    oscalObjectType
  ) => {
    const requestUrl = restUtils.buildRequestUrl(partialRestData, restUrlPath, oscalObjectType);

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
      restUtils.RestMethod.PATCH,
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

  const handleUrlChange = (value: string) => {
    setOscalUrl(value);
  };

  const handleUuidChange = (objectUuid: string) => {
    const newOscalUrl = buildOscalUrl(objectUuid);
    setOscalUrl(newOscalUrl);
    setIsLoaded(false);
    setIsResolutionComplete(false);
    loadOscalData(newOscalUrl);
  };

  const handleReload = (isForced?: boolean) => {
    // Only reload if we're done loading
    if (isForced || (isLoaded && isResolutionComplete)) {
      setIsLoaded(false);
      setIsResolutionComplete(false);
      setReloadCount((current) => current + 1);
      loadOscalData(oscalUrl);
    }
  };

  const scrollToElementWithFragment = (fragment: string | undefined) => {
    // Ensure fragment exists and grab element associated
    if (fragment) {
      // Locate the element with the provided fragment and scroll to the item
      document.getElementById(fragment)?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleFragment = useCallback(() => {
    // Ensure fragment exists and determine if a control grouping tab is found
    const controlGroupingFragment = determineControlGroupFromFragment(props.urlFragment);
    // Scroll to Element if not within a control grouping
    // NOTE: Control found in control grouping tabs are handled in Catalog Groups
    if (!controlGroupingFragment) {
      scrollToElementWithFragment(props.urlFragment);
    }
  }, [props.urlFragment]);

  useEffect(() => {
    handleReload(!props.isRestMode);
  }, [oscalUrl]);

  const handleRestPut = (jsonString: string) => {
    restUtils.performRequest(
      JSON.parse(jsonString),
      restUtils.RestMethod.PUT,
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
  useEffect(
    () => () => {
      unmounted.current = true;
    },
    []
  );

  useLayoutEffect(() => {
    if (oscalObjectUuid) {
      setIsLoaded(true);
      setIsResolutionComplete(true);
      setHasDefaultUrl(true);
      const fragment = props.urlFragment ? `#${props.urlFragment}` : "";
      const document = props.isRestMode ? oscalObjectUuid : "";
      const path = `/${props.oscalObjectType.jsonRootName}/${document}${fragment}`;
      // Handle uuid displaying in url depending on REST mode
      window.history.pushState("", "", path);
    } else if (props.isRestMode) {
      setOscalUrl(null);
      setIsLoaded(true);
      setIsResolutionComplete(true);
      setHasDefaultUrl(false);
    } else {
      setOscalUrl(determineDefaultOscalUrl());
      setHasDefaultUrl(true);
    }
  }, [props.isRestMode]);

  // Handle anchor link change in window url
  useEffect(() => {
    handleFragment();
  }, [handleFragment]);

  let form;
  if (props.renderForm && hasDefaultUrl) {
    form = (
      <OSCALLoaderForm
        oscalObjectType={props.oscalObjectType}
        oscalUrl={oscalUrl}
        onUrlChange={handleUrlChange}
        onUuidChange={handleUuidChange}
        isRestMode={props.isRestMode}
        isResolutionComplete={isResolutionComplete}
        onError={handleError}
        backendUrl={props.backendUrl}
      />
    );
  }

  let result;
  if (!isLoaded) {
    result = (
      <Grid container pt={3}>
        <CircularProgress />
      </Grid>
    );
  } else if (oscalUrl) {
    result = props.isRestMode ? (
      <Grid container pt={3}>
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
            <OSCALJsonEditor value={oscalData.oscalSource} onSave={handleRestPut} />
          </Box>
          <Box>
            {props.renderer({
              isRestMode: props.isRestMode,
              oscalData,
              oscalUrl,
              onResolutionComplete,
              handleFieldSave,
              handleRestSuccess,
              handleRestError: handleError,
            })}
          </Box>
        </EditorSplit>
      </Grid>
    ) : (
      <>
        {props.renderer({
          isRestMode: props.isRestMode,
          oscalData,
          oscalUrl,
          onResolutionComplete,
          handleFieldSave,
          handleRestSuccess,
          handleRestError: handleError,
        })}
      </>
    );
  }

  return (
    <>
      {form}
      <ErrorBoundary
        FallbackComponent={BasicError}
        onReset={() => {
          setError(null);
        }}
        onError={() => {
          setIsResolutionComplete(true);
          setIsLoaded(true);
        }}
        resetKeys={[reloadCount, props.isRestMode, oscalUrl]}
      >
        <ErrorThrower error={error as Error} />
        {result}
      </ErrorBoundary>
    </>
  );
}

export function OSCALCatalogLoader(props: OSCALDocumentLoaderProps) {
  const oscalObjectType = oscalObjectTypes.catalog;
  const renderer: Renderer = ({
    isRestMode,
    oscalData,
    oscalUrl,
    onResolutionComplete,
    handleFieldSave,
    handleRestSuccess,
    handleRestError,
  }) => (
    <OSCALCatalog
      catalog={oscalData[oscalObjectType.jsonRootName] as Catalog}
      isEditable={isRestMode}
      parentUrl={oscalUrl}
      urlFragment={props.urlFragment}
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
      onRestError={(error: Error) => {
        handleRestError(error);
      }}
    />
  );
  return (
    <OSCALLoader
      oscalObjectType={oscalObjectType}
      renderer={renderer}
      renderForm={props.renderForm}
      backendUrl={props.backendUrl}
      urlFragment={props.urlFragment}
      isRestMode={props.isRestMode}
    />
  );
}

export function OSCALSSPLoader(props: OSCALDocumentLoaderProps) {
  const oscalObjectType = oscalObjectTypes.ssp;
  const renderer: Renderer = ({
    isRestMode,
    oscalData,
    oscalUrl,
    onResolutionComplete,
    handleFieldSave,
    handleRestSuccess,
    handleRestError,
  }) => (
    <OSCALSsp
      system-security-plan={oscalData[oscalObjectType.jsonRootName] as SystemSecurityPlanSSP}
      isEditable={isRestMode}
      parentUrl={oscalUrl}
      urlFragment={props.urlFragment}
      onResolutionComplete={onResolutionComplete}
      onFieldSave={(
        appendToLastFieldInPath: boolean,
        partialRestData: Record<string, any>,
        editedFieldJsonPath: string[],
        newValue: string | object,
        restUrlPath?: string
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
      onRestError={(error: Error) => {
        handleRestError(error);
      }}
    />
  );

  return (
    <OSCALLoader
      oscalObjectType={oscalObjectType}
      renderer={renderer}
      renderForm={props.renderForm}
      backendUrl={props.backendUrl}
      urlFragment={props.urlFragment}
      isRestMode={props.isRestMode}
    />
  );
}

export function OSCALComponentLoader(props: OSCALDocumentLoaderProps) {
  const oscalObjectType = oscalObjectTypes.component;
  const renderer: Renderer = ({
    isRestMode,
    oscalData,
    oscalUrl,
    onResolutionComplete,
    handleFieldSave,
    handleRestSuccess,
    handleRestError,
  }) => (
    <OSCALComponentDefinition
      componentDefinition={oscalData[oscalObjectType.jsonRootName] as ComponentDefinition}
      isEditable={isRestMode}
      parentUrl={oscalUrl}
      urlFragment={props.urlFragment}
      onResolutionComplete={onResolutionComplete}
      onFieldSave={(
        appendToLastFieldInPath: boolean,
        partialRestData: Record<string, any>,
        editedFieldJsonPath: string[],
        newValue: string | object,
        restUrlPath?: string
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
      onRestError={(error: Error) => {
        handleRestError(error);
      }}
    />
  );
  return (
    <OSCALLoader
      oscalObjectType={oscalObjectType}
      renderer={renderer}
      renderForm={props.renderForm}
      backendUrl={props.backendUrl}
      urlFragment={props.urlFragment}
      isRestMode={props.isRestMode}
    />
  );
}

export function OSCALProfileLoader(props: OSCALDocumentLoaderProps) {
  const oscalObjectType = oscalObjectTypes.profile;
  const renderer: Renderer = ({
    isRestMode,
    oscalData,
    oscalUrl,
    onResolutionComplete,
    handleFieldSave,
    handleRestSuccess,
    handleRestError,
  }) => (
    <OSCALProfile
      profile={oscalData[oscalObjectType.jsonRootName] as Profile}
      isEditable={isRestMode}
      parentUrl={oscalUrl}
      urlFragment={props.urlFragment}
      onResolutionComplete={onResolutionComplete}
      onFieldSave={(
        appendToLastFieldInPath: boolean,
        partialRestData: Record<string, any>,
        editedFieldJsonPath: string[],
        newValue: string | object,
        restUrlPath?: string
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
      onRestError={(error: Error) => {
        handleRestError(error);
      }}
    />
  );
  return (
    <OSCALLoader
      oscalObjectType={oscalObjectType}
      renderer={renderer}
      renderForm={props.renderForm}
      backendUrl={props.backendUrl}
      urlFragment={props.urlFragment}
      isRestMode={props.isRestMode}
    />
  );
}
