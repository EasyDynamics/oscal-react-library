import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import OSCALMetadata from "./OSCALMetadata";
import OSCALSystemCharacteristics from "./OSCALSystemCharacteristics";
import OSCALSystemImplementation from "./OSCALSystemImplementation";
import OSCALControlImplementation from "./OSCALControlImplementation";
import OSCALSspResolveProfile from "./oscal-utils/OSCALSspResolver";
import OSCALBackMatter from "./OSCALBackMatter";
import getProfileModifications from "./oscal-utils/OSCALProfileUtils";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(2),
    display: "flex",
    flexDirection: "column",
  },
}));

export default function OSCALSsp(props) {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [modifications, setModifications] = useState(props.modifications);
  const classes = useStyles();

  const ssp = props["system-security-plan"];

  let sspParties;
  if (ssp.metadata) {
    sspParties = ssp.metadata.parties;
  }

  useEffect(() => {
    OSCALSspResolveProfile(
      ssp,
      props.parentUrl,
      () => {
        setIsLoaded(true);
      },
      () => {
        setError(error);
        setIsLoaded(true);
      }
    );
  }, []);

  let controlImpl;

  if (!isLoaded) {
    controlImpl = null;
  } else {
    // Get modifications from imported profile
    if (!modifications) {
      getProfileModifications(
        ssp["import-profile"].href,
        props.parentUrl,
        setModifications
      );
    }
    controlImpl = (
      <OSCALControlImplementation
        controlImplementation={ssp["control-implementation"]}
        components={ssp["system-implementation"].components}
        controls={ssp.resolvedControls}
        modifications={modifications}
      />
    );
  }

  return (
    <div className={classes.paper}>
      <OSCALMetadata metadata={ssp.metadata} />
      <OSCALSystemCharacteristics
        systemCharacteristics={ssp["system-characteristics"]}
      />
      <OSCALSystemImplementation
        systemImplementation={ssp["system-implementation"]}
        parties={sspParties}
      />
      {controlImpl}
      <OSCALBackMatter
        backMatter={ssp["back-matter"]}
        parentUrl={props.parentUrl}
      />
    </div>
  );
}
