import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Tooltip from "@material-ui/core/Tooltip";

const useStyles = makeStyles((theme) => ({
  tooltip: {
    fontSize: "1em",
  },
}));

/**
 * Creates a stylized tooltip with useStyles.
 *
 * @param {Object} props The child and title properties of a StyledTooltip.
 * @returns A tooltip based on the provided styles and given properties.
 */
export default function StyledTooltip(props) {
  return (
    <Tooltip
      classes={{ tooltip: useStyles().tooltip }}
      title={props.title}
      placement={props.placement}
    >
      {props.children}
    </Tooltip>
  );
}
