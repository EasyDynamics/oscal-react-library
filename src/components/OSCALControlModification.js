import React from "react";
import { styled } from "@mui/material/styles";
import Badge from "@mui/material/Badge";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import LayersIcon from "@mui/icons-material/Layers";
import { Typography } from "@mui/material";
import StyledTooltip from "./OSCALStyledTooltip";

const OSCALControlModificationsButton = styled(IconButton)(
  ({ theme }) => `color: ${theme.palette.primary.main}`
);

/**
 * Create a typography html object for addsOrRemovesLabel
 *
 * @param {Object} addsElements add or remove object to map into html
 * @param {String} addsLabel boolean variable, true if adding
 * @param {String} controlPartId Control part ID to match
 * @returns html object
 */
function getAlterAddsOrRemovesDisplay(addsElements, addsLabel, controlPartId) {
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
    <DialogContent dividers>
      {labelTypograhy}
      {typographies}
    </DialogContent>
  );
}

/**
 * Check if an element has a valid id.
 *
 * @param {String} controlPartId Control part ID to match
 * @param {String} controlId ID of the control, used to check if this is a top-level modification
 * @param {Object} element Add/Remove element to check id of
 * @param {String} field Field of Add/Remove element to check
 * @returns true if element matches controlPartID, OR if this should render a top-level modification
 */
function isRelevantId(controlPartId, controlId, element, field) {
  if (!element[field]) {
    // If by-id of this modification is undefined, check if it can be rendered at the top level
    return controlPartId === controlId;
  }
  // otherwise check if by-id matches this control part's ID
  return element[field] === controlPartId;
}

/**
 * Get the modifications from the adds/removes list.
 *
 * @param {String} controlPartId Control part Id to check compare element id's with
 * @param {String} controlId ID of the control
 * @param {object} modList List of modifications
 * @param {String} modText String to display type of modification
 * @returns an HTML element
 */
function getModifications(controlPartId, controlId, modList, modText) {
  // Add everything with ids that match controlPartId

  // TODO: Some OSCAL standard implementations specify the control ID in 
  // the "by-id" field, others do not, which is what makes this check needed.
  // If these implementation differences are resolved, this should be cleaned up.
  // https://github.com/EasyDynamics/oscal-react-library/issues/498

  const controlParts = modList.filter((element) =>
    isRelevantId(controlPartId, controlId, element, "by-id")
  );

  // return display & mod length
  return [
    getAlterAddsOrRemovesDisplay(controlParts, modText, controlPartId),
    controlParts.length,
  ];
}

export default function OSCALControlModification(props) {
  // Finds the control-id within alters and matches it with a resolved control
  const alter = props.modificationAlters?.find(
    (element) => element["control-id"] === props.controlId
  );

  if (!alter) {
    return null;
  }

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

  // TODO: There should also be a way to get all remove modifications so that
  // users can better understand control modifications with an OSCAL Profile.
  // https://github.com/EasyDynamics/oscal-react-library/issues/89

  // Display modifications if there are any
  if (!modLength) return null;
  return (
    <>
      <StyledTooltip title="Modifications">
        <Badge
          anchorOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          color="info"
          badgeContent={modLength}
          overlap="circular"
        >
          <OSCALControlModificationsButton
            variant="outlined"
            size="small"
            aria-label={`${controlPartId} modifications`}
            onClick={handleClick}
          >
            <LayersIcon />
          </OSCALControlModificationsButton>
        </Badge>
      </StyledTooltip>
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
    </>
  );
}
