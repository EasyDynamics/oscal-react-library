import { Alert, Typography, styled } from "@mui/material";
import React from "react";

const ErrorAlert = styled(Alert)(({ theme }) => ({
  borderLeft: `10px solid ${theme.palette.destructive.main}`,
  borderTop: `1px solid ${theme.palette.destructive.main}`,
  borderBottom: `1px solid ${theme.palette.destructive.main}`,
  borderRight: `1px solid ${theme.palette.destructive.main}`,
  backgroundColor: (theme) => theme.palette.lightPink.main,
  minWidth: "30rem",
  maxHeight: "17rem",
}));

export const OSCALError = (props) => {
  return (
    <ErrorAlert severity="error" {...props}>
      {props.children}
    </ErrorAlert>
  );
};

export const OSCALAlertError = (props) => {
  return (
    <Alert
      severity="error"
      {...props}
      sx={{
        borderLeft: (theme) => `10px solid ${theme.palette.destructive.main}`,
        borderTop: (theme) => `1px solid ${theme.palette.destructive.main}`,
        borderBottom: (theme) => `1px solid ${theme.palette.destructive.main}`,
        borderRight: (theme) => `1px solid ${theme.palette.destructive.main}`,
        backgroundColor: (theme) => theme.palette.lightPink.main,
        minWidth: "30rem",
        maxHeight: "17rem",
      }}
    >
      <Typography
        sx={{
          textTransform: "uppercase",
          color: (theme) => theme.palette.destructive.main,
          textAlign: "left",
        }}
      >
        Errors
      </Typography>
      {props.children}
    </Alert>
  );
};

export const OSCALAlertWarning = (props) => {
  return (
    <Alert
      severity="warning"
      {...props}
      sx={{
        borderLeft: (theme) => `10px solid ${theme.palette.warning.main}`,
        borderTop: (theme) => `1px solid ${theme.palette.warning.main}`,
        borderBottom: (theme) => `1px solid ${theme.palette.warning.main}`,
        borderRight: (theme) => `1px solid ${theme.palette.warning.main}`,
        backgroundColor: (theme) => theme.palette.lightYellow.main,
        minWidth: "30rem",
        maxHeight: "17rem",
      }}
    >
      <Typography
        sx={{
          textTransform: "uppercase",
          color: (theme) => theme.palette.warning.main,
          textAlign: "left",
        }}
      >
        Warnings
      </Typography>
      {props.children}
    </Alert>
  );
};
