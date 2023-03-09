import React from "react";
import { styled } from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import OSCALControlPart from "./OSCALControlPart";
import OSCALControlModification from "./OSCALControlModification";
import isWithdrawn from "./oscal-utils/OSCALCatalogUtils";

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
    props.withdrawn &&
    `text-decoration: line-through; color: ${props.theme.palette.grey[400]};`}
`;

function ControlsList(props) {
  return (
    <div>
      {props.control.parts?.map((part, index) => (
        <OSCALControlPart
          componentId={props.componentId}
          control={props.control}
          controlId={props.control.id}
          implementedRequirement={props.implementedRequirement}
          isEditable={props.isEditable}
          key={part.id ?? `part-${index}`}
          modificationAlters={props.modificationAlters}
          modificationSetParameters={props.modificationSetParameters}
          onRestError={props.onRestError}
          onRestSuccess={props.onRestSuccess}
          parameters={props.control.params}
          part={part}
          partialRestData={props.partialRestData}
        />
      ))}
      {props.control.controls?.map((control) => (
        <OSCALControl
          childLevel={(props?.childLevel ?? 0) + 1}
          componentId={props.componentId}
          control={control}
          implementedRequirement={props.implementedRequirement}
          includeControlIds={props.includeControlIds}
          isEditable={props.isEditable}
          key={control.id}
          modificationAlters={props.modificationAlters}
          modificationSetParameters={props.modificationSetParameters}
          onRestError={props.onRestError}
          onRestSuccess={props.onRestSuccess}
          parameters={control.params}
          partialRestData={props.partialRestData}
        />
      ))}
    </div>
  );
}

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

  return props.showInList ? (
    <ControlsList {...props} />
  ) : (
    <OSCALControlCard
      childLevel={props.childLevel ?? 0}
      withdrawn={isWithdrawn(props.control)}
    >
      <CardContent>
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <Typography
              variant="h6"
              component="h2"
              style={props.childLevel ? { fontSize: "1.1rem" } : undefined}
            >
              <span style={{ textTransform: "uppercase" }}>
                {props.control.id}
              </span>{" "}
              {props.control.title} {modificationDisplay}
            </Typography>
          </Grid>
        </Grid>
        <ControlsList {...props} />
      </CardContent>
    </OSCALControlCard>
  );
}
