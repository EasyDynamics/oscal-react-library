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
import { NIST_NAMESPACE_DOMAIN, isNistNamespace } from "./oscal-utils/OSCALPropUtils";

const OSCALPropertiesButton = styled(Button)(
  ({ theme }) => `
    color: ${theme.palette.primary.main};
    margin-top: 1em;
    margin-bottom: 0.5em;
  `
);

interface OSCALPropertiesDialogProps {
  /**
   * Title of the element the properties resides under
   */
  title: string;
  /**
   * Children to display in the modal
   */
  children: React.ReactNode;
}

const OSCALPropertiesDialog = (props: OSCALPropertiesDialogProps): ReactElement => {
  const { title, children } = props;

  const [open, setOpen] = React.useState(false);

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
          {children}
        </DialogContent>
      </Dialog>
    </>
  );
};

/**
 * Accumulates all instances of third-party namespaces into a list.
 *
 * @param {Property[]} properties A list of properties
 * @returns {string[]} A list of third-party namespaces
 */
function getThirdPartyNamespaces(properties: Property[]) {
  let items: string[] = [""];

  properties
    ?.filter((property: any) => !isNistNamespace(property?.ns))
    .map((property: any) => {
      if (!items.includes(property?.ns)) {
        items.push(property?.ns);
      }
    });

  return items;
}

interface OSCALPropertiesTableProps {
  /**
   * Contains properties elements
   */
  properties: Property[];
  /**
   * A namespace used for the title of a table
   */
  namespace?: string;
}

const OSCALPropertiesTable = (props: OSCALPropertiesTableProps): ReactElement => {
  const { properties, namespace } = props;

  return (
    <>
      <OSCALSystemImplementationTableTitle variant="h6" id={`${namespace}-table-title`}>
        {namespace}
      </OSCALSystemImplementationTableTitle>
      <TableContainer sx={{ maxHeight: "25em" }}>
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
                namespace === NIST_NAMESPACE_DOMAIN
                  ? isNistNamespace(property?.ns)
                  : property?.ns === namespace
              )
              .map((property: any) => (
                <StyledTooltip title={property?.remarks ?? ""}>
                  <StyledTableRow key={property?.uuid}>
                    <TableCell>{property?.name}</TableCell>
                    <TableCell>{property?.class}</TableCell>
                    <TableCell>{property?.value}</TableCell>
                  </StyledTableRow>
                </StyledTooltip>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

interface OSCALPropertiesProps {
  /**
   * Contains properties elements
   */
  properties: any;
  /**
   * Title of the element the properties resides under
   */
  title: string;
}

export const OSCALProperties = (props: OSCALPropertiesProps) => {
  const { properties, title } = props;
  const thirdPartyNamespaces = getThirdPartyNamespaces(properties);

  return properties ? (
    <OSCALPropertiesDialog title={title}>
      <DialogTitle id="scroll-dialog-title">{title} Properties</DialogTitle>
      {/* Handle NIST properties */}
      <OSCALPropertiesTable properties={properties} namespace={NIST_NAMESPACE_DOMAIN} key={NIST_NAMESPACE_DOMAIN} />
      {
        /* Handle 3rd party properties */
        thirdPartyNamespaces
          ?.filter((namespace) => namespace !== "")
          .map((namespace: any) => (
            <OSCALPropertiesTable properties={properties} namespace={namespace} key={namespace} />
          ))
      }
    </OSCALPropertiesDialog>
  ) : null;
};
