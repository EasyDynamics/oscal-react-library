import Button from "@mui/material/Button";
import React from "react";

// TODO: Add class name
export const OSCALPrimaryButton = (props) => {
  return <Button {...props} variant="contained" color="primary" disableElevation />;
};

export const OSCALSecondaryButton = (props) => {
  return (
    <Button
      {...props}
      variant="outlined"
      color="primary"
      disableElevation
      sx={(theme) => ({
        fill: theme.palette.primary.main,
        transition: "0.3s",
        ":hover": {
          backgroundColor: theme.palette.secondary.main,
          color: theme.palette.white.main,
          fill: theme.palette.white.main,
        },
      })}
    />
  );
};

export const OSCALSmallSecondaryButton = (props) => {
  return (
    <Button
      {...props}
      variant="outlined"
      color="primary"
      disableElevation
      sx={{
        fontSize: "0.75rem",
        marginTop: "0.5rem",
        marginBottom: 0,
        padding: 0,
        ":hover": {
          backgroundColor: (theme) => theme.palette.secondary.main,
          color: (theme) => theme.palette.white.main,
        },
      }}
    />
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
          backgroundColor: (theme) => theme.palette.lightBlue.main,
        },
      }}
    />
  );
};

export const OSCALTertiaryGrayscaleButton = (props) => {
  return (
    <Button
      {...props}
      variant="text"
      disableElevation
      sx={{
        paddingX: "0.25rem",
        marginX: 0,
        color: (theme) => theme.palette.black.main,
        ":hover": {
          backgroundColor: (theme) => theme.palette.gray.main,
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
        backgroundColor: (theme) => theme.palette.destructive.main,
        ":hover": {
          backgroundColor: (theme) => theme.palette.destructive.dark,
        },
      }}
    />
  );
};

export const OSCALUnsatisfiedButton = (props) => {
  return (
    <Button
      {...props}
      variant="contained"
      disableElevation
      sx={{
        color: (theme) => theme.palette.black.main,
        backgroundColor: (theme) => theme.palette.lightPink.main,
        ":hover": {
          backgroundColor: (theme) => theme.palette.lightPink.dark,
        },
      }}
    />
  );
};

export const OSCALSatisfiedButton = (props) => {
  return (
    <Button
      {...props}
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

export const OSCALImportButton = (props) => {
  return (
    <form>
      <input {...props} type="file" className="InputFile" />
    </form>
  );
};
