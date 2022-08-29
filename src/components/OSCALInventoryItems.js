import React from "react";
import { styled } from "@mui/material/styles";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import {
  Grid,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { OSCALSectionHeader } from "../styles/CommonPageStyles";
import OSCALProperties from "./OSCALProperties";
import OSCALResponsibleRoles from "./OSCALResponsibleRoles";
import OSCALImplementedComponents from "./OSCALImplementedComponents";

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

export default function OSCALInventoryItems(props) {
  if (!props.inventoryItems) {
    return null;
  }

  return (
    <Grid container spacing={2} style={{ paddingTop: "2em" }}>
      <Grid item xs={12}>
        <OSCALSectionHeader>Inventory Items</OSCALSectionHeader>
      </Grid>
      <Grid item xs={12}>
        <TableContainer sx={{ maxHeight: "50em" }}>
          <Table aria-label="Inventory Items" sx={{ height: "max-content" }}>
            <TableHead>
              <TableRow>
                <StyledHeaderTableCell>Item</StyledHeaderTableCell>
                <StyledHeaderTableCell>Properties</StyledHeaderTableCell>
                <StyledHeaderTableCell>
                  Responsible Parties
                </StyledHeaderTableCell>
                <StyledHeaderTableCell>
                  Implemented Components
                </StyledHeaderTableCell>
                <StyledHeaderTableCell>Remarks</StyledHeaderTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Object.entries(props.inventoryItems).map(
                ([key, inventoryItem]) => (
                  <StyledTableRow key={key}>
                    <TableCell>{inventoryItem.description}</TableCell>
                    <TableCell>
                      <OSCALProperties properties={inventoryItem.props} />
                    </TableCell>
                    <TableCell>
                      <OSCALResponsibleRoles
                        responsibleRoles={inventoryItem["responsible-parties"]}
                        parties={props.parties}
                      />
                    </TableCell>
                    <TableCell>
                      <OSCALImplementedComponents
                        implementedComponents={
                          inventoryItem["implemented-components"]
                        }
                        components={props.components}
                      />
                    </TableCell>
                    <TableCell>{inventoryItem.remarks}</TableCell>
                  </StyledTableRow>
                )
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
    </Grid>
  );
}
