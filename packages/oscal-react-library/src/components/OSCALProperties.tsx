import HomeIcon from "@mui/icons-material/Home";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { styled } from "@mui/material/styles";
import React, { ReactElement } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import StyledTooltip from "./OSCALStyledTooltip";
import {
  OSCALSystemImplementationTableTitle,
  StyledHeaderTableCell,
  StyledTableRow,
  StyledTableHead,
} from "./OSCALSystemImplementationTableStyles";
import { Property } from "@easydynamics/oscal-types";
import { NIST_DEFAULT_NAMESPACE, namespaceOf } from "./oscal-utils/OSCALPropUtils";
import { NotSpecifiedTypography } from "./StyledTypography";

const OSCALPropertiesButton = styled(Button)(
  ({ theme }) => `
    color: ${theme.palette.primary.main};
    margin-top: 1em;
    margin-bottom: 0.5em;
  `
) as typeof Button;

/**
 * Helper to sort namespaces.
 *
 * @param propA The first property to compare
 * @param propB The second property to compare
 * @returns A positive number if A is before B alphabetically ot a negative number if B is before A
 *   alphabetically.
 */
function byName(propA: Property, propB: Property): number {
  return propA.name.localeCompare(propB.name);
}

interface OSCALPropertyProps {
  /**
   * Contains property elements
   */
  property: Property;
}

const OSCALProperty = (props: OSCALPropertyProps): ReactElement => {
  const { property } = props;
  const NO_INFORMATION = <NotSpecifiedTypography>Not Specified</NotSpecifiedTypography>;

  return (
    <StyledTooltip title={property?.remarks ?? ""} key={`${property?.uuid}-remarks`}>
      <StyledTableRow key={property?.uuid}>
        <TableCell>{property?.name ?? NO_INFORMATION}</TableCell>
        <TableCell>{property?.class ?? NO_INFORMATION}</TableCell>
        <TableCell>{property?.value ?? NO_INFORMATION}</TableCell>
      </StyledTableRow>
    </StyledTooltip>
  );
};

interface OSCALPropertiesProps {
  /**
   * Contains a list of properties
   */
  properties: Property[];
  /**
   * A namespace used for the title of a table
   */
  namespace?: string;
}

const OSCALProperties = (props: OSCALPropertiesProps): ReactElement => {
  const { properties, namespace } = props;

  return (
    <>
      <OSCALSystemImplementationTableTitle variant="h6" id={`${namespace}-table-title`}>
        {namespace}
      </OSCALSystemImplementationTableTitle>
      <TableContainer sx={{ maxHeight: "20em" }}>
        <Table aria-label="Components" sx={{ height: "max-content" }}>
          <StyledTableHead>
            <TableRow>
              <StyledHeaderTableCell>Name</StyledHeaderTableCell>
              <StyledHeaderTableCell>Class</StyledHeaderTableCell>
              <StyledHeaderTableCell>Value</StyledHeaderTableCell>
            </TableRow>
          </StyledTableHead>
          <TableBody>
            {properties
              ?.filter((property) => namespaceOf(property?.ns) === namespace)
              .map((property) => (
                <OSCALProperty property={property} key={`$namespaceOf(property?.ns)-properties`} />
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

interface OSCALPropertiesDialogProps {
  /**
   * Contains properties elements
   */
  properties?: Property[];
  /**
   * Title of the element the properties resides under
   */
  title: string;
}

export const OSCALPropertiesDialog = (props: OSCALPropertiesDialogProps) => {
  const { properties, title } = props;
  const [open, setOpen] = React.useState(false);

  if (!properties) {
    return null;
  }
  const namespaceToProps: Record<string, Property[]> = {};
  for (const prop of properties) {
    namespaceToProps[namespaceOf(prop.ns)] ??= [];
    namespaceToProps[namespaceOf(prop.ns)].push(prop);
  }
  const { [NIST_DEFAULT_NAMESPACE]: nist, ...thirdParties } = namespaceToProps;

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <OSCALPropertiesButton
        size="small"
        variant="outlined"
        onClick={handleOpen}
        aria-label={`${title} properties button`}
        startIcon={<HomeIcon />}
      >
        Properties
      </OSCALPropertiesButton>
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
        <DialogContent sx={{ maxHeight: "75vh" }} dividers>
          <DialogTitle id="scroll-dialog-title">{title} Properties</DialogTitle>
          {/* Handle NIST properties */}
          <OSCALProperties
            properties={nist.sort(byName)}
            namespace={NIST_DEFAULT_NAMESPACE}
            key={NIST_DEFAULT_NAMESPACE}
          />
          {
            /* Handle 3rd party properties */
            Object.entries(thirdParties)
              .sort(([key1], [key2]) => key1.localeCompare(key2))
              .map(([key, props]) => (
                <OSCALProperties properties={props.sort(byName)} namespace={key} key={key} />
              ))
          }
        </DialogContent>
      </Dialog>
    </>
  );
};
