import { Dialog, DialogContent, DialogTitle, SvgIcon, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import React from "react";
import StyledTooltip from "./OSCALStyledTooltip";

interface ButtonLaunchedDialogProps {
  /**
   * The icon to display to open the dialog
   */
  Icon: typeof SvgIcon;

  /**
   * The title to display specifically in tooltips that describe the dialog
   *
   * @default the value of `title`
   */
  toolTipTitle?: string;

  /**
   * The title of the item being viewed in the dialog
   */
  title: React.ReactNode;

  /**
   * The dialog contents
   */
  children: React.ReactNode;

  /**
   * Whether launching the dialog should be disabled.
   *
   * @default false - the dialog is enabled
   */
  disabled?: boolean;
}

export const ButtonLaunchedDialog: React.FC<ButtonLaunchedDialogProps> = ({
  Icon,
  toolTipTitle,
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
  // The type defined for the `event` parameter for a dialog's `onClose` handler
  // is `{}` which doesn't seem to be correct it's unclear what it's
  // supposed to be but `MouseEvent` is close enough and gives us
  // the `stopPropagation` method.
  const handleClose = (e: MouseEvent, reason: string) => {
    setOpen(false);
    if (reason === "backdropClick") {
      e.stopPropagation();
    }
  };

  return (
    <>
      <StyledTooltip title={`Open ${toolTipTitle ?? title}`}>
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
            aria-label={`Open ${toolTipTitle ?? title}`}
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
