import React from "react";
import { styled } from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import OSCALResponsibleRoles from "./OSCALResponsibleRoles";
import StyledTooltip from "./OSCALStyledTooltip";
import { OSCALSection, OSCALSectionHeader } from "../styles/CommonPageStyles";
import { OSCALMarkupMultiLine } from "./OSCALMarkupProse";

const SmallTableCell = styled(TableCell)`
  text-align: right;
  padding: 0.75em 0.75em;
`;

const ComponentTableCell = styled(TableCell)`
  text-align: left;
  minwidth: 20em;
`;

const OSCALSystemImplementationSubDataHeader = styled(TableCell)`
  text-transform: capitalize;
  white-space: nowrap;
  padding: 0.75em 0.75em;
`;

export default function OSCALSystemImplementation(props) {
  if (!props.systemImplementation) {
    return null;
  }

  return (
    <OSCALSection>
      <Card>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <OSCALSectionHeader>System Implementation</OSCALSectionHeader>
            </Grid>
            <Grid item xs={12}>
              <OSCALMarkupMultiLine paragraphComponent={Typography}>
                {props.systemImplementation.remarks}
              </OSCALMarkupMultiLine>
            </Grid>
            <Grid item xs={12}>
              <TableContainer>
                <Table aria-label="Components">
                  <TableHead>
                    <TableRow>
                      <TableCell>Component</TableCell>
                      <TableCell>Type</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Properties</TableCell>
                      <TableCell>Responsible Roles</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {Object.entries(props.systemImplementation.components).map(
                      ([key, component]) => (
                        <TableRow key={key}>
                          <ComponentTableCell component="th" scope="row">
                            <StyledTooltip title={component.description}>
                              <Typography variant="body2">
                                {component.title}
                              </Typography>
                            </StyledTooltip>
                          </ComponentTableCell>
                          <TableCell>{component.type}</TableCell>
                          <TableCell>
                            {component.status && component.status.state}
                          </TableCell>
                          <TableCell>
                            <TableContainer>
                              <Table size="small">
                                <TableBody>
                                  {component.props &&
                                    component.props.map((property) => (
                                      <TableRow key={property.name}>
                                        <OSCALSystemImplementationSubDataHeader
                                          component="th"
                                          scope="row"
                                        >
                                          {property.name}
                                        </OSCALSystemImplementationSubDataHeader>
                                        <SmallTableCell>
                                          {property.value}
                                        </SmallTableCell>
                                      </TableRow>
                                    ))}
                                </TableBody>
                              </Table>
                            </TableContainer>
                          </TableCell>
                          <TableCell>
                            <OSCALResponsibleRoles
                              responsibleRoles={component["responsible-roles"]}
                              parties={props.parties}
                            />
                          </TableCell>
                        </TableRow>
                      )
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </OSCALSection>
  );
}
