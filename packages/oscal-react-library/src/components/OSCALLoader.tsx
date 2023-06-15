import React, { useState, useCallback, useEffect, useRef, useLayoutEffect } from "react";
import { ErrorBoundary } from "react-error-boundary";
import CircularProgress from "@mui/material/CircularProgress";
import Grid from "@mui/material/Grid";
import { oscalObjectTypes } from "./oscal-utils/OSCALObjectData";
import { determineControlGroupFromFragment } from "./oscal-utils/OSCALLinkUtils";
import { BasicError, ErrorThrower } from "./ErrorHandling";
import OSCALSsp from "./OSCALSsp";
import OSCALCatalog from "./OSCALCatalog";
import OSCALComponentDefinition from "./OSCALComponentDefinition";
import OSCALProfile from "./OSCALProfile";
import OSCALLoaderForm from "./OSCALLoaderForm";
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

/**
 * Returns url parameter provided by the browser url, if it exists. If the url
 * parameter exists, we want to override the default viewer url.
 *
 * @returns The url parameter of the browser url, or null if it doesn't exist
 */
export function getRequestedUrl() {
  return new URLSearchParams(window.location.search).get("url");
}

type Renderer = React.FC<OSCALLoaderRendererProps>;

type OscalWithSource = Oscal & { oscalSource?: string };

export interface OSCALDocumentLoaderProps {
  renderForm: boolean;
  urlFragment: string;
}

export interface OSCALLoaderProps extends AnchorLinkProps {
  hasDefaultUrl?: boolean;
  oscalObjectType: any;
  renderForm?: boolean;
  renderer: Renderer;
}

export interface OSCALLoaderRendererProps {
  oscalData: OscalWithSource;
  oscalUrl: string;
  onResolutionComplete: () => void;
}

export default function OSCALLoader(props: OSCALLoaderProps): ReactElement {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isResolutionComplete, setIsResolutionComplete] = useState(false);
  const [hasDefaultUrl, setHasDefaultUrl] = useState(props.hasDefaultUrl);
  const [oscalData, setOscalData] = useState({} as OscalWithSource);
  const isMounted = useRef(false);
  const [error, setError] = useState(null as Error | null);
  const handleError = setError;
  // We "count" the number of times the reload button has been pressed (when active).
  // This will force a redraw of the form on each click, allowing us to reset after
  // an error and to ensure.
  const [reloadCount, setReloadCount] = useState(0);
  const determineDefaultOscalUrl = () => props.oscalObjectType.defaultUrl;

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
        if (isMounted.current) {
          const source = Convert.oscalToJson(oscalObj);
          // TODO: Currently data is passed to components through modifying objects.
          // This approach should be revisited.
          // https://github.com/EasyDynamics/oscal-react-library/issues/297
          setOscalData({ ...oscalObj, oscalSource: source });
          setIsLoaded(true);
        }
      }, handleError);
  };

  const handleUrlChange = (value: string) => {
    setOscalUrl(value);
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
    handleReload();
  }, []);

  const onResolutionComplete = () => {
    setIsResolutionComplete(true);
  };

  // Note: the empty deps array [] means
  // this useEffect will run once
  // similar to componentDidMount()
  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  useLayoutEffect(() => {
    setOscalUrl(determineDefaultOscalUrl());
    setHasDefaultUrl(true);
  }, []);

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
        isResolutionComplete={isResolutionComplete}
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
  } else if (oscalUrl && Object.keys(oscalData).length) {
    result = props.renderer({
            oscalData,
            oscalUrl,
            onResolutionComplete,
          })
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
        resetKeys={[reloadCount, oscalUrl]}
      >
        <ErrorThrower error={error as Error} />
        {result}
      </ErrorBoundary>
    </>
  );
}

export function OSCALCatalogLoader(props: OSCALDocumentLoaderProps) {
  const oscalObjectType = oscalObjectTypes.catalog;
  const renderer: Renderer = ({ oscalData, oscalUrl, onResolutionComplete }) => (
    <OSCALCatalog
      catalog={oscalData[oscalObjectType.jsonRootName] as Catalog}
      parentUrl={oscalUrl}
      urlFragment={props.urlFragment}
      onResolutionComplete={onResolutionComplete}
    />
  );
  return (
    <OSCALLoader
      oscalObjectType={oscalObjectType}
      renderer={renderer}
      renderForm={props.renderForm}
      urlFragment={props.urlFragment}
    />
  );
}

export function OSCALSSPLoader(props: OSCALDocumentLoaderProps) {
  const oscalObjectType = oscalObjectTypes.ssp;
  const renderer: Renderer = ({ oscalData, oscalUrl, onResolutionComplete }) => (
    <OSCALSsp
      system-security-plan={oscalData[oscalObjectType.jsonRootName] as SystemSecurityPlanSSP}
      parentUrl={oscalUrl}
      urlFragment={props.urlFragment}
      onResolutionComplete={onResolutionComplete}
    />
  );

  return (
    <OSCALLoader
      oscalObjectType={oscalObjectType}
      renderer={renderer}
      renderForm={props.renderForm}
      urlFragment={props.urlFragment}
    />
  );
}

export function OSCALComponentLoader(props: OSCALDocumentLoaderProps) {
  const oscalObjectType = oscalObjectTypes.component;
  const renderer: Renderer = ({ oscalData, oscalUrl, onResolutionComplete }) => (
    <OSCALComponentDefinition
      componentDefinition={oscalData[oscalObjectType.jsonRootName] as ComponentDefinition}
      parentUrl={oscalUrl}
      urlFragment={props.urlFragment}
      onResolutionComplete={onResolutionComplete}
    />
  );
  return (
    <OSCALLoader
      oscalObjectType={oscalObjectType}
      renderer={renderer}
      renderForm={props.renderForm}
      urlFragment={props.urlFragment}
    />
  );
}

export function OSCALProfileLoader(props: OSCALDocumentLoaderProps) {
  const oscalObjectType = oscalObjectTypes.profile;
  const renderer: Renderer = ({ oscalData, oscalUrl, onResolutionComplete }) => (
    <OSCALProfile
      profile={oscalData[oscalObjectType.jsonRootName] as Profile}
      parentUrl={oscalUrl}
      urlFragment={props.urlFragment}
      onResolutionComplete={onResolutionComplete}
    />
  );
  return (
    <OSCALLoader
      oscalObjectType={oscalObjectType}
      renderer={renderer}
      renderForm={props.renderForm}
      urlFragment={props.urlFragment}
    />
  );
}
