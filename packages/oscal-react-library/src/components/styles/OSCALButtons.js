import styled from "@emotion/styled";
import Button from "@mui/material/Button";
import React from "react";

// Helper styling constants
const OSCALHelperPrimaryDestructiveButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.destructive.main,
  ":hover": {
    backgroundColor: theme.palette.destructive.dark,
  },
}));

const OSCALHelperSecondaryButton = styled(Button)(({ theme }) => ({
  fill: theme.palette.primary.main,
  transition: "0.3s",
  ":hover": {
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.white.main,
    fill: theme.palette.white.main,
  },
}));

const OSCALHelperSmallSecondaryButton = styled(Button)(({ theme }) => ({
  fontSize: "0.75rem",
  marginTop: "0.5rem",
  paddingX: "0.25rem",
  marginBottom: 0,
  paddingY: 0,
  ":hover": {
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.white.main,
  },
}));

const OSCALHelperTertiaryButton = styled(Button)(({ theme }) => ({
  ":hover": {
    backgroundColor: theme.palette.lightBlue.main,
  },
}));

const OSCALHelperTertiaryDestructiveButton = styled(Button)(({ theme }) => ({
  color: theme.palette.destructive.main,
  ":hover": {
    backgroundColor: theme.palette.lightPink.main,
  },
}));

const OSCALHelperTertiaryGrayscaleButton = styled(Button)(({ theme }) => ({
  paddingX: "0.25rem",
  marginX: 0,
  color: theme.palette.black.main,
  ":hover": {
    backgroundColor: theme.palette.gray.main,
  },
}));

const OSCALHelperUnsatisfiedButton = styled(Button)(({ theme }) => ({
  color: theme.palette.black.main,
  backgroundColor: theme.palette.lightPink.main,
  ":hover": {
    backgroundColor: theme.palette.lightPink.dark,
  },
}));

const OSCALHelperSatisfiedButton = styled(Button)(({ theme }) => ({
  color: theme.palette.black.main,
  backgroundColor: theme.palette.lightGreen.main,
  ":hover": {
    backgroundColor: theme.palette.lightGreen.dark,
  },
}));

// Button components
export const OSCALPrimaryButton = (props) => {
  return <Button {...props} variant="contained" color="primary" disableElevation />;
};

export const OSCALPrimaryDestructiveButton = (props) => {
  return <OSCALHelperPrimaryDestructiveButton {...props} variant="contained" disableElevation />;
};

export const OSCALSecondaryButton = (props) => {
  return <OSCALHelperSecondaryButton {...props} variant="outlined" disableElevation />;
};

export const OSCALSmallSecondaryButton = (props) => {
  return <OSCALHelperSmallSecondaryButton {...props} variant="outlined" disableElevation />;
};

export const OSCALSecondaryButtonSmall = (props) => {
  return (
    <Button
      {...props}
      variant="outlined"
      color="primary"
      disableElevation
      sx={{
        height: 20,
        ":hover": {
          backgroundColor: "#023E88",
          color: "#FFFFFF",
        },
      }}
    />
    //backgroundColor: (theme) => theme.palette.secondary.main,
    //color: (theme) => theme.palette.white.main,
  );
};

export const OSCALTertiaryButton = (props) => {
  return <OSCALHelperTertiaryButton {...props} variant="text" color="primary" disableElevation />;
};

export const OSCALTertiaryDestructiveButton = (props) => {
  return <OSCALHelperTertiaryDestructiveButton {...props} variant="text" disableElevation />;
};

export const OSCALTertiaryGrayscaleButton = (props) => {
  return <OSCALHelperTertiaryGrayscaleButton {...props} variant="text" disableElevation />;
};

export const OSCALUnsatisfiedButton = (props) => {
  return <OSCALHelperUnsatisfiedButton {...props} variant="contained" disableElevation />;
};

export const OSCALSatisfiedButton = (props) => {
  return <OSCALHelperSatisfiedButton {...props} variant="contained" disableElevation />;
};

export const OSCALImportButton = (props) => {
  return (
    <form>
      <input {...props} type="file" className="InputFile" />
    </form>
  );
};
