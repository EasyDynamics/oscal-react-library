import React from "react";
import Badge from "@material-ui/core/Badge";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import IconButton from "@material-ui/core/IconButton";
import LayersIcon from "@material-ui/icons/Layers";
import { makeStyles } from "@material-ui/core/styles";
import { Tooltip, Typography } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  OSCALControlModificationsButton: {
    color: "#002867",
    "margin-top": "1em",
    "margin-bottom": "0.5em",
  },
}));

export default function OSCALControlModification(props) {
  const classes = useStyles();

  const [open, setOpen] = React.useState(false);

  const handleClick = () => {
    setOpen(!open);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const getModLength = (adds, removes) => {
    let addsLength = 0;
    let removesLength = 0;
    if (adds) {
      addsLength = adds.length;
    }
    if (removes) {
      removesLength = removes.length;
    }
    return addsLength + removesLength;
  };

  let addsDisplay;
  let removesDisplay;
  if (props.modification.adds) {
    addsDisplay = (
      <DialogContent dividers>
        {props.modification.adds.map((add) => (
          <DialogContentText
            color="textprimary"
            id="scroll-dialog-description"
            tabIndex={-1}
            variant="h6"
          >
            Adds:
            {add.props.map((prop) => (
              <Typography
                color="textsecondary"
                paragraph="true"
                variant="body1"
              >
                Name:{prop.name}, Value:{prop.value}
              </Typography>
            ))}
          </DialogContentText>
        ))}
      </DialogContent>
    );
  }
  if (props.modification.removes) {
    removesDisplay = (
      <DialogContent dividers>
        {props.modification.removes.map((remove) => (
          <DialogContentText
            color="textprimary"
            id="scroll-dialog-description"
            tabIndex={-1}
            variant="h6"
          >
            Removes:
            {remove.props.map((prop) => (
              <Typography
                color="textsecondary"
                paragraph="true"
                variant="body1"
              >
                Name:{prop.name}, Value:{prop.value}
              </Typography>
            ))}
          </DialogContentText>
        ))}
      </DialogContent>
    );
  }

  return (
    <>
      <Tooltip title="Modification">
        <Badge
          anchorOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          color="secondary"
          badgeContent={getModLength(
            props.modification.adds,
            props.modification.removes
          )}
          overlap="circle"
        >
          <IconButton
            variant="outlined"
            size="small"
            className={classes.OSCALControlModificationsButton}
            onClick={handleClick}
          >
            <LayersIcon />
          </IconButton>
        </Badge>
      </Tooltip>
      <Dialog
        open={open}
        onClose={handleClose}
        scroll="paper"
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
      >
        <DialogTitle id="scroll-dialog-title">Modification</DialogTitle>
        {addsDisplay}
        {removesDisplay}
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
