import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import OSCALControlGuidance from "./OSCALControlGuidance";
import OSCALControlModification from "./OSCALControlModification";
import {
  OSCALReplacedProseWithByComponentParameterValue,
  OSCALReplacedProseWithParameterLabel,
} from "./OSCALControlProse";

const useStyles = makeStyles(() => ({
  OSCALControlPart: {
    "padding-left": "2em",
  },
  OSCALControlStatement: {
    "padding-left": "0em",
  },
  OSCALStatement: {},
}));

// TODO - This is probably 800-53 specific?
function getPartLabel(props) {
  return props?.find((property) => property.name === "label")?.value;
}

export default function OSCALControlPart(props) {
  // Don't display assessment if we're displaying a control implementation
  if (
    (props.implReqStatements || props.modifications) &&
    (props.part.name === "objective" || props.part.name === "assessment")
  ) {
    return null;
  }

  const classes = useStyles();

  if (props.part.name === "guidance") {
    return <OSCALControlGuidance prose={props.part.prose} />;
  }

  let modificationDisplay;
  // Passing all of the modifications works, but could be made
  // more efficient later on.
  if (props.modifications) {
    modificationDisplay = (
      <OSCALControlModification
        modifications={props.modifications}
        controlPartId={props.part.id}
        controlId={props.controlId}
      />
    );
  }

  const isStatement = props.part.name === "statement";
  const label = getPartLabel(props.part.props);

  let replacedProse;
  if (props.implReqStatements) {
    replacedProse = (
      <OSCALReplacedProseWithByComponentParameterValue
        label={label}
        prose={props.part.prose}
        parameters={props.parameters}
        implReqStatements={props.implReqStatements}
        statementId={props.part.id}
        componentId={props.componentId}
        modifications={props.modifications}
        modificationDisplay={modificationDisplay}
      />
    );
  } else {
    replacedProse = (
      <OSCALReplacedProseWithParameterLabel
        label={label}
        prose={props.part.prose}
        parameters={props.parameters}
        modifications={props.modifications}
        modificationDisplay={modificationDisplay}
      />
    );
  }

  let className;
  if (isStatement) {
    className = classes.OSCALControlStatement;
  } else {
    className = classes.OSCALControlPart;
  }

  return (
    <div className={className}>
      {replacedProse}
      {props.part.parts &&
        props.part.parts.map((part) => (
          <OSCALControlPart
            part={part}
            controlId={props.controlId ?? props.control.id}
            parameters={props.parameters}
            implReqStatements={props.implReqStatements}
            componentId={props.componentId}
            key={part.id}
            modifications={props.modifications}
          />
        ))}
    </div>
  );
}
