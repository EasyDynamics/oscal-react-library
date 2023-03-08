import { styled } from "@mui/material/styles";

const OSCALDocumentRoot = styled("div")(
  ({ theme }) => `
    padding-left: ${theme.spacing(2)};
    display: flex;
    flex-direction: column;
`
);

// eslint-disable-next-line import/prefer-default-export
export { OSCALDocumentRoot };
