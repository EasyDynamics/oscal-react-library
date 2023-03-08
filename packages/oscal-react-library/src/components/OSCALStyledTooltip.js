import { styled } from "@mui/material/styles";
import Tooltip from "@mui/material/Tooltip";

/**
 * Creates a stylized tooltip with withStyles
 */
const StyledTooltip = styled(Tooltip)`
  tooltip {
    font-size: 1em;
  }
`;

export default StyledTooltip;
