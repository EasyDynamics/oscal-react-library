import React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import {
  OSCALSystemImplementationTableTitle,
  StyledHeaderTableCell,
  StyledTableRow,
} from "./OSCALSystemImplementationTableStyles";
import PropertiesTable from "./OSCALSystemImplementationPropertiesTable";

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
                {party["party-uuids"]?.map(getPartyName)}
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
          {props.implementedComponents
            // This custom object lets us store the UUID while also performing
            // the lookup for each component only once
            ?.map((comp) => ({
              uuid: comp["component-uuid"],
              component: getComponent(comp["component-uuid"]),
            }))
            // `comp` is probably not the best solution here
            ?.map((comp) => (
              <TableRow key={comp.uuid}>
                <TableCell
                  component="th"
                  scope="row"
                  aria-label={`${comp.uuid} implemented component`}
                >
                  {comp.component?.title}
                </TableCell>
                <TableCell align="right">{comp.component?.type}</TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default function OSCALOSCALSystemImplementationTableTitleInventoryItems(
  props
) {
  if (!props.inventoryItems) {
    return null;
  }

  return (
    <>
      <OSCALSystemImplementationTableTitle variant="h6" id="tableTitle">
        Inventory Items
      </OSCALSystemImplementationTableTitle>

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
