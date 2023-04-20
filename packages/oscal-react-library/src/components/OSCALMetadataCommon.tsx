import { styled } from "@mui/material/styles";
import { Typography } from "@mui/material";

/**
 * A collection of common components shared amongst
 * OSCALMetadata child components.
 */

export const OSCALMetadataLabel = styled(Typography)(({ theme }) => ({
  textAlign: "right",
  color: theme.palette.text.secondary,
})) as typeof Typography;
