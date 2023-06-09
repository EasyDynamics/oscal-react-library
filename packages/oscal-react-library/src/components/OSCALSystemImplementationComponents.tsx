import React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import OSCALResponsibleRoles from "./OSCALResponsibleRoles";
import {
  OSCALSystemImplementationTableTitle,
  StyledHeaderTableCell,
  StyledTableRow,
  ComponentTableCell,
  StyledTableHead,
} from "./OSCALSystemImplementationTableStyles";
import { OSCALAnchorLinkHeader } from "./OSCALAnchorLinkHeader";
import PropertiesTable from "./OSCALSystemImplementationPropertiesTable";
import { HoverablePopover } from "./HoverablePopover";
import { OSCALMarkupLine, OSCALMarkupMultiLine } from "./OSCALMarkupProse";
import { AssessmentAssetsComponent, PartyOrganizationOrPerson } from "@easydynamics/oscal-types";

export interface OSCALSystemImplementationComponentsProps {
  components: AssessmentAssetsComponent[];
  parties: PartyOrganizationOrPerson[];
}

export const OSCALSystemImplementationComponents: React.FC<
  OSCALSystemImplementationComponentsProps
> = (props) => {
  return (
    <>
      <OSCALSystemImplementationTableTitle variant="h6" id="tableTitle">
        <OSCALAnchorLinkHeader>Components</OSCALAnchorLinkHeader>
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
                  <HoverablePopover
                    popoverContent={
                      component.description && (
                        <OSCALMarkupMultiLine>{component.description}</OSCALMarkupMultiLine>
                      )
                    }
                  >
                    <OSCALMarkupLine>{component.title}</OSCALMarkupLine>
                  </HoverablePopover>
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
};
