import React from "react";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import OSCALControlPart from "./OSCALControlPart";

// TODO - This is probably 800-53 specific?
// Disable linting until completed
/* eslint-disable */
function getControlStatusCss(props) {
  if (!props.control.props) {
    return;
  }
  let property;
  for (property of props.control.props) {
    if (property.name === "status") {
      return {
        "text-decoration": "line-through",
        color: "#d4d4d4",
      };
    }
  }
  return "";
}
/* eslint-enable */

const useStyles = makeStyles((theme) => ({
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
  const classes = useStyles(props);

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
          {props.control.title}
        </Typography>
        {props.control.parts &&
          props.control.parts.map((part, index) => (
            <OSCALControlPart
              part={part}
              parameters={props.control.params}
              implReqStatements={props.implReqStatements}
              componentId={props.componentId}
              key={`part-${index}`}
            />
          ))}
        {props.control.controls &&
          props.control.controls.map((control) => (
            <OSCALControl
              control={control}
              parameters={control.params}
              childLevel={props.childLevel + 1}
              key={control.id}
            />
          ))}
      </CardContent>
    </Card>
  );
}
