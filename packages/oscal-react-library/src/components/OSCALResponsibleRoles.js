import React from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";

const ResponsibleRolesTable = styled(TableContainer)(
  ({ theme }) => `
  margin-top: ${theme.spacing(2)};
  display: flex;
  flex-direction: column;
  text-transform: capitalize;
`
);

export default function OSCALResponsibleRoles(props) {
  const getPartyName = (partyUuid) =>
    props.parties?.find((party) => party.uuid === partyUuid)?.name;

  return (
    <ResponsibleRolesTable>
      <Table size="small">
        <TableBody>
          {props.responsibleRoles &&
            Object.entries(props.responsibleRoles).map(([key, role]) => (
              <TableRow key={key}>
                <TableCell component="th" scope="row">
                  {role["role-id"]}
                </TableCell>
                <TableCell align="right">
                  {role["party-uuids"] &&
                    role["party-uuids"].map((partyUuid) => getPartyName(partyUuid))}
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </ResponsibleRolesTable>
  );
}
