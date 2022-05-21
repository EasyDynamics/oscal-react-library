import React from "react";
import { styled } from "@mui/material/styles";
import OSCALControlGuidance from "./OSCALControlGuidance";
import OSCALControlModification from "./OSCALControlModification";
import {
  OSCALReplacedProseWithByComponentParameterValue,
  OSCALReplacedProseWithParameterLabel,
} from "./OSCALControlProse";

const PREFIX = "OSCALControlPart";

const classes = {
  OSCALControlPart: `${PREFIX}-OSCALControlPart`,
  OSCALControlStatement: `${PREFIX}-OSCALControlStatement`,
  OSCALStatement: `${PREFIX}-OSCALStatement`,
};

const Root = styled("div")(() => ({
  [`& .${classes.OSCALControlPart}`]: {
    "padding-left": "2em",
  },

  [`& .${classes.OSCALControlStatement}`]: {
    "padding-left": "0em",
  },

  [`& .${classes.OSCALStatement}`]: {},
}));

// TODO - This is probably 800-53 specific?
const getPartLabel = (props) =>
  props?.find((property) => property.name === "label")?.value;

export default function OSCALControlPart(props) {
  // Don't display assessment if we're displaying a control implementation
  if (
    (props.implementedRequirement ||
      props.modificationSetParameters ||
      props.modificationAlters) &&
    (props.part.name === "objective" || props.part.name === "assessment")
  ) {
    return null;
  }

  if (props.part.name === "guidance") {
    return <OSCALControlGuidance prose={props.part.prose} />;
  }

  let modificationDisplay;
  if (props.modificationAlters) {
    modificationDisplay = (
      <OSCALControlModification
        modificationAlters={props.modificationAlters}
        controlPartId={props.part.id}
        controlId={props.controlId}
      />
    );
  }

  const label = getPartLabel(props.part.props);

  let replacedProse;
  if (props.implementedRequirement) {
    replacedProse = (
      <OSCALReplacedProseWithByComponentParameterValue
        label={label}
        prose={props.part.prose}
        parameters={props.parameters}
        implementedRequirement={props.implementedRequirement}
        statementId={props.part.id}
        componentId={props.componentId}
        modificationSetParameters={props.modificationSetParameters}
        modificationDisplay={modificationDisplay}
        isEditable={props.isEditable}
        onRestSuccess={props.onRestSuccess}
        onRestError={props.onRestError}
        partialRestData={props.partialRestData}
      />
    );
  } else {
    replacedProse = (
      <OSCALReplacedProseWithParameterLabel
        label={label}
        prose={props.part.prose}
        parameters={props.parameters}
        modificationSetParameters={props.modificationSetParameters}
        modificationDisplay={modificationDisplay}
      />
    );
  }

  // Set classname to control statement when part name is "statement"
  const className =
    props.part.name === "statement"
      ? classes.OSCALControlStatement
      : classes.OSCALControlPart;

  return (
    <Root className={className}>
      {replacedProse}
      {props.part.parts &&
        props.part.parts.map((part) => (
          <OSCALControlPart
            part={part}
            controlId={props.controlId ?? props.control.id}
            parameters={props.parameters}
            implementedRequirement={props.implementedRequirement}
            componentId={props.componentId}
            modificationAlters={props.modificationAlters}
            modificationSetParameters={props.modificationSetParameters}
            key={part.id}
            isEditable={props.isEditable}
            onRestSuccess={props.onRestSuccess}
            onRestError={props.onRestError}
            partialRestData={props.partialRestData}
          />
        ))}
    </Root>
  );
}
