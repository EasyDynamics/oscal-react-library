import React from "react";
import { styled } from "@mui/material/styles";
import OSCALControlModification from "./OSCALControlModification";
import {
  OSCALReplacedProseWithByComponentParameterValue,
  OSCALReplacedProseWithParameterLabel,
} from "./OSCALControlProse";
import { propWithName } from "./oscal-utils/OSCALPropUtils";
import { Typography } from "@mui/material";

const OSCALControlPartWrapper = styled("div", {
  shouldForwardProp: (prop) => !["partName", "ownerState", "theme", "sx", "as"].includes(prop),
})`
  padding-left: ${(props) => (props.partName !== "statement" ? "2em" : "0")};
`;

const OSCALControlRemovedPartWrapper = styled("div", {
  shouldForwardProp: (prop) => !["partName", "ownerState", "theme", "sx", "as"].includes(prop),
})`
  padding-left: ${(props) => (props.partName !== "statement" ? "2em" : "0")};
  text-decoration: line-through;
`;

export const partNameToFriendlyName = {
  overview: "Overview",
  statement: "Statement",
  guidance: "Discussion",
  objective: "Objective",
  "assessment-method": "Assessment Method",
  "assessment-objective": "Assessment Objective",
  // This is deprecated but we still support viewing it.
  assessment: "Assessment Method",
};

export default function OSCALControlPart(props) {
  const partLabel = propWithName(props.part?.props, "label")?.value;

  const partAddPosition = props?.modificationAlters
    ?.find((item) => item["control-id"] === props.controlId)
    ?.adds?.find((item) => item["by-id"] === props.part.id)?.position;

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
    if (partAddPosition === "before") {
      replacedProse = (
        <Typography>
          {modificationDisplay}
          <OSCALReplacedProseWithByComponentParameterValue
            label={partLabel}
            prose={props.part.prose}
            parameters={props.parameters}
            implementedRequirement={props.implementedRequirement}
            statementId={props.part.id}
            componentId={props.componentId}
            modificationSetParameters={props.modificationSetParameters}
            isEditable={props.isEditable}
            onRestSuccess={props.onRestSuccess}
            onRestError={props.onRestError}
            partialRestData={props.partialRestData}
          />
        </Typography>
      );
    }
    if (partAddPosition === "ending") {
      replacedProse = (
        <Typography>
          <OSCALReplacedProseWithByComponentParameterValue
            label={partLabel}
            prose={props.part.prose}
            parameters={props.parameters}
            implementedRequirement={props.implementedRequirement}
            statementId={props.part.id}
            componentId={props.componentId}
            modificationSetParameters={props.modificationSetParameters}
            isEditable={props.isEditable}
            onRestSuccess={props.onRestSuccess}
            onRestError={props.onRestError}
            partialRestData={props.partialRestData}
          />
        </Typography>
      );
    }
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
    if (partAddPosition === "before") {
      replacedProse = (
        <Typography>
          {modificationDisplay}
          <OSCALReplacedProseWithParameterLabel
            label={partLabel}
            prose={props.part.prose}
            parameters={props.parameters}
            modificationSetParameters={props.modificationSetParameters}
            isImplemented
          />
        </Typography>
      );
    }
    if (partAddPosition === "ending") {
      replacedProse = (
        <Typography>
          <OSCALReplacedProseWithParameterLabel
            label={partLabel}
            prose={props.part.prose}
            parameters={props.parameters}
            modificationSetParameters={props.modificationSetParameters}
            isImplemented
          />
        </Typography>
      );
    }
  }
  const controlId = modificationDisplay?.props?.controlId ?? "";
  const controlPartId = modificationDisplay?.props?.controlPartId ?? "";
  const removeByIds = modificationDisplay?.props?.modificationAlters
    ?.find((item) => item["control-id"] === controlId)
    ?.removes?.find((object) => object["by-id"] === controlPartId);
  const removeByNames = modificationDisplay?.props?.modificationAlters
    ?.find((item) => item["control-id"] === controlId)
    ?.removes?.find((object) => object["by-name"] === controlPartId);
  const removeByNS = modificationDisplay?.props?.modificationAlters
    ?.find((item) => item["control-id"] === controlId)
    ?.removes?.find((object) => object["by-ns"] === controlPartId);
  const removeByClass = modificationDisplay?.props?.modificationAlters
    ?.find((item) => item["control-id"] === controlId)
    ?.removes?.find((object) => object["by-class"] === controlPartId);
  const removeByItemNames = modificationDisplay?.props?.modificationAlters
    ?.find((item) => item["control-id"] === controlId)
    ?.removes?.find((object) => object["by-item-name"] === controlPartId);

  if (removeByIds || removeByNames || removeByNS || removeByClass || removeByItemNames) {
    return (
      <OSCALControlRemovedPartWrapper ownerState partName={props.part.name}>
        {replacedProse}
        {props.part.parts?.map((part) => (
          <OSCALControlPart
            part={part}
            control={props.control}
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
      </OSCALControlRemovedPartWrapper>
    );
  }
  if (partAddPosition === "ending") {
    return (
      <OSCALControlPartWrapper ownerState partName={props.part.name}>
        {replacedProse}
        {props.part.parts?.map((part) => (
          <OSCALControlPart
            part={part}
            control={props.control}
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
        {modificationDisplay}
      </OSCALControlPartWrapper>
    );
  }
  return (
    <OSCALControlPartWrapper ownerState partName={props.part.name}>
      {replacedProse}
      {props.part.parts?.map((part) => (
        <OSCALControlPart
          part={part}
          control={props.control}
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
