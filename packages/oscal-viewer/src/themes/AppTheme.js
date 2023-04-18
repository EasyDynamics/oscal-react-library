import { createTheme } from "@mui/material/styles";

export const appTheme = createTheme({
  palette: {
    primary: {
      main: "#002867",
    },
  },
  typography: {
    h1: {
      fontWeight: "700",
      fontSize: "50px",
    },
    fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          fontWeight: "600",
          fontSize: "16px",
          wordSpacing: "35px",
          borderRadius: "5px",
          lineHeight: "20px",
        },
        contained: {
          backgroundColor: "#073C92",
          "&:hover": {
            backgroundColor: "#0B4CB7",
          },
        },
      },
    },
  },
});
