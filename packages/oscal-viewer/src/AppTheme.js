import { createTheme } from "@mui/material/styles";

// Common palette colors
const primary = "#002867";
const secondary = "#023E88";
const backgroundGray = "#F6F6F6";
const primaryAccent = "#FF6600";

export const appTheme = createTheme({
  palette: {
    // Primary color palette
    primary: {
      main: primary,
    },
    secondary: {
      main: secondary,
    },
    backgroundGray: {
      main: backgroundGray,
    },
    primaryAccent: {
      main: primaryAccent,
    },
    // Secondary color palette
    lightBlue: {
      main: "#E2ECFA",
    },
    lightGrayBlue: {
      main: "#E8EBF1",
    },
    offWhite: {
      main: "#F3F5F8",
    },
    white: {
      main: "#FFFFFF",
    },
    black: {
      main: "#2B2B2B",
    },
    gray: {
      main: "#EAEAEA",
    },
    destructive: {
      main: "#B31515",
      dark: "#9B1616",
    },
    lightPink: {
      main: "#FFD9D9",
      dark: "#EEC8C8",
    },
    lightGreen: {
      main: "#DBF4E7",
      dark: "#CAE3D6",
    },
    lightYellow: {
      main: "#F8ECCD",
    },
    lightBlue: {
      main: "#A3C2EE",
      dark: "#649DED",
    },
    grayBlue: {
      main: "#B4BCCC",
    },
    // Other colors
    darkGray: {
      main: "#6A6A6A",
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
          backgroundColor: secondary,
          "&:hover": {
            backgroundColor: primary,
          },
        },
      },
    },
  },
});
