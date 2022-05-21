import withStyles from "@mui/styles/withStyles";
import Tooltip from "@mui/material/Tooltip";

/**
 * Creates a stylized tooltip with withStyles
 */
const StyledTooltip = withStyles(() => ({
  tooltip: {
    fontSize: "1em",
  },
}))(Tooltip);

export default StyledTooltip;
