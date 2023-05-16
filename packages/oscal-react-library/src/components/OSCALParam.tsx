import { Parameter } from "@easydynamics/oscal-types";
import DataObjectIcon from "@mui/icons-material/DataObject";
import React from "react";
import { Typography } from "@mui/material";
import { OSCALPropertiesDialog } from "./OSCALProperties";
import { Stack } from "@mui/system";
import { Accordion, AccordionDetails, AccordionSummary } from "./StyedAccordion";
import { ButtonLaunchedDialog } from "./ButtonLaunchedDialog";
import { OSCALMarkupMultiLine } from "./OSCALMarkupProse";

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
          <Typography>{param.id}</Typography>
          <Typography sx={{ color: "text.secondary" }}>{paramLabel}</Typography>
          <OSCALPropertiesDialog properties={param.props} />
        </Stack>
      </AccordionSummary>
      <AccordionDetails>
        <Stack direction="column" spacing={2}>
          <OSCALMarkupMultiLine>{param.remarks}</OSCALMarkupMultiLine>
          {param.guidelines?.map((guideline) => (
            <OSCALMarkupMultiLine key={guideline.prose}>{guideline.prose}</OSCALMarkupMultiLine>
          ))}
        </Stack>
      </AccordionDetails>
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

export const OSCALParamsDialog = (props: OSCALParamsProps) => (
  <ButtonLaunchedDialog title="Parameters" disabled={!props.params} Icon={DataObjectIcon}>
    <OSCALParams params={props.params} />
  </ButtonLaunchedDialog>
);
