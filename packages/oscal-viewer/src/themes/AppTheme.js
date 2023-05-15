import { createTheme } from "@mui/material/styles";

const primaryBlue = "#001131";
const secondaryBlue = "#023E88";
// const backgroundGray = "#F6F6F6";
// const primaryAccent = "#FF6600";

export const appTheme = createTheme({
  palette: {
    primary: {
      main: primaryBlue,
    },
    secondary: {
      main: secondaryBlue,
    },
  },
  typography: {
    h1: {
      fontWeight: "700",
      fontSize: "2rem",
    },
    h2: {
      fontWeight: "700",
      fontSize: "1.375rem",
      color: primaryBlue,
    },
    body: {
      fontWeight: "400",
      fontSize: "1rem",
    },
    fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          fontWeight: "600",
          fontSize: "16px",
          borderRadius: "5px",
          lineHeight: "20px",
        },
        contained: {
          backgroundColor: secondaryBlue,
          "&:hover": {
            backgroundColor: primaryBlue,
          },
        },
      },
    },
  },
});
