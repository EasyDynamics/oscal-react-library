import React from "react";
import { styled } from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import OSCALControlPart from "./OSCALControlPart";
import OSCALControlModification from "./OSCALControlModification";

// TODO - This is probably 800-53 specific?
const isWithdrawn = (control) =>
  control?.props?.find(
    (prop) => prop.name === "status" && prop.value === "withdrawn"
  );

const OSCALControlCard = styled(Card, {
  // https://github.com/mui/material-ui/blob/c34935814b81870ca325099cdf41a1025a85d4b5/packages/mui-system/src/createStyled.js#L56
  shouldForwardProp: (prop) =>
    !["childLevel", "withdrawn", "ownerState", "theme", "sx", "as"].includes(
      prop
    ),
})`
  margin-top: 1em;
  margin-bottom: 1em;
  margin-left: ${(props) => (props.childLevel > 0 ? "1.5em" : "0")};
  margin-right: ${(props) => (props.childLevel > 0 ? "1.5em" : "0")};
  ${(props) => props.childLevel > 0 && "background-color: #fffcf0;"}
  ${(props) =>
    props.withdrawn && `text-decoration: line-through; color: #d4d4d4;`}
`;

export default function OSCALControl(props) {
  if (
    !props.control ||
    (props.includeControlIds &&
      !props.includeControlIds.includes(props.control.id))
  ) {
    return null;
  }

  let modificationDisplay;
  if (props.modificationAlters) {
    modificationDisplay = (
      <OSCALControlModification
        modificationAlters={props.modificationAlters}
        controlId={props.control.id}
      />
    );
  }

  return (
    <OSCALControlCard
      childLevel={props.childLevel ?? 0}
      withdrawn={isWithdrawn(props.control)}
    >
      <CardContent>
        <Typography
          variant="h6"
          component="h2"
          style={props.childLevel ? { fontSize: "1.1rem" } : undefined}
        >
          <span style={{ textTransform: "uppercase" }}>{props.control.id}</span>{" "}
          {props.control.title} {modificationDisplay}
        </Typography>
        {props.control.parts &&
          props.control.parts.map((part, index) => (
            <OSCALControlPart
              part={part}
              control={props.control}
              controlId={props.control.id}
              parameters={props.control.params}
              implementedRequirement={props.implementedRequirement}
              componentId={props.componentId}
              modificationAlters={props.modificationAlters}
              modificationSetParameters={props.modificationSetParameters}
              key={part.id ?? `part-${index}`}
              isEditable={props.isEditable}
              onRestSuccess={props.onRestSuccess}
              onRestError={props.onRestError}
              partialRestData={props.partialRestData}
            />
          ))}
        {props.control.controls &&
          props.control.controls.map((control) => (
            <OSCALControl
              control={control}
              parameters={control.params}
              includeControlIds={props.includeControlIds}
              modificationAlters={props.modificationAlters}
              modificationSetParameters={props.modificationSetParameters}
              childLevel={(props?.childLevel ?? 0) + 1}
              key={control.id}
              implementedRequirement={props.implementedRequirement}
              isEditable={props.isEditable}
              onRestSuccess={props.onRestSuccess}
              onRestError={props.onRestError}
              partialRestData={props.partialRestData}
            />
          ))}
      </CardContent>
    </OSCALControlCard>
  );
}
