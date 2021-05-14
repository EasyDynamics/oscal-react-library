import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import OSCALMetadata from "./OSCALMetadata";
import OSCALComponentDefinitionControlImplementation from "./OSCALComponentDefinitionControlImplementation";
import OSCALComponentResolveSources from "./oscal-utils/OSCALComponentResolver";
import OSCALComponentDefinitionComponent from "./OSCALComponentDefinitionComponent";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(2),
    display: "flex",
    flexDirection: "column",
  },
}));

export default function OSCALComponentDefinition(props) {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const classes = useStyles();

  useEffect(() => {
    OSCALComponentResolveSources(
      props.componentDefinition,
      props.parentUrl,
      () => {
        setIsLoaded(true);
      },
      (errorReturned) => {
        setError(errorReturned);
        setIsLoaded(true);
      }
    );
    // eslint-disable-next-line
  }, []);

  let controlImpl;

  if (!isLoaded) {
    controlImpl = null;
  } else {
    controlImpl = Object.entries(
      props.componentDefinition.components
      ).map(([key, component], index) => (
        <OSCALComponentDefinitionControlImplementation
          controlImplementations={component["control-implementations"]}
          components={props.componentDefinition.components}
          controls={props.componentDefinition.resolvedControls}
        />
      )
    );
  }

  return (
    <div className={classes.paper}>
      <OSCALMetadata metadata={props.componentDefinition.metadata} />
      {Object.entries(props.componentDefinition.components).map(
        ([key, component], index) => (
          <OSCALComponentDefinitionComponent
            component={component}
            parties={props.componentDefinition.metadata.parties}
            key={key}
          />
        )
      )}
      {controlImpl}
    </div>
  );
}
