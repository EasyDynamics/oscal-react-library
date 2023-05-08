import React from "react";
import { GlobalStyles } from "@mui/material";
import { tableCellClasses } from "@mui/material/TableCell";

const globalStyles = (theme) => ({
  body: {
    margin: 0,
    padding: 0,
    WebkitFontSmoothing: "antialiased",
    MozOsxFontSmoothing: "grayscale",
  },
  code: {
    fontFamily: ["source-code-pro", "Menlo", "Monaco", "Consolas", "Courier New", "monospace"].join(
      ","
    ),
  },
  ".NotSpecified": {
    color: theme.palette.text.disabled,
  },
  ".SmallTableCell": {
    textAlign: "right",
    padding: "0.75em 0.75em",
  },
  ".ComponentTableCell": {
    textAlign: "left",
    minwidth: "20em",
  },
  ".OSCALSystemImplementationTableTitle": {
    flex: "1 1 100%",
    paddingTop: "1.5em",
    paddingBottom: "1.5em",
  },
  ".StyledHeaderTableCell": {
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.common.white,
    },
    textAlign: "left",
    minWidth: "10em",
  },
  ".StyledTableHead": {
    position: "sticky",
    top: "0",
  },
  ".StyledTableRow": {
    // Use hover color for even numbered rows
    "&:nth-of-type(even)": {
      backgroundColor: theme.palette.action.hover,
    },
  },
});

export function OSCALGlobalStyles(props) {
  const { theme } = props;
  console.log(theme.palette.primary.main);
  return (
    <>
      <GlobalStyles styles={globalStyles(theme)} />
    </>
  );
}
