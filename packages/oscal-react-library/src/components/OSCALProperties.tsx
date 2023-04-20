import HomeIcon from "@mui/icons-material/Home";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";
import React from "react";
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

const OSCALPropertiesButton = styled(Button)(
  ({ theme }) => `
    color: ${theme.palette.primary.main};
    margin-top: 1em;
    margin-bottom: 0.5em;
  `
);

function OSCALPropertiesCard(props: any) {
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
      >
        {children}
      </Dialog>
    </>
  );
}

function isNistNamespace(namespace: string) {
  return !namespace || namespace.includes("nist.gov");
}

function getThirdPartyNamespaces(properties: any) {
  let items: string[] = [""];

  properties
    ?.filter((property: any) => !isNistNamespace(property?.ns))
    .map((property: any) => {
      items.push(property?.ns);
    });

  return items;
}

function OSCALPropertiesTable(properties: any, namespace: string) {
  return (
    <DialogContent dividers>
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
                namespace === "NIST OSCAL"
                  ? isNistNamespace(property.ns)
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
    </DialogContent>
  );
}

export default function OSCALProperties(props: any) {
  const { properties, title } = props;
  const thirdPartyNamespaces = getThirdPartyNamespaces(properties);

  return properties ? (
    <OSCALPropertiesCard title={title}>
      <DialogTitle id="scroll-dialog-title">
        <Stack direction="column">{title} Properties</Stack>
      </DialogTitle>
      {/* Handle NIST properties */}
      <OSCALPropertiesTable properties={properties} namespace={"NIST OSCAL"} />
      {
        /* Handle 3rd party properties */
        thirdPartyNamespaces
          ?.filter((namespace) => namespace !== "")
          .map((namespace: any) => (
            <OSCALPropertiesTable properties={properties} namespace={namespace} />
          ))
      }
    </OSCALPropertiesCard>
  ) : null;
}
