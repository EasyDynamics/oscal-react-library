import { createTheme } from "@mui/material/styles";

export const appTheme = createTheme({
  palette: {
    // Primary color palette
    primary: {
      main: "#002867",
    },
    secondary: {
      main: "#023E88",
    },
    backgroundGray: {
      main: "#F6F6F6",
    },
    primaryAccent: {
      main: "#FF6600",
    },
    lightBlue: {
      main: "#E2ECFA",
    },
    lightGrayBlue: {
      main: "#E8EBF1",
    },
    grayBlue: {
      main: "#B4BCCC",
    },
  },
  typography: {
    h1: {
      fontWeight: "700",
      fontSize: "2rem",
    },
    h2: {
      fontWeight: "700",
      color: "#002876",
      fontSize: "1.375rem",
    },
    h3: {
      fontWeight: "400",
      fontSize: "1.25rem",
    },
    body1: {
      fontWeight: "400",
      fontSize: "1rem",
      letterSpacing: ".05rem",
    },
    body2: {
      fontSize: "0.85rem",
    },
    fontWeightLight: "300",
    fontWeightRegular: "400",
    fontWeightMedium: "600",
    fontWeightBold: "700",
    fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          fontWeight: "600",
          fontSize: "16px",
          borderRadius: "3px",
          lineHeight: "20px",
        },
        contained: {
          backgroundColor: "#023E88",
          "&:hover": {
            backgroundColor: "#002867",
          },
        },
      },
    },
  },
});
