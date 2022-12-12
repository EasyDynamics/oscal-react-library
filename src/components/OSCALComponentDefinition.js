import React, { useState, useEffect } from "react";
import OSCALMetadata from "./OSCALMetadata";
import OSCALComponentDefinitionControlImplementation from "./OSCALComponentDefinitionControlImplementation";
import OSCALComponentResolveSources from "./oscal-utils/OSCALComponentResolver";
import OSCALComponentDefinitionComponent from "./OSCALComponentDefinitionComponent";
import OSCALBackMatter from "./OSCALBackMatter";
import OSCALProfileCatalogInheritance from "./OSCALProfileCatalogInheritance";
import { OSCALDocumentRoot } from "./OSCALLoaderStyles";

export default function OSCALComponentDefinition(props) {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [inheritedProfilesAndCatalogs, setInheritedProfilesAndCatalogs] =
    useState({});

  const partialRestData = {
    "component-definition": {
      uuid: props.componentDefinition.uuid,
    },
  };

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
  }, [props.componentDefinition, props.parentUrl, props.onResolutionComplete]);
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
          isEditable={props.isEditable}
          onRestSuccess={props.onRestSuccess}
          onRestError={props.onRestError}
          partialRestData={partialRestData}
        />
      )
    );
  }

  return (
    <OSCALDocumentRoot>
      <OSCALMetadata
        metadata={props.componentDefinition.metadata}
        isEditable={props.isEditable}
        onFieldSave={props.onFieldSave}
        partialRestData={partialRestData}
      />
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
    </OSCALDocumentRoot>
  );
}
