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
import { NIST_DEFAULT_NAMESPACE, isNistNamespace } from "./oscal-utils/OSCALPropUtils";
import { NotSpecifiedTypography } from "./StyledTypography";

const OSCALPropertiesButton = styled(Button)(
  ({ theme }) => `
    color: ${theme.palette.primary.main};
    margin-top: 1em;
    margin-bottom: 0.5em;
  `
);

/**
 * Accumulates all instances of third-party namespaces into a list.
 *
 * @param {Property[]} properties A list of properties
 * @returns {string[]} A list of third-party namespaces
 */
function getThirdPartyNamespaces(properties?: Property[]) {
  const items: string[] = [""];

  properties
    ?.filter((property: any) => !isNistNamespace(property?.ns))
    .map((property: any) => {
      if (!items.includes(property?.ns)) {
        items.push(property?.ns);
      }
    });

  return items;
}

interface OSCALProperty {
  /**
   * Contains property elements
   */
  property: Property;
}

const OSCALProperty = (props: OSCALProperty): ReactElement => {
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
              ?.filter((property: any) =>
                namespace === NIST_DEFAULT_NAMESPACE
                  ? isNistNamespace(property?.ns)
                  : property?.ns === namespace
              )
              .map((property: any) => (
                <OSCALProperty property={property} />
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
  const thirdPartyNamespaces = getThirdPartyNamespaces(properties);
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  if (!properties) {
    return null;
  }

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
            properties={properties}
            namespace={NIST_DEFAULT_NAMESPACE}
            key={NIST_DEFAULT_NAMESPACE}
          />
          {
            /* Handle 3rd party properties */
            thirdPartyNamespaces
              ?.filter((namespace) => namespace !== "")
              .map((namespace: any) => (
                <OSCALProperties properties={properties} namespace={namespace} key={namespace} />
              ))
          }
        </DialogContent>
      </Dialog>
    </>
  );
};
