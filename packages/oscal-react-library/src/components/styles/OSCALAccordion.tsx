import ArrowForwardSharp from "@mui/icons-material/ArrowForwardIosSharp";
import MuiAccordion, { AccordionProps } from "@mui/material/Accordion";
import MuiAccordionDetails, { AccordionDetailsProps } from "@mui/material/AccordionDetails";
import MuiAccordionSummary, { AccordionSummaryProps } from "@mui/material/AccordionSummary";
import React from "react";

export const Accordion = (props: AccordionProps) => (
  <MuiAccordion className="Accordion" disableGutters elevation={0} square {...props} />
);

export const AccordionDetails = (props: AccordionDetailsProps) => (
  <MuiAccordionDetails {...props} />
);

export const AccordionSummary = (props: AccordionSummaryProps) => (
  <MuiAccordionSummary className="AccordionSummary" expandIcon={<ArrowForwardSharp />} {...props} />
);
