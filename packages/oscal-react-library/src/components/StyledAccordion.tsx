import ArrowForwardSharp from "@mui/icons-material/ArrowForwardIosSharp";
import MuiAccordion from "@mui/material/Accordion";
import MuiAccordionSummary from "@mui/material/AccordionSummary";
import React from "react";

export const Accordion = (props: any) => (
  <MuiAccordion className="Accordion" disableGutters elevation={0} square {...props} />
);

export const AccordionSummary = (props: any) => (
  <MuiAccordionSummary className="AccordionSummary" expandIcon={<ArrowForwardSharp />} {...props} />
);
