import React from "react";
import { styled } from "@mui/material/styles";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import OSCALResponsibleRoles from "./OSCALResponsibleRoles";
import OSCALImplementedComponents from "./OSCALImplementedComponents";
import StyledTooltip from "./OSCALStyledTooltip";

const ComponentTableCell = styled(TableCell)`
  text-align: left;
  minwidth: 20em;
`;

export default function OSCALInventoryItem(props) {
  if (!props.inventoryItem) {
    return null;
  }

  return (
    <>
      <Grid item xs={12}>
        <Typography variant="body2">
          {props.inventoryItem?.description}
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <TableContainer>
          <Table aria-label="Inventory Items">
            <TableHead>
              <TableRow>
                <TableCell>Item</TableCell>
                <TableCell>Value</TableCell>
                <TableCell>Responsible Parties</TableCell>
                <TableCell>Implemented Components</TableCell>
                <TableCell>Remarks</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Object.values(props.inventoryItem.props).map((item) => (
                <TableRow key={item.name}>
                  <ComponentTableCell component="th" scope="row">
                    <StyledTooltip title={props.inventoryItem.description}>
                      <Typography variant="body2">{item.name}</Typography>
                    </StyledTooltip>
                  </ComponentTableCell>
                  <TableCell>{item.value}</TableCell>
                  <TableCell>
                    <OSCALResponsibleRoles
                      responsibleRoles={
                        props.inventoryItem["responsible-parties"]
                      }
                      parties={props.parties}
                    />
                  </TableCell>
                  <TableCell>
                    <OSCALImplementedComponents
                      implementedComponents={
                        props.inventoryItem["implemented-components"]
                      }
                      components={props.components}
                    />
                  </TableCell>
                  <TableCell>{item.remarks}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Typography variant="body2">{props.inventoryItem?.remarks}</Typography>
      </Grid>
    </>
  );
}
