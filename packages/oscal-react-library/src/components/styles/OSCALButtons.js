import Button from "@mui/material/Button";
import React from "react";

// TODO: Add class name
export const OSCALPrimaryButton = (props) => {
  return <Button {...props} className="" variant="contained" color="primary" disableElevation />;
};

export const OSCALSecondaryButton = (props) => {
  return (
    <Button
      {...props}
      variant="outlined"
      color="primary"
      disableElevation
      sx={{
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
  return (
    <Button
      {...props}
      variant="text"
      color="primary"
      disableElevation
      sx={{
        ":hover": {
          // backgroundColor: (theme) => theme.palette.lightBlue.main,
          backgroundColor: "#E2ECFA",
        },
      }}
    />
  );
};

export const OSCALDestructiveButton = (props) => {
  return (
    <Button
      {...props}
      className="DestructiveButton"
      variant="contained"
      disableElevation
      sx={{
        backgroundColor: "#B31515", //(theme) => theme.palette.destructive.main,
        ":hover": {
          backgroundColor: "#9B1616", //(theme) => theme.palette.destructive.dark,
        },
      }}
    />
  );
};

export const OSCALUnsatisfiedButton = (props) => {
  return (
    <Button
      {...props}
      className=""
      variant="contained"
      disableElevation
      sx={{
        color:  "#B31515", // (theme) => theme.palette.black.main,
        backgroundColor: "#FFD9D9", //(theme) => theme.palette.lightPink.main,
        ":hover": {
          backgroundColor: "#EEC8C8", //(theme) => theme.palette.lightPink.dark,
        },
      }}
    />
  );
};

export const OSCALSatisfiedButton = (props) => {
  return (
    <Button
      {...props}
      className=""
      variant="contained"
      disableElevation
      sx={{
        color: (theme) => theme.palette.black.main,
        backgroundColor: (theme) => theme.palette.lightGreen.main,
        ":hover": {
          backgroundColor: (theme) => theme.palette.lightGreen.dark,
        },
      }}
    />
  );
};
