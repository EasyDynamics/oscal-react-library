import React from "react";
import { styled } from "@mui/material/styles";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import OSCALResponsibleRoles from "./OSCALResponsibleRoles";
import OSCALImplementedComponents from "./OSCALImplementedComponents";
import StyledTooltip from "./OSCALStyledTooltip";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
  },
  textAlign: "left",
  minwidth: "20em",
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  // Use hover color for even numbered rows
  "&:nth-of-type(even)": {
    backgroundColor: theme.palette.action.hover,
  },
}));

export default function OSCALInventoryItem(props) {
  if (!props.inventoryItem) {
    return null;
  }

  return (
    <>
      <Grid item xs={12}>
        <Typography variant="subtitle1" gutterBottom component="div">
          {props.inventoryItem?.description}
        </Typography>
        <Typography variant="body2">{props.inventoryItem?.remarks}</Typography>
      </Grid>
      <Grid item xs={12}>
        <TableContainer sx={{ maxHeight: "15em" }}>
          <Table aria-label="Inventory Items" sx={{ height: "max-content" }}>
            <TableHead>
              <TableRow>
                <StyledTableCell>Item</StyledTableCell>
                <StyledTableCell>Value</StyledTableCell>
                <StyledTableCell>Responsible Parties</StyledTableCell>
                <StyledTableCell>Implemented Components</StyledTableCell>
                <StyledTableCell>Remarks</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Object.values(props.inventoryItem.props).map((item) => (
                <StyledTableRow key={item.name}>
                  <TableCell component="th" scope="row">
                    <StyledTooltip title={props.inventoryItem.description}>
                      <Typography variant="body2">{item.name}</Typography>
                    </StyledTooltip>
                  </TableCell>
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
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
    </>
  );
}
