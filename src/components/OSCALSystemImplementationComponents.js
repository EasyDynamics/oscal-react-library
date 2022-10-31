import React from "react";
import Typography from "@mui/material/Typography";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import StyledTooltip from "./OSCALStyledTooltip";
import OSCALResponsibleRoles from "./OSCALResponsibleRoles";
import {
  OSCALSystemImplementationTableTitle,
  StyledHeaderTableCell,
  StyledTableRow,
  ComponentTableCell,
  StyledTableHead,
} from "./OSCALSystemImplementationTableStyles";
import PropertiesTable from "./OSCALSystemImplementationPropertiesTable";

export default function OSCALSystemImplementationComponents(props) {
  return (
    <>
      <OSCALSystemImplementationTableTitle variant="h6" id="tableTitle">
        Components
      </OSCALSystemImplementationTableTitle>
      <TableContainer sx={{ maxHeight: "25em" }}>
        <Table aria-label="Components" sx={{ height: "max-content" }}>
          <StyledTableHead>
            <TableRow>
              <StyledHeaderTableCell>Component</StyledHeaderTableCell>
              <StyledHeaderTableCell>Type</StyledHeaderTableCell>
              <StyledHeaderTableCell>Status</StyledHeaderTableCell>
              <StyledHeaderTableCell>Properties</StyledHeaderTableCell>
              <StyledHeaderTableCell>Responsible Roles</StyledHeaderTableCell>
            </TableRow>
          </StyledTableHead>
          <TableBody>
            {props.components.map((component) => (
              <StyledTableRow key={component.uuid}>
                <ComponentTableCell component="th" scope="row">
                  <StyledTooltip title={component.description}>
                    <Typography>{component.title}</Typography>
                  </StyledTooltip>
                </ComponentTableCell>
                <TableCell>{component.type}</TableCell>
                <TableCell>{component.status?.state}</TableCell>
                <TableCell>
                  <PropertiesTable list={component.props} />
                </TableCell>
                <TableCell>
                  <OSCALResponsibleRoles
                    responsibleRoles={component["responsible-roles"]}
                    parties={props.parties}
                  />
                </TableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
