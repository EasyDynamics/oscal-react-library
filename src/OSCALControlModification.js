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

  // Check the number of adds and removes for a number to be displayed as the badge
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

  // Finds the control-id within alters and matches it with a resolved control
  const alter = props.modifications.alters.find(
    (element) => element["control-id"] === props.control.id
  );

  let modificationsDisplay;
  let addObject;
  let removeObject;
  // eslint-disable-next-line
  props.modifications.addRemoveControlPart = [];
  let addsDisplay;
  let removesDisplay;

  if (alter) {
    if (alter.adds) {
      // iterate through each "add" and check if the id-ref matches props.partId
      // if it matches, push the "add" to the array
      alter.adds.forEach((add) => {
        if (add["id-ref"]) {
          addObject = add.find((add) => add["id-ref"] === props.partId);
          props.modifications.addRemoveControlPart.push(...addObject);
        }
      });
      addsDisplay = (
        <DialogContent dividers>
          {alter.adds.map((add) => (
            // TODO - consider making this into a table
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

    if (alter.removes) {
      // iterate through each "add" and check if the id-ref matches props.partId
      // if it matches, push the "add" to the array
      alter.removes.forEach((remove) => {
        if (remove["id-ref"]) {
          removeObject = remove.find(
            (remove) => remove["id-ref"] === props.partId
          );
          props.modifications.addRemoveControlPart.push(...removeObject);
        }
      });
      removesDisplay = (
        <DialogContent dividers>
          {alter.removes.map((remove) => (
            // TODO - consider making this into a table
            <DialogContentText
              color="textprimary"
              id="scroll-dialog-description"
              tabIndex={-1}
              variant="h6"
            >
              Removes:
              <Typography
                color="textsecondary"
                paragraph="true"
                variant="body1"
              >
                id-ref: {remove["id-ref"]}
                name-ref: {remove["name-ref"]}
              </Typography>
            </DialogContentText>
          ))}
        </DialogContent>
      );
    }
  }

  // For each addRemoveControlPart find the add or remove that matches the part id
  let controlPartObject;
  props.modifications.addRemoveControlPart.forEach((addRemove) => {
    controlPartObject = addRemove.find(
      (addRemove) => addRemove["id-ref"] === props.partId
    );
  });

  // Display if alter or controlPartObject is true
  if (alter || controlPartObject) {
    modificationsDisplay = (
      <div>
        <Tooltip title="Modifications">
          <Badge
            anchorOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            color="secondary"
            badgeContent={getModLength(alter.adds, alter.removes)}
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
          <DialogTitle id="scroll-dialog-title">Modifications</DialogTitle>
          {addsDisplay}
          {removesDisplay}
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  } else {
    modificationsDisplay = null;
  }

  return <div>{modificationsDisplay}</div>;
}
