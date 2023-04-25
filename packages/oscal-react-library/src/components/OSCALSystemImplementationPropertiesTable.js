import React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";

export default function PropertiesTable(props) {
  return (
    <TableContainer>
      <Table size="small">
        <TableBody>
          {props.list?.map((property) => (
            <TableRow key={property.name}>
              <TableCell component="th" scope="row">
                {property.name}
              </TableCell>
              <TableCell className={"SmallTableCell"}>{property.value}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
