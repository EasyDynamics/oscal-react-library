import React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import OSCALResponsibleRoles from "./OSCALResponsibleRoles";
import { OSCALSection, OSCALSectionHeader } from "../styles/CommonPageStyles";
import { OSCALAnchorLinkHeader } from "./OSCALAnchorLinkHeader";
import { HoverablePopover } from "./HoverablePopover";
import { OSCALMarkupLine, OSCALMarkupMultiLine } from "./OSCALMarkupProse";

export default function OSCALComponentDefinitionComponent(props) {
  return (
    <OSCALSection>
      <Card>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <OSCALAnchorLinkHeader>
                <OSCALSectionHeader>Components</OSCALSectionHeader>
              </OSCALAnchorLinkHeader>
            </Grid>
            <Grid item xs={12}>
              <TableContainer>
                <Table aria-label="Title">
                  <TableHead>
                    <TableRow>
                      <TableCell>Title</TableCell>
                      <TableCell>Description</TableCell>
                      <TableCell>Responsible Roles</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow key={props.component.uuid}>
                      <TableCell component="th" scope="row">
                        <HoverablePopover
                          popoverContent={
                            <OSCALMarkupMultiLine>
                              {props.component.description}
                            </OSCALMarkupMultiLine>
                          }
                        >
                          <OSCALMarkupLine>{props.component.title}</OSCALMarkupLine>
                        </HoverablePopover>
                      </TableCell>
                      <TableCell>{props.component.type}</TableCell>
                      <TableCell>
                        <OSCALResponsibleRoles
                          responsibleRoles={props.component["responsible-roles"]}
                          parties={props.parties}
                        />
                      </TableCell>
                    </TableRow>
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
