import React from "react";
import { styled } from "@mui/material/styles";
import OSCALControlGuidance from "./OSCALControlGuidance";
import OSCALControlModification from "./OSCALControlModification";
import {
  OSCALReplacedProseWithByComponentParameterValue,
  OSCALReplacedProseWithParameterLabel,
} from "./OSCALControlProse";
import { propWithName } from "./oscal-utils/OSCALPropUtils";

const OSCALControlPartWrapper = styled("div", {
  shouldForwardProp: (prop) =>
    !["partName", "ownerState", "theme", "sx", "as"].includes(prop),
})`
  padding-left: ${(props) => (props.partName !== "statement" ? "2em" : "0")};
`;

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

  const partLabel = propWithName(props.part?.props, "label")?.value;
  const controlLabel = propWithName(props.control?.props, "label")?.value;

  if (props.part.name === "guidance") {
    return (
      <OSCALControlGuidance
        prose={props.part.prose}
        id={props.control.id}
        title={props.control.title}
        label={controlLabel}
      />
    );
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

  let replacedProse;
  if (props.implementedRequirement) {
    replacedProse = (
      <OSCALReplacedProseWithByComponentParameterValue
        label={partLabel}
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
        label={partLabel}
        prose={props.part.prose}
        parameters={props.parameters}
        modificationSetParameters={props.modificationSetParameters}
        modificationDisplay={modificationDisplay}
        isImplemented
      />
    );
  }

  return (
    <OSCALControlPartWrapper ownerState partName={props.part.name}>
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
            key={part.id ?? part.name}
            isEditable={props.isEditable}
            onRestSuccess={props.onRestSuccess}
            onRestError={props.onRestError}
            partialRestData={props.partialRestData}
          />
        ))}
    </OSCALControlPartWrapper>
  );
}
