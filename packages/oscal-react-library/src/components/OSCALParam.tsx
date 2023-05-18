import {
  Constraint,
  Guideline,
  Parameter,
  ParameterCardinality,
  Link as OSCALLink,
} from "@easydynamics/oscal-types";
import DataObjectIcon from "@mui/icons-material/DataObject";
import React from "react";
import {
  Divider,
  FormControl,
  FormHelperText,
  Link,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Typography,
} from "@mui/material";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { OSCALPropertiesDialog } from "./OSCALProperties";
import { Stack } from "@mui/system";
import { Accordion, AccordionDetails, AccordionSummary } from "./StyedAccordion";
import { ButtonLaunchedDialog } from "./ButtonLaunchedDialog";
import { OSCALMarkupMultiLine } from "./OSCALMarkupProse";
import { OSCALSectionHeader } from "../styles/CommonPageStyles";
import {
  StyledHeaderTableCell,
  StyledTableHead,
  StyledTableRow,
} from "./OSCALSystemImplementationTableStyles";

interface OSCALParamUsageProps {
  usage: string | undefined;
}

const OSCALParamUsage: React.FC<OSCALParamUsageProps> = ({ usage }) => {
  if (!usage) {
    return null;
  }
  return (
    <>
      <Divider />
      <OSCALSectionHeader>Usage</OSCALSectionHeader>
      <OSCALMarkupMultiLine>{usage}</OSCALMarkupMultiLine>
    </>
  );
};

interface OSCALParamConstraintsProps {
  constraints: Constraint[] | undefined;
}

const OSCALParamConstraints: React.FC<OSCALParamConstraintsProps> = ({ constraints }) => {
  if (!constraints) {
    return null;
  }

  return (
    <>
      <Divider />
      <OSCALSectionHeader>Constraints</OSCALSectionHeader>
      {constraints?.map((constraint) => (
        <>
          <OSCALMarkupMultiLine>{constraint.description}</OSCALMarkupMultiLine>
          <Table>
            <StyledTableHead>
              <TableRow>
                <StyledHeaderTableCell>Expression</StyledHeaderTableCell>
                <StyledHeaderTableCell>Remarks</StyledHeaderTableCell>
              </TableRow>
            </StyledTableHead>
            <TableBody>
              {constraint.tests?.map((test) => (
                <StyledTableRow key={test.expression}>
                  <TableCell>{test.expression}</TableCell>
                  <TableCell>{test.remarks}</TableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </>
      ))}
    </>
  );
};

interface OSCALParamGuidelinesProps {
  guidelines: Guideline[] | undefined;
}

const OSCALParamGuidelines: React.FC<OSCALParamGuidelinesProps> = ({ guidelines }) => {
  if (!guidelines) {
    return null;
  }

  return (
    <>
      <Divider />
      <OSCALSectionHeader>Guidelines</OSCALSectionHeader>
      {guidelines?.map((guideline) => (
        <OSCALMarkupMultiLine key={guideline.prose}>{guideline.prose}</OSCALMarkupMultiLine>
      ))}
    </>
  );
};

interface OSCALParamValuesProps {
  values: string[] | undefined;
}

const OSCALParamValues: React.FC<OSCALParamValuesProps> = ({ values }) => {
  if (!values) {
    return null;
  }

  return (
    <>
      <Divider />
      <OSCALSectionHeader>Values</OSCALSectionHeader>
      <Typography>{values?.join(", ")}</Typography>
    </>
  );
};

interface OSCALParamLinksProps {
  links: OSCALLink[] | undefined;
}

const OSCALParamLinks: React.FC<OSCALParamLinksProps> = ({ links }) => {
  if (!links) {
    return null;
  }
  return (
    <>
      <Divider />
      <OSCALSectionHeader>Links</OSCALSectionHeader>
      {links?.map((link) => (
        <Link key={link.href} href={link.href}>
          {link.text ?? link.href}
        </Link>
      ))}
    </>
  );
};

interface OSCALSelectProps {
  choice?: string[];
}

const OSCALSingleSelect: React.FC<OSCALSelectProps> = ({ choice }) => {
  const [selectValue, setSelectValue] = React.useState("");

  const handleChange = (event: SelectChangeEvent) => {
    setSelectValue(event.target.value as string);
  };

  if (!choice) {
    return null;
  }

  return (
    <FormControl size="small">
      <Select value={selectValue} onChange={handleChange}>
        {choice?.map((item) => (
          <MenuItem key={item} value={item}>
            {item}
          </MenuItem>
        ))}
      </Select>
      <FormHelperText>Select One</FormHelperText>
    </FormControl>
  );
};

const OSCALMultiSelect: React.FC<OSCALSelectProps> = ({ choice }) => {
  const [selectValue, setSelectValue] = React.useState<string[]>([]);

  const handleChange = (event: SelectChangeEvent<typeof selectValue>) => {
    const {
      target: { value },
    } = event;
    setSelectValue(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };

  if (!choice) {
    return null;
  }

  return (
    <FormControl size="small">
      <Select value={selectValue} onChange={handleChange} multiple>
        {choice?.map((item) => (
          <MenuItem key={item} value={item}>
            {item}
          </MenuItem>
        ))}
      </Select>
      <FormHelperText>Select One Or More</FormHelperText>
    </FormControl>
  );
};

export interface OSCALParamProps {
  param: Parameter;
}

export const OSCALParam: React.FC<OSCALParamProps> = ({ param }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const handleClick = () => {
    setIsOpen(!isOpen);
  };

  return (
    <Accordion expanded={isOpen} onChange={handleClick}>
      <AccordionSummary>
        <Stack direction="row" alignItems="center" justifyContent="space-between" width="100%">
          <Typography>{param.id}</Typography>
          <Typography sx={{ color: "text.secondary" }}>{param.label}</Typography>
          <OSCALPropertiesDialog properties={param.props} />
        </Stack>
      </AccordionSummary>
      <AccordionDetails sx={{ maxHeight: "40em", overflowY: "scroll" }}>
        <Stack direction="column" spacing={2}>
          <OSCALMarkupMultiLine>{param.remarks}</OSCALMarkupMultiLine>
          <OSCALParamUsage usage={param.usage} />
          <OSCALParamConstraints constraints={param.constraints} />
          <OSCALParamGuidelines guidelines={param.guidelines} />
          <OSCALParamValues values={param.values} />
          <OSCALParamLinks links={param.links} />
          {param.select ? <Divider /> : null}
          {param.select?.["how-many"] === ParameterCardinality.ONE ? (
            <OSCALSingleSelect choice={param.select.choice} />
          ) : (
            <OSCALMultiSelect choice={param.select?.choice} />
          )}
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
  <ButtonLaunchedDialog dialogTitle="Parameters" disabled={!props.params} Icon={DataObjectIcon}>
    <OSCALParams params={props.params} />
  </ButtonLaunchedDialog>
);
