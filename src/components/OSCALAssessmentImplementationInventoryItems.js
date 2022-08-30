import React from "react";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

const SmallTableCell = styled(TableCell)`
  text-align: right;
  padding: 0.75em 0.75em;
`;

const OSCALAssessmentImplementationTableTitle = styled(Typography)`
  flex: 1 1 100%;
  padding-top: 1em;
  padding-bottom: 1em;
`;

const StyledHeaderTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
  },
  textAlign: "left",
  minWidth: "10em",
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  // Use hover color for even numbered rows
  "&:nth-of-type(even)": {
    backgroundColor: theme.palette.action.hover,
  },
}));

const OSCALPropertiesSubDataHeader = styled(TableCell)`
  text-transform: capitalize;
  white-space: nowrap;
  padding: 0.75em 0.75em;
`;

function PropertiesTable(props) {
  return (
    <TableContainer>
      <Table size="small">
        <TableBody>
          {props.list?.map((property) => (
            <TableRow key={property.name}>
              <OSCALPropertiesSubDataHeader component="th" scope="row">
                {property.name}
              </OSCALPropertiesSubDataHeader>
              <SmallTableCell>{property.value}</SmallTableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

function OSCALResponsibleParties(props) {
  const getPartyName = (partyUuid) =>
    props.parties?.find((party) => party.uuid === partyUuid)?.name;

  return (
    <TableContainer>
      <Table size="small">
        <TableBody>
          {props.responsibleParties?.map((party) => (
            <TableRow key={party["role-id"]}>
              <TableCell component="th" scope="row">
                {party["role-id"]}
              </TableCell>
              <TableCell align="right">
                {party["party-uuids"] &&
                  party["party-uuids"].map((partyUuid) =>
                    getPartyName(partyUuid)
                  )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

function ImplementedComponents(props) {
  const getComponent = (compUuid) =>
    props.components?.find((component) => component.uuid === compUuid);

  return (
    <TableContainer>
      <Table size="small">
        <TableBody>
          {props.implementedComponents?.map((comp) => (
            <TableRow key={comp["component-uuid"]}>
              <TableCell
                component="th"
                scope="row"
                aria-label={`${comp["component-uuid"]} implemented component`}
              >
                {getComponent(comp["component-uuid"])?.title}
              </TableCell>
              <TableCell align="right">
                {getComponent(comp["component-uuid"])?.type}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default function OSCALOSCALAssessmentImplementationTableTitleInventoryItems(
  props
) {
  if (!props.inventoryItems) {
    return null;
  }

  return (
    <>
      <OSCALAssessmentImplementationTableTitle variant="h6" id="tableTitle">
        Inventory Items
      </OSCALAssessmentImplementationTableTitle>

      <TableContainer sx={{ maxHeight: "25em" }}>
        <Table aria-label="Inventory Items" sx={{ height: "max-content" }}>
          <TableHead>
            <TableRow>
              <StyledHeaderTableCell>Item</StyledHeaderTableCell>
              <StyledHeaderTableCell>Properties</StyledHeaderTableCell>
              <StyledHeaderTableCell>Responsible Parties</StyledHeaderTableCell>
              <StyledHeaderTableCell>
                Implemented Components
              </StyledHeaderTableCell>
              <StyledHeaderTableCell>Remarks</StyledHeaderTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {props.inventoryItems.map((inventoryItem) => (
              <StyledTableRow key={inventoryItem.uuid}>
                <TableCell>{inventoryItem.description}</TableCell>
                <TableCell>
                  <PropertiesTable list={inventoryItem.props} />
                </TableCell>
                <TableCell>
                  <OSCALResponsibleParties
                    responsibleParties={inventoryItem["responsible-parties"]}
                    parties={props.parties}
                  />
                </TableCell>
                <TableCell>
                  <ImplementedComponents
                    implementedComponents={
                      inventoryItem["implemented-components"]
                    }
                    components={props.components}
                  />
                </TableCell>
                <TableCell>{inventoryItem.remarks}</TableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
