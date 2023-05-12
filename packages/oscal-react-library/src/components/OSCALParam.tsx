import { Parameter } from "@easydynamics/oscal-types";
import IconButton from "@mui/material/IconButton";
import DataObjectIcon from "@mui/icons-material/DataObject";
import Box from "@mui/material/Box";
import React from "react";
import StyledTooltip from "./OSCALStyledTooltip";
import { Dialog, DialogContent, DialogTitle, Typography } from "@mui/material";
import { OSCALPropertiesDialog } from "./OSCALProperties";
import { Stack } from "@mui/system";
import { Accordion, AccordionDetails, AccordionSummary } from "./StyedAccordion";

export interface OSCALParamProps {
  param: Parameter;
}

export const OSCALParam: React.FC<OSCALParamProps> = ({ param }) => {
  const paramLabel = param.label ?? param.values?.join(",");

  const [isOpen, setIsOpen] = React.useState(false);

  const handleClick = () => {
    setIsOpen(!isOpen);
  };

  return (
    <Accordion expanded={isOpen} onChange={handleClick}>
      <AccordionSummary>
        <Stack direction="row" alignItems="center" justifyContent="space-between" width="100%">
          <Typography>{paramLabel}</Typography>
          <OSCALPropertiesDialog properties={param.props} />
        </Stack>
      </AccordionSummary>
      <AccordionDetails>PUT INFO HERE</AccordionDetails>
    </Accordion>
  );
};

export interface OSCALParamsProps {
  params: Parameter[] | undefined;
}

export const OSCALParams: React.FC<OSCALParamsProps> = ({ params }) => {
  return (
    <>
      {params?.map((param) => (
        <div key={param.id}>{<OSCALParam param={param} />}</div>
      ))}
    </>
  );
};

export const OSCALParamsDialog: React.FC<OSCALParamsProps> = ({ params }) => {
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <StyledTooltip title="Open Parameters">
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
            aria-label="Open Parameters"
            disabled={!params}
          >
            <DataObjectIcon />
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
        sx={{ maxHeight: "75em" }}
      >
        <DialogContent>
          <DialogTitle>
            <Typography>Parameters</Typography>
          </DialogTitle>
          <OSCALParams params={params} />
        </DialogContent>
      </Dialog>
    </>
  );
};
