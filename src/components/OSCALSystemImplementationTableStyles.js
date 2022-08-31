import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import TableHead from "@mui/material/TableHead";

export const SmallTableCell = styled(TableCell)`
  text-align: right;
  padding: 0.75em 0.75em;
`;

export const ComponentTableCell = styled(TableCell)`
  text-align: left;
  minwidth: 20em;
`;

export const OSCALSystemImplementationTableTitle = styled(Typography)`
  flex: 1 1 100%;
  padding-top: 1em;
  padding-bottom: 1em;
`;

export const StyledHeaderTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
  },
  textAlign: "left",
  minWidth: "10em",
}));

export const StyledTableHead = styled(TableHead)`
  position: sticky;
  top: 0;
`;

export const StyledTableRow = styled(TableRow)(({ theme }) => ({
  // Use hover color for even numbered rows
  "&:nth-of-type(even)": {
    backgroundColor: theme.palette.action.hover,
  },
}));
