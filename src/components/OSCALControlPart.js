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
const getPartLabel = (props) =>
  props?.find((property) => property.name === "label")?.value;

export default function OSCALControlPart(props) {
  // Don't display assessment if we're displaying a control implementation

  if (
    (props.implReqStatements ||
      props.modificationSetParameters ||
      props.modificationAlters) &&
    (props.part.name === "objective" || props.part.name === "assessment")
  ) {
    return null;
  }

  const classes = useStyles();

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
  if (props.implReqStatements?.length > 0) {
    replacedProse = (
      <OSCALReplacedProseWithByComponentParameterValue
        componentId={props.componentId}
        implReqStatements={props.implReqStatements}
        isEditable={props.isEditable}
        label={label}
        modificationDisplay={modificationDisplay}
        modificationSetParameters={props.modificationSetParameters}
        onFieldSave={props.onFieldSave}
        parameters={props.parameters}
        patchData={props.patchData}
        prose={props.part.prose}
        statementId={props.part.id}
        update={props.update}
      />
    );
  } else {
    replacedProse = (
      <OSCALReplacedProseWithParameterLabel
        componentId={props.componentId}
        implReqStatements={props.implReqStatements}
        isEditable={props.isEditable}
        label={label}
        modificationDisplay={modificationDisplay}
        modificationSetParameters={props.modificationSetParameters}
        onFieldSave={props.onFieldSave}
        parameters={props.parameters}
        patchData={props.patchData}
        prose={props.part.prose}
        statementId={props.statementId}
        update={props.update}
      />
    );
  }

  // Set classname to control statement when part name is "statement"
  const className =
    props.part.name === "statement"
      ? classes.OSCALControlStatement
      : classes.OSCALControlPart;

  return (
    <div className={className}>
      {replacedProse}
      {props.part.parts &&
        props.part.parts.map((part) => (
          <OSCALControlPart
            part={part}
            componentId={props.componentId}
            controlId={props.controlId ?? props.control.id}
            implReqStatements={props.implReqStatements}
            isEditable={props.isEditable}
            key={part.id}
            modificationAlters={props.modificationAlters}
            modificationSetParameters={props.modificationSetParameters}
            onFieldSave={props.onFieldSave}
            parameters={props.parameters}
            patchData={props.patchData}
            statementId={props.statementId}
            update={props.update}
          />
        ))}
    </div>
  );
}
