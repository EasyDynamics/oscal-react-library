import React from "react";
import { GlobalStyles } from "@mui/material";
import { tableCellClasses } from "@mui/material/TableCell";

const globalStyles = (theme) => ({
  // Common HTML
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

  // App
  ".App": {
    textAlign: "left",
  },
  ".App-logo": {
    height: "40vmin",
    pointerEvents: "none",
  },
  ".App-header": {
    backgroundColor: "#999999",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "calc(10px + 2vmin)",
    color: "white",
  },
  ".App-link": {
    color: "#00BDE3",
  },
  ".NotSpecified": {
    color: theme.palette.text.disabled,
  },

  // Table
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

  // Accordion
  ".Accordion": {
    border: `1px solid ${theme.palette.divider}`,
    "&:not(:last-child)": {
      borderBottom: 0,
    },
    "&:before": {
      display: "none",
    },
  },
  ".AccordionSummary": {
    backgroundColor:
      theme.palette.mode === "dark" ? "rgba(255, 255, 255, .05)" : "rgba(0, 0, 0, .03)",
    fontSize: "0.9rem",
    flexDirection: "row-reverse",
    "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
      transform: "rotate(90deg)",
    },
    "& .MuiAccordionSummary-content": {
      marginLeft: theme.spacing(1),
    },
  },
  ".AccordionDetails": {
    padding: theme.spacing(2),
    borderTop: "1px solid rgba(0, 0, 0, .125)",
  },
});

export const OSCALGlobalStyles = ({ theme }) => {
  return <GlobalStyles styles={globalStyles(theme)} />;
};
