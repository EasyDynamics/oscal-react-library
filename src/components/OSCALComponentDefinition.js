import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import OSCALMetadata from "./OSCALMetadata";
import OSCALComponentDefinitionControlImplementation from "./OSCALComponentDefinitionControlImplementation";
import OSCALComponentResolveSources from "./oscal-utils/OSCALComponentResolver";
import OSCALComponentDefinitionComponent from "./OSCALComponentDefinitionComponent";
import OSCALBackMatter from "./OSCALBackMatter";
import OSCALProfileCatalogInheritance from "./OSCALProfileCatalogInheritance";

const useStyles = makeStyles(() => ({
  paper: {
    display: "flex",
    flexDirection: "column",
  },
}));

export default function OSCALComponentDefinition(props) {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [inheritedProfilesAndCatalogs, setInheritedProfilesAndCatalogs] =
    useState({});
  const classes = useStyles();

  useEffect(() => {
    OSCALComponentResolveSources(
      props.componentDefinition,
      props.parentUrl,
      (profilesCatalogsTree) => {
        setIsLoaded(true);
        setInheritedProfilesAndCatalogs(profilesCatalogsTree);
        props.onResolutionComplete();
      },
      (errorReturned) => {
        setError(errorReturned);
        setIsLoaded(true);
        props.onResolutionComplete();
      }
    );
  }, []);
  // Throw error to OSCALLoader
  if (error) {
    return props.onError(error);
  }

  let controlImpl;

  if (!isLoaded) {
    controlImpl = null;
  } else {
    controlImpl = Object.entries(props.componentDefinition.components).map(
      ([key, component]) => (
        <OSCALComponentDefinitionControlImplementation
          controlImplementations={component["control-implementations"]}
          components={props.componentDefinition.components}
          controls={props.componentDefinition.resolvedControls}
          key={key}
        />
      )
    );
  }

  return (
    <div className={classes.paper}>
      <OSCALMetadata metadata={props.componentDefinition.metadata} />
      <OSCALProfileCatalogInheritance
        inheritedProfilesAndCatalogs={inheritedProfilesAndCatalogs}
      />
      {Object.entries(props.componentDefinition.components).map(
        ([key, component]) => (
          <OSCALComponentDefinitionComponent
            component={component}
            parties={props.componentDefinition.metadata.parties}
            key={key}
          />
        )
      )}
      {controlImpl}
      <OSCALBackMatter
        backMatter={props.componentDefinition["back-matter"]}
        parentUrl={props.parentUrl}
      />
    </div>
  );
}
