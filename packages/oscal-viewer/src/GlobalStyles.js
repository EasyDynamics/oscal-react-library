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
