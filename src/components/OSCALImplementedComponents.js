import React from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";

const ImplementedComponentsTable = styled(TableContainer)(
  ({ theme }) => `
  margin-top: ${theme.spacing(2)};
  display: flex;
  flex-direction: column;
  text-transform: capitalize;
`
);

export default function OSCALImplementedComponents(props) {
  const getComponent = (compUuid) =>
    props.components?.find((component) => component.uuid === compUuid);

  return (
    <ImplementedComponentsTable>
      <Table size="small">
        <TableBody>
          {props.implementedComponents &&
            Object.entries(props.implementedComponents).map(([key, comp]) => (
              <TableRow key={key}>
                <TableCell
                  component="th"
                  scope="row"
                  aria-label={`${comp["component-uuid"]} implemented component`}
                >
                  {getComponent(comp["component-uuid"])?.title}
                </TableCell>
                <TableCell align="right">
                  {getComponent(comp["component-uuid"])?.type}
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </ImplementedComponentsTable>
  );
}
