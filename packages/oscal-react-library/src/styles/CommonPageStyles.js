import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";

export const OSCALSectionHeader = styled(Typography)`
  font-size: 0.875rem;
  color: #0000008a;
`;

export const OSCALSection = styled("div")(
  ({ theme }) => `
  margin-top: ${theme.spacing(2)};
  display: flex;
  flex-direction: column;
`
);
