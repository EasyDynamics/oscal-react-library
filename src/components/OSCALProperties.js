import React from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";

const PropertiesTable = styled(TableContainer)(
  ({ theme }) => `
  margin-top: ${theme.spacing(2)};
  display: flex;
  flex-direction: column;
  text-transform: capitalize;
`
);

export default function OSCALProperties(props) {
  return (
    <PropertiesTable>
      <Table size="small">
        <TableBody>
          {props.properties &&
            Object.entries(props.properties).map(([key, prop]) => (
              <TableRow key={key}>
                <TableCell
                  component="th"
                  scope="row"
                  key={key + " " + prop.name}
                >
                  {prop.name}
                </TableCell>
                <TableCell align="right" key={key + " " + prop.name + " value"}>
                  {prop.value}
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </PropertiesTable>
  );
}
