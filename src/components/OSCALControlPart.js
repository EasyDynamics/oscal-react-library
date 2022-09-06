import React from "react";
import { styled } from "@mui/material/styles";
import OSCALControlGuidance from "./OSCALControlGuidance";
import OSCALControlModification from "./OSCALControlModification";
import {
  OSCALReplacedProseWithByComponentParameterValue,
  OSCALReplacedProseWithParameterLabel,
} from "./OSCALControlProse";

const OSCALControlPartWrapper = styled("div", {
  shouldForwardProp: (prop) =>
    !["partName", "ownerState", "theme", "sx", "as"].includes(prop),
})`
  padding-left: ${(props) => (props.partName !== "statement" ? "2em" : "0")};
`;

// TODO: This is probably 800-53 specific and it should be made more
// generic to allow the library to work with other frameworks.
// https://github.com/EasyDynamics/oscal-react-library/issues/504
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
            key={part.id ? part.id : part.name}
            isEditable={props.isEditable}
            onRestSuccess={props.onRestSuccess}
            onRestError={props.onRestError}
            partialRestData={props.partialRestData}
          />
        ))}
    </OSCALControlPartWrapper>
  );
}
