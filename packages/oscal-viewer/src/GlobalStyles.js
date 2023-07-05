import React from "react";
import { GlobalStyles } from "@mui/material";

const globalStyles = (theme, drawerWidth, appBarHeight) => ({
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
    marginLeft: drawerWidth,
    marginTop: appBarHeight,
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
});

export const OSCALGlobalStyles = ({ theme, drawerWidth, appBarHeight }) => {
  return <GlobalStyles styles={globalStyles(theme, drawerWidth, appBarHeight)} />;
};
