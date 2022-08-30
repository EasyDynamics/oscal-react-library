import React from "react";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import StyledTooltip from "./OSCALStyledTooltip";
import OSCALResponsibleRoles from "./OSCALResponsibleRoles";

const SmallTableCell = styled(TableCell)`
  text-align: right;
  padding: 0.75em 0.75em;
`;

const ComponentTableCell = styled(TableCell)`
  text-align: left;
  minwidth: 20em;
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

export default function OSCALAssessmentImplementationComponents(props) {
  return (
    <>
      <OSCALAssessmentImplementationTableTitle variant="h6" id="tableTitle">
        Components
      </OSCALAssessmentImplementationTableTitle>
      <TableContainer sx={{ maxHeight: "25em" }}>
        <Table aria-label="Components" sx={{ height: "max-content" }}>
          <TableHead>
            <TableRow>
              <StyledHeaderTableCell>Component</StyledHeaderTableCell>
              <StyledHeaderTableCell>Type</StyledHeaderTableCell>
              <StyledHeaderTableCell>Status</StyledHeaderTableCell>
              <StyledHeaderTableCell>Properties</StyledHeaderTableCell>
              <StyledHeaderTableCell>Responsible Roles</StyledHeaderTableCell>
            </TableRow>
          </TableHead>
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
