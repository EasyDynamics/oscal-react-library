import React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import makeStyles from "@mui/styles/makeStyles";
import OSCALControlPart from "./OSCALControlPart";
import OSCALControlModification from "./OSCALControlModification";

// TODO - This is probably 800-53 specific?
function getControlStatusCss(props) {
  if (
    props.control?.props?.find(
      (property) => property.name === "status" && property.value === "withdrawn"
    )
  ) {
    return {
      "text-decoration": "line-through",
      color: "#d4d4d4",
    };
  }
  return "";
}

const useStyles = makeStyles(() => ({
  OSCALControl: {
    margin: "1em 0 1em 0",
  },
  OSCALControlId: {
    "text-transform": "uppercase",
  },
  OSCALControlChildLevel: (props) =>
    props.childLevel > 0
      ? {
          margin: "1em 1.5em 1em 1.5em",
          "background-color": "#fffcf0",
        }
      : "",
  OSCALControlChildLevelTitle: (props) =>
    props.childLevel > 0
      ? {
          "font-size": "1.1rem",
        }
      : "",
  // TODO - This is probably 800-53 specific?
  OSCALControlStatus: (props) => getControlStatusCss(props),
}));

export default function OSCALControl(props) {
  if (
    !props.control ||
    (props.includeControlIds &&
      !props.includeControlIds.includes(props.control.id))
  ) {
    return null;
  }
  const classes = useStyles(props);

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
    <Card
      className={`${classes.OSCALControl} ${classes.OSCALControlStatus} ${classes.OSCALControlChildLevel}`}
    >
      <CardContent>
        <Typography
          variant="h6"
          component="h2"
          className={classes.OSCALControlChildLevelTitle}
        >
          <span className={classes.OSCALControlId}>{props.control.id}</span>{" "}
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
              childLevel={props.childLevel + 1}
              key={control.id}
              implementedRequirement={props.implementedRequirement}
              isEditable={props.isEditable}
              onRestSuccess={props.onRestSuccess}
              onRestError={props.onRestError}
              partialRestData={props.partialRestData}
            />
          ))}
      </CardContent>
    </Card>
  );
}
