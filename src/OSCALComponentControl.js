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
  OSCALComponentControl: {
    margin: "1em 0 1em 0",
  },
  OSCALComponentControlId: {
    "text-transform": "uppercase",
  },
  OSCALComponentControlChildLevel: (props) =>
    props.childLevel > 0
      ? {
          margin: "1em 1.5em 1em 1.5em",
          "background-color": "#fffcf0",
        }
      : "",
  OSCALComponentControlChildLevelTitle: (props) =>
    props.childLevel > 0
      ? {
          "font-size": "1.1rem",
        }
      : "",
  // TODO - This is probably 800-53 specific?
  OSCALComponentControlStatus: (props) => getControlStatusCss(props),
}));

export default function OSCALComponentControl(props) {
  const classes = useStyles(props);

  return (
    <Card
      className={`${classes.OSCALComponentControl} ${classes.OSCALComponentControlStatus} ${classes.OSCALComponentControlChildLevel}`}
    >
      <CardContent>
        <Typography
          variant="h6"
          component="h2"
          className={classes.OSCALComponentControlChildLevelTitle}
        >
          <span className={classes.OSCALComponentControlId}>{props.control.id}</span>{" "}
          {props.control.title}
        </Typography>
        {props.control.controls &&
          props.control.controls.map((control) => (
            <OSCALComponentControl
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