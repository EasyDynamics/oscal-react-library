import ConstructionIcon from "@mui/icons-material/Construction";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
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

/**
 *  Helper to sort properties by their `name` field.
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

const OSCALProperty: React.FC<OSCALPropertyProps> = ({ property }) => {
  const NO_INFORMATION = <NotSpecifiedTypography>Not Specified</NotSpecifiedTypography>;

  return (
    <StyledTooltip title={property.remarks ?? ""}>
      <StyledTableRow key={property.uuid}>
        <TableCell>{property.name ?? NO_INFORMATION}</TableCell>
        <TableCell>{property.class ?? NO_INFORMATION}</TableCell>
        <TableCell>{property.value ?? NO_INFORMATION}</TableCell>
      </StyledTableRow>
    </StyledTooltip>
  );
};

interface OSCALPropertiesProps {
  /**
   * Contains a list of properties
   */
  properties?: Property[];
  /**
   * A namespace used for the title of a table
   */
  namespace?: string;
}

const OSCALProperties: React.FC<OSCALPropertiesProps> = ({ properties, namespace }) => {
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
            {
              // The index must be used because there is no combination of attributes of
              // a property that is guaranteed to be unique; the index is the best available
              // option. A UUID is not guaranteed to be present.
            }
            {properties?.map((property, idx) => (
              <OSCALProperty
                property={property}
                key={`${namespaceOf(property?.ns)}-property-${idx}`}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export interface OSCALPropertiesDialogProps {
  /**
   * Contains properties elements
   */
  properties?: Property[];
  /**
   * Title of the element the properties resides under
   */
  title?: string | ReactElement;
}

export const OSCALPropertiesDialog: React.FC<OSCALPropertiesDialogProps> = ({
  properties,
  title,
}) => {
  const [open, setOpen] = React.useState(false);

  const namespaceToProps: Record<string, Property[]> = {};
  for (const prop of properties ?? []) {
    const ns = namespaceOf(prop.ns);
    namespaceToProps[ns] ??= [];
    namespaceToProps[ns].push(prop);
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
      <StyledTooltip title="Open Properties">
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
            aria-label="Open Properties"
            disabled={!properties}
          >
            <ConstructionIcon />
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
        <DialogContent sx={{ maxHeight: "75vh" }} dividers>
          <DialogTitle id="scroll-dialog-title">{title} Properties</DialogTitle>
          {/* Handle NIST properties */}
          <OSCALProperties
            properties={nist?.sort(byName)}
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