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

/**
 * Create a typography html object for addsOrRemovesLabel
 *
 * @param {Object} addsElements add or remove object to map into html
 * @param {String} addsLabel boolean variable, true if adding
 * @returns html object
 */
const getAlterAddsOrRemovesDisplay = (addsElements, addsLabel) => {
  if (!addsElements?.length) {
    return null;
  }

  // Adding
  // Ignore parts for now
  const typographies = addsElements
    .flatMap((element) => element.props ?? [])
    .map((item) => (
      <Typography color="textsecondary" paragraph="true" variant="body1">
        Name: {item.name}, Value: {item.value}
      </Typography>
    ));

  return (
    // TODO - consider making this into a table
    <DialogContentText
      color="textprimary"
      id="scroll-dialog-description"
      tabIndex={-1}
      variant="h6"
    >
      {addsLabel}
      {typographies}
    </DialogContentText>
  );
};

/**
 * Check if an element has a valid id.
 *
 * @param {String} controlPartId Control part ID to match
 * @param {Object} element Add/Remove element to check id of
 * @param {String} field Field of Add/Remove element to check
 * @returns true if element matches controlID
 */
const isRelevantId = (controlPartId, element, field, isTopLevel) =>
  // TODO: Differences in how NIST and FedRAMP implement adds makes
  // this check needed. See if we can clean this up at some point.
  // Assumes the difference is that NIST does not have a "control-id" field
  (!element[field] && isTopLevel) || element[field] === controlPartId;

/**
 * Get the modifications from the adds/removes list.
 *
 * @param {String} controlPartId Control part Id to check compare element id's with
 * @param {object} modList List of modifications
 * @param {String} modText String to display type of modification
 * @returns an HTML element
 */
const getModifications = (controlPartId, isTopLevel, modList, modText) => {
  // Add everything with ids that match controlPartId
  const controlParts = modList.filter((element) =>
    isRelevantId(controlPartId, element, "by-id", isTopLevel)
  );

  // return display & mod length
  return [
    <DialogContent dividers>
      {getAlterAddsOrRemovesDisplay(controlParts, modText)}
    </DialogContent>,
    controlParts.length,
  ];
};

export default function OSCALControlModification(props) {
  if (!props.modifications || !props.modifications.alters) {
    return null;
  }

  const classes = useStyles();

  const [open, setOpen] = React.useState(false);

  const handleClick = () => {
    setOpen(!open);
  };
  const handleClose = () => {
    setOpen(false);
  };

  // Finds the control-id within alters and matches it with a resolved control
  const alter = props.modifications.alters.find(
    (element) => element["control-id"] === props.controlId
  );

  let modificationsDisplay;
  let addsDisplay = null;
  const removesDisplay = null;
  let len;
  let modLength = 0;

  if (alter) {
    // Get all add modifications
    if (alter.adds) {
      [addsDisplay, len] = getModifications(
        props.controlPartId,
        props.controlPartId === props.controlId,
        alter.adds,
        "Adds "
      );
      modLength += len;
    }

    // Get all remove modifications
    // if (alter.removes) {
    // DO NOTHING FOR NOW
    // }
  }

  // Display if altered is true
  if (modLength) {
    modificationsDisplay = (
      <span>
        <Tooltip title="Modifications">
          <Badge
            anchorOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            color="secondary"
            badgeContent={modLength}
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
      </span>
    );
  } else {
    modificationsDisplay = null;
  }

  return modificationsDisplay;
}
