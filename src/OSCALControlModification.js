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
 * @param {String} controlPartId Control part ID to match
 * @returns html object
 */
const getAlterAddsOrRemovesDisplay = (
  addsElements,
  addsLabel,
  controlPartId
) => {
  if (!addsElements?.length) {
    return null;
  }

  // Handle adds; however, the parts attribute is ignored for
  // now due to parsing complications.
  const typographies = addsElements
    .flatMap((element) => element.props ?? [])
    .map((item) => (
      <Typography
        color="textSecondary"
        paragraph
        variant="body1"
        key={controlPartId}
      >
        Name: {item.name}, Value: {item.value}
      </Typography>
    ));

  const labelTypograhy = <Typography variant="h6">{addsLabel}</Typography>;

  return (
    <DialogContent>
      {labelTypograhy}
      {typographies}
    </DialogContent>
  );
};

/**
 * Check if an element has a valid id.
 *
 * @param {String} controlPartId Control part ID to match
 * @param {String} controlId ID of the control, used to check if this is a top-level modification
 * @param {Object} element Add/Remove element to check id of
 * @param {String} field Field of Add/Remove element to check
 * @returns true if element matches controlPartID, OR if this should render a top-level modification
 */
const isRelevantId = (controlPartId, controlId, element, field) => {
  if (!element[field]) {
    // If by-id of this modification is undefined, check if it can be rendered at the top level
    return controlPartId === controlId;
  }
  // otherwise check if by-id matches this control part's ID
  return element[field] === controlPartId;
};

/**
 * Get the modifications from the adds/removes list.
 *
 * @param {String} controlPartId Control part Id to check compare element id's with
 * @param {String} controlId ID of the control
 * @param {object} modList List of modifications
 * @param {String} modText String to display type of modification
 * @returns an HTML element
 */
const getModifications = (controlPartId, controlId, modList, modText) => {
  // Add everything with ids that match controlPartId

  /* TODO: Differences in implementations of the OSCAL standard makes
  /* this check needed; Certain implementations specify the control ID 
  /* in the "by-id" field for top-level modifications, 
  /* others leave "by-id" undefined. 
  /* See if this can be cleaned up at some point if these differences are resolved.
  */
  const controlParts = modList.filter((element) =>
    isRelevantId(controlPartId, controlId, element, "by-id")
  );

  // return display & mod length
  return [
    getAlterAddsOrRemovesDisplay(controlParts, modText, controlPartId),
    controlParts.length,
  ];
};

export default function OSCALControlModification(props) {
  // Finds the control-id within alters and matches it with a resolved control
  const alter = props.modifications?.alters?.find(
    (element) => element["control-id"] === props.controlId
  );

  if (!alter) {
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

  // If this was called at the top-level of the control, the id is the same as control id
  const controlPartId = props.controlPartId ?? props.controlId;

  let addsDisplay = null;
  const removesDisplay = null;
  let len;
  let modLength = 0;

  // Get all add modifications
  if (alter.adds) {
    [addsDisplay, len] = getModifications(
      controlPartId,
      props.controlId,
      alter.adds,
      "Adds "
    );
    modLength += len;
  }

  // TODO(EGRC-407): Implement remove modifications
  // if (alter.removes) { }

  // Display modifications if there are any
  if (!modLength) return null;
  return (
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
            aria-label={`${controlPartId} modifications`}
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
}
