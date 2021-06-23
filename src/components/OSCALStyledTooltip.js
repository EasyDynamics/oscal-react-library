import { withStyles } from "@material-ui/core/styles";
import Tooltip from "@material-ui/core/Tooltip";

/**
 * Creates a stylized tooltip with withStyles
 */
const StyledTooltip = withStyles(() => ({
  tooltip: {
    fontSize: "1em",
  },
}))(Tooltip);

export default StyledTooltip;
