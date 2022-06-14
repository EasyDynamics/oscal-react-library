import React from "react";
import { styled, useTheme } from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import OSCALControlPart from "./OSCALControlPart";
import OSCALControlModification from "./OSCALControlModification";
import { Box, Grid } from '@mui/material';

// TODO - This is probably 800-53 specific?
const isWithdrawn = (control) =>
  control?.props?.find(
    (prop) => prop.name === "status" && prop.value === "withdrawn"
);

export const LegendLabel = styled(Typography)(
  ({ theme }) => `
    display: inline-flex;
    flex-direction: row;
    color: ${theme.palette.grey[400]};
`
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

  const legendBox = (color) => (
    <Box
      borderRadius="25%"
      sx={{
        width: "1em",
        height: "1em",
        backgroundColor: color
      }}
    />
  );

  const theme = useTheme();

  return (
    <OSCALControlCard
      childLevel={props.childLevel ?? 0}
      withdrawn={isWithdrawn(props.control)}
    >
      <CardContent>
        <Grid container spacing={1} gap={1}>
          <Grid item xs={7}>
            <Typography
              variant="h6"
              component="h2"
              style={props.childLevel ? { fontSize: "1.1rem" } : undefined}
            >
              <span style={{ textTransform: "uppercase" }}>{props.control.id}</span>
              {props.control.title} {modificationDisplay}
            </Typography>
          </Grid>
          <Grid item xs={2}>
            <LegendLabel
              aria-label="legend-placeholder-label"
            >
              {legendBox(theme.palette.warning.light)}&nbsp;&nbsp;&nbsp;Placeholder
            </LegendLabel>
          </Grid>
          <Grid item xs={2}>
            <LegendLabel
              aria-label="legend-value-label"
            >
              {legendBox(theme.palette.info.light)}&nbsp;&nbsp;&nbsp;Value
            </LegendLabel>
          </Grid>
        </Grid>
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
