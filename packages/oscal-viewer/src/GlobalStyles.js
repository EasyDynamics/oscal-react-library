import React from "react";
import { GlobalStyles } from "@mui/material";

const globalStyles = (theme) => ({
  body: {
    backgroundColor: theme.palette.secondary.main,
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
