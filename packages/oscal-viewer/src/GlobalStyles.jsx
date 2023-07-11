import React from "react";
import { GlobalStyles } from "@mui/material";

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
  html: {
    backgroundColor: theme.palette.backgroundGray.main,
  },

  // App
  ".App": {
    textAlign: "center",
  },
  ".App-logo": {
    height: "40vmin",
    pointerEvents: "none",
  },
  ".App-header": {
    backgroundColor: theme.palette.backgroundGray.main,
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "start",
    fontSize: "calc(10px + 2vmin)",
  },
  ".App-link": {
    color: "#00BDE3",
  },
  ".NotSpecified": {
    color: theme.palette.text.disabled,
  },

  // Table
  ".PrimaryTableRow": {
    backgroundColor: theme.palette.white.main,
    "& .MuiTableCell-head": {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.common.white,
      textTransform: "uppercase",
      fontWeight: theme.typography.fontWeightSemiBold,
    },
  },
  ".SecondaryTable": {
    backgroundColor: theme.palette.white.main,
    "& .MuiTableCell-head": {
      backgroundColor: theme.palette.lightGrayBlue.main,
      color: theme.palette.primary.main,
      fontWeight: theme.typography.fontWeightSemiBold,
    },
    // Use light-gray color for even numbered rows
    "&:nth-of-type(even)": {
      backgroundColor: theme.palette.lightGrayBlue.main,
    },
  },
  ".SecondaryTableRow": {
    backgroundColor: theme.palette.white.main,
    "& .MuiTableCell-head": {
      backgroundColor: theme.palette.lightGrayBlue.main,
      color: theme.palette.primary.main,
      fontWeight: theme.typography.fontWeightSemiBold,
      fontSize: "1rem",
    },
    // Use light gray color for even numbered rows
    "&:nth-of-type(even)": {
      backgroundColor: theme.palette.offWhite.main,
    },
  },
  ".SecondaryTableSubHeaderRow": {
    backgroundColor: theme.palette.offWhite.main,
    "& .MuiTableCell-head": {
      color: theme.palette.primary.main,
      textTransform: "uppercase",
      fontWeight: theme.typography.fontWeightSemiBold,
      textAlign: "left",
      fontSize: "1rem",
    },
  },
  ".TertiaryTableCell": {
    border: `1px solid ${theme.palette.lightGrayBlue.main}`,
    overflowX: "hidden",
  },
  ".SecondaryTableCellContainer": {
    maxHeight: "10rem",
    textAlign: "left",
    overflowX: "hidden",
  },
  ".TertiaryTable": {
    overflowY: "auto",
    overflowX: "hidden",
    border: `1px solid ${theme.palette.lightGrayBlue.main}`,
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

  // Right Scrollbar
  ".RightScrollbar": {
    scrollbarGutter: "stable",
    "&::-webkit-scrollbar": {
      width: 12,
    },
    "&::-webkit-scrollbar-track": {
      backgroundColor: theme.palette.lightGrayBlue.main,
    },
    "&::-webkit-scrollbar-thumb": {
      backgroundColor: theme.palette.grayBlue.main,
    },
  },
  ".RightScrollbarNoEdges": {
    "&::-webkit-scrollbar": {
      width: 12,
    },
    "&::-webkit-scrollbar-track": {
      backgroundColor: theme.palette.lightGrayBlue.main,
    },
    "&::-webkit-scrollbar-thumb": {
      backgroundColor: theme.palette.grayBlue.main,
    },
  },

  ".OSCALCheckbox": {
    color: theme.palette.primaryAccent.main,
    "&$checked": {
      color: theme.palette.primaryAccent.main,
    },
  },
  ".OSCALRadio": {
    color: theme.palette.primaryAccent.main,
    "&$checked": {
      color: theme.palette.primaryAccent.main,
    },
  },

  // Buttons
  ".inputFile[type=file]::file-selector-button": {
    marginRight: "1rem",
    paddingTop: "0.25rem",
    paddingBottom: "0.25rem",
    borderRadius: "3px",
    background: theme.palette.lightBlue.main,
    border: `1px solid ${theme.palette.secondary.main}}`,
  },
});

export const OSCALGlobalStyles = ({ theme }) => {
  return <GlobalStyles styles={globalStyles(theme)} />;
};
