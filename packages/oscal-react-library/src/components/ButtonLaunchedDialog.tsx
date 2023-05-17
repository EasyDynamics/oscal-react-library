import { Dialog, DialogContent, DialogTitle, SvgIcon, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import React from "react";
import StyledTooltip from "./OSCALStyledTooltip";

interface ButtonLaunchedDialogProps {
  Icon: typeof SvgIcon;
  title: string | React.ReactElement;
  children: React.ReactNode;
  disabled?: boolean;
}

export const ButtonLaunchedDialog: React.FC<ButtonLaunchedDialogProps> = ({
  Icon,
  disabled,
  children,
  title,
}) => {
  const [open, setOpen] = React.useState(false);

  // These event handlers (and the dialog below) specify `stopPropagation` to
  // avoid the click event from being passed on. This is because within the
  // library, the button and dialog often appear in contexts where clicks
  // matter (such as in an AccordionSummary).
  const handleOpen = (e: React.MouseEvent) => {
    setOpen(true);
    e.stopPropagation();
  };
  // The type defined for `onClose` for a dialog is `{}` which doesn't seem
  // to be correct it's unclear what it's supposed to be but `MouseEvent` is
  // close enough and gives us the `stopPropagation` method.
  const handleClose = (e: MouseEvent, reason: string) => {
    setOpen(false);
    if (reason === "backdropClick") {
      e.stopPropagation();
    }
  };

  return (
    <>
      <StyledTooltip title={`Open ${title}`}>
        {
          // This Box is necessary to ensure the tooltip is present when the button is disabled.
          // If the Button were never disabled, the Box can be removed. This change may be made
          // when property editing is enabled to ensure that the dialog can be opened to edit &
          // create properties, even when none exist. In that case, even the Tooltip wrapper may
          // not be necessary.
        }
        <Box display="inline">
          <IconButton
            color="primary"
            size="small"
            onClick={handleOpen}
            aria-label={`Open ${title}`}
            disabled={disabled}
          >
            <Icon />
          </IconButton>
        </Box>
      </StyledTooltip>
      <Dialog
        open={open}
        onClose={handleClose}
        scroll="paper"
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
        maxWidth="md"
        fullWidth
        sx={{
          maxHeight: "75em",
        }}
      >
        <DialogContent onClick={(e) => e.stopPropagation()}>
          <DialogTitle>
            <Typography>{title}</Typography>
          </DialogTitle>
          {children}
        </DialogContent>
      </Dialog>
    </>
  );
};