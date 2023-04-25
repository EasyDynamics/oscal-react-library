import React from "react";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { OSCALMarkupMultiLine } from "./OSCALMarkupProse";
import OSCALControlLabel from "./OSCALControlLabel";

const OSCALControlGuidanceButton = styled(Button)(
  ({ theme }) => `
  color: ${theme.palette.primary.main};
  margin-top: 1em;
  margin-bottom: 0.5em;
`
);

export default function OSCALControlGuidance(props) {
  const [open, setOpen] = React.useState(false);

  const handleClick = () => {
    setOpen(!open);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const descriptionElementRef = React.useRef(null);
  React.useEffect(() => {
    if (open) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }
  }, [open]);

  return (
    <>
      <OSCALControlGuidanceButton variant="outlined" size="small" onClick={handleClick}>
        Read Discussion
      </OSCALControlGuidanceButton>
      <Dialog
        open={open}
        onClose={handleClose}
        scroll="paper"
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
      >
        <DialogTitle id="scroll-dialog-title">
          <OSCALControlLabel id={props.id} label={props.label} component="span" />
          {` ${props.title} Discussion`}
        </DialogTitle>
        <DialogContent dividers>
          <OSCALMarkupMultiLine>{props.prose}</OSCALMarkupMultiLine>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
