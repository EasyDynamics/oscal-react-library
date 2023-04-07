import React, { useState, useEffect, useRef } from "react";
import OSCALMetadata from "./OSCALMetadata";
import OSCALSystemCharacteristics from "./OSCALSystemCharacteristics";
import OSCALSystemImplementation from "./OSCALSystemImplementation";
import OSCALControlImplementation from "./OSCALControlImplementation";
import OSCALSspResolveProfile from "./oscal-utils/OSCALSspResolver";
import OSCALBackMatter from "./OSCALBackMatter";
import OSCALProfileCatalogInheritance from "./OSCALProfileCatalogInheritance";
import { OSCALDocumentRoot } from "./OSCALLoaderStyles";

export default function OSCALSsp(props) {
  const [error, setError] = useState(null);
  const [inheritedProfilesAndCatalogs, setInheritedProfilesAndCatalogs] =
    useState({});
  const [isLoaded, setIsLoaded] = useState(false);
  const unmounted = useRef(false);

  const ssp = props["system-security-plan"];
  const partialRestData = {
    "system-security-plan": {
      uuid: ssp.uuid,
    },
  };

  let sspParties;
  if (ssp.metadata) {
    sspParties = ssp.metadata.parties;
  }

  useEffect(() => {
    OSCALSspResolveProfile(
      ssp,
      props.parentUrl,
      (profilesCatalogsTree) => {
        if (!unmounted.current) {
          setIsLoaded(true);
          setInheritedProfilesAndCatalogs(profilesCatalogsTree);
          props.onResolutionComplete();
        }
      },
      () => {
        if (!unmounted.current) {
          setError(error);
          setIsLoaded(true);
          props.onResolutionComplete();
        }
      }
    );

    return () => {
      unmounted.current = true;
    };
  }, []);

  let controlImpl;

  if (!isLoaded) {
    controlImpl = null;
  } else {
    controlImpl = (
      <OSCALControlImplementation
        controlImplementation={ssp["control-implementation"]}
        components={ssp["system-implementation"].components}
        controls={ssp.resolvedControls}
        isEditable={props.isEditable}
        modifications={ssp.modifications}
        onRestSuccess={props.onRestSuccess}
        onRestError={props.onRestError}
        partialRestData={partialRestData}
      />
    );
  }

  return (
    <OSCALDocumentRoot>
      <OSCALMetadata
        metadata={ssp.metadata}
        isEditable={props.isEditable}
        onFieldSave={props.onFieldSave}
        partialRestData={partialRestData}
        urlFragment={props.urlFragment}
      />
      <OSCALProfileCatalogInheritance
        inheritedProfilesAndCatalogs={inheritedProfilesAndCatalogs}
      />
      <OSCALSystemCharacteristics
        systemCharacteristics={ssp["system-characteristics"]}
        backMatter={ssp["back-matter"]}
        parentUrl={props.parentUrl}
      />
      <OSCALSystemImplementation
        systemImplementation={ssp["system-implementation"]}
        parties={sspParties}
        components={ssp["system-implementation"].components}
      />
      {controlImpl}
      <OSCALBackMatter
        backMatter={ssp["back-matter"]}
        parentUrl={props.parentUrl}
      />
    </OSCALDocumentRoot>
  );
}
