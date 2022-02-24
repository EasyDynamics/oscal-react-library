import React, { useState, useEffect, useRef } from "react";
import { makeStyles } from "@material-ui/core/styles";
import OSCALMetadata from "./OSCALMetadata";
import OSCALSystemCharacteristics from "./OSCALSystemCharacteristics";
import OSCALSystemImplementation from "./OSCALSystemImplementation";
import OSCALControlImplementation from "./OSCALControlImplementation";
import OSCALSspResolveProfile from "./oscal-utils/OSCALSspResolver";
import OSCALBackMatter from "./OSCALBackMatter";
import OSCALProfileCatalogInheritance from "./OSCALProfileCatalogInheritance";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(2),
    display: "flex",
    flexDirection: "column",
  },
}));

export default function OSCALSsp(props) {
  const classes = useStyles();
  const [error, setError] = useState(null);
  const [inheritedProfilesAndCatalogs, setInheritedProfilesAndCatalogs] =
    useState({});
  const [isLoaded, setIsLoaded] = useState(false);
  const [ssp, setSsp] = useState(props["system-security-plan"]);
  const unmounted = useRef(false);

  const patchData = {
    "system-security-plan": {
      uuid: props["system-security-plan"].uuid,
    },
  };

  let sspParties;
  if (props["system-security-plan"].metadata) {
    sspParties = props["system-security-plan"].metadata.parties;
  }

  useEffect(() => {
    OSCALSspResolveProfile(
      props["system-security-plan"],
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
        onFieldSave={props.onFieldSave}
        patchData={patchData}
        update={setSsp}
      />
    );
  }

  return (
    <div className={classes.paper}>
      <OSCALMetadata
        metadata={props["system-security-plan"].metadata}
        isEditable={props.isEditable}
        onFieldSave={props.onFieldSave}
        patchData={patchData}
      />
      <OSCALProfileCatalogInheritance
        inheritedProfilesAndCatalogs={inheritedProfilesAndCatalogs}
      />
      <OSCALSystemCharacteristics
        systemCharacteristics={
          props["system-security-plan"]["system-characteristics"]
        }
        backMatter={props["system-security-plan"]["back-matter"]}
        parentUrl={props.parentUrl}
      />
      <OSCALSystemImplementation
        systemImplementation={
          props["system-security-plan"]["system-implementation"]
        }
        parties={sspParties}
      />
      {controlImpl}
      <OSCALBackMatter
        backMatter={props["system-security-plan"]["back-matter"]}
        parentUrl={props.parentUrl}
      />
    </div>
  );
}
