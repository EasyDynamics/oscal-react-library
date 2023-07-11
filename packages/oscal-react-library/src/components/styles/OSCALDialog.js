import { ErrorOutline } from "@mui/icons-material";
import CloseIcon from "@mui/icons-material/Close";
import { Dialog, DialogActions, DialogTitle, Stack } from "@mui/material";
import { IconButton } from "@mui/material";
import Typography from "@mui/material/Typography";
import React from "react";

export const OSCALWarningDialog = (props) => {
  return (
    <Dialog
      {...props}
      PaperProps={{
        sx: {
          borderLeft: (theme) => `10px solid ${theme.palette.destructive.main}`,
          minWidth: "30rem",
        },
      }}
    ></Dialog>
  );
};

export const OSCALDialogTitle = (props) => {
  return (
    <DialogTitle>
      <Typography
        sx={{
          color: (theme) => theme.palette.primary.main,
          fontWeight: (theme) => theme.typography.fontWeightBold,
          fontSize: "1.375rem",
        }}
      >
        <Stack direction="row" sx={{ alignItems: "center" }}>
          {props.warning && (
            <ErrorOutline
              sx={{
                fill: (theme) => theme.palette.destructive.main,
                marginRight: "0.5rem",
              }}
            />
          )}
          {props.title}
        </Stack>
      </Typography>
      <Typography>{props.subtitle}</Typography>
      {props.onClose && (
        <IconButton
          onClick={props.onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grayBlue.main,
          }}
        >
          <CloseIcon />
        </IconButton>
      )}
    </DialogTitle>
  );
};

export const OSCALDialogTitleWarning = (props) => {
  return (
    <Stack direction="row" sx={{ alignItems: "center" }}>
      <ErrorOutline
        sx={{
          fill: (theme) => theme.palette.destructive.main,
        }}
      />
      <OSCALDialogTitle {...props} />
    </Stack>
  );
};

export const OSCALDialogActions = (props) => {
  return <DialogActions {...props} sx={{ paddingBottom: "1.5rem", paddingRight: "1.5rem" }} />;
};

// Ensure that users are unable to close the Dialog modal by clicking on the backdrop
export const OSCALEditingDialog = (props) => {
  return (
    <Dialog
      {...props}
      open
      onClose={(event, reason) => {
        if (reason !== "backdropClick") {
          {
            props.onClose();
          }
        }
      }}
    />
  );
};
