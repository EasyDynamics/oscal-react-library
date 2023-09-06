import "@mui/material/styles/createPalette";

declare module "@mui/material/styles/createPalette" {
  interface Palette {
    backgroundGray: PaletteColor;
    primaryAccent: PaletteColor;
  }
  interface PaletteOptions {
    backgroundGray?: PaletteColorOptions;
    primaryAccent?: PaletteColorOptions;
  }
}
