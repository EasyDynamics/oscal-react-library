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
        label={label}
        prose={props.part.prose}
        parameters={props.parameters}
        implReqStatements={props.implReqStatements}
        statementId={props.part.id}
        componentId={props.componentId}
        modificationSetParameters={props.modificationSetParameters}
        modificationDisplay={modificationDisplay}
        controlId={props.controlId}
        implementedRequirement={props.implementedRequirement}
        isEditable={props.isEditable}
        onFieldSave={props.onFieldSave}
        partialRestData={props.partialRestData}
        statementUuid={
          props.implReqStatements?.find(
            (statement) => statement["statement-id"] === props.part.id
          )?.uuid || null
        }
        restPath={props.restPath}
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
        controlId={props.controlId}
        componentId={props.componentId}
        implementedRequirement={props.implementedRequirement}
        implReqStatements={props.implReqStatements}
        isEditable={props.isEditable}
        onFieldSave={props.onFieldSave}
        partialRestData={props.partialRestData}
        statementId={props.part.id}
        statementUuid={
          props.implReqStatements?.find(
            (statement) => statement["statement-id"] === props.part.id
          )?.uuid || null
        }
        restPath={props.restPath}
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
            controlId={props.controlId ?? props.control.id}
            parameters={props.parameters}
            implReqStatements={props.implReqStatements}
            componentId={props.componentId}
            modificationAlters={props.modificationAlters}
            modificationSetParameters={props.modificationSetParameters}
            key={part.id}
            implementedRequirement={props.implementedRequirement}
            isEditable={props.isEditable}
            onFieldSave={props.onFieldSave}
            partialRestData={props.partialRestData}
            statementId={props.part.id}
            restPath={props.restPath}
          />
        ))}
    </div>
  );
}
