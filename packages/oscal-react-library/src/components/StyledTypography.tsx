import { Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

export const NotSpecifiedTypography = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.disabled,
})) as typeof Typography;
