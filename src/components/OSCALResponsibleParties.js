import React from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";

const ResponsiblePartiesTable = styled(TableContainer)(
  ({ theme }) => `
  margin-top: ${theme.spacing(2)};
  display: flex;
  flex-direction: column;
  text-transform: capitalize;
`
);

export default function OSCALResponsibleParties(props) {
  const getPartyName = (partyUuid) =>
    props.parties?.find((party) => party.uuid === partyUuid)?.name;

  return (
    <ResponsiblePartiesTable>
      <Table size="small">
        <TableBody>
          {props.responsibleParties &&
            Object.entries(props.responsibleParties).map(([key, party]) => (
              <TableRow key={key}>
                <TableCell component="th" scope="row">
                  {party["role-id"]}
                </TableCell>
                <TableCell align="right">
                  {party["party-uuids"] &&
                    party["party-uuids"].map((partyUuid) =>
                      getPartyName(partyUuid)
                    )}
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </ResponsiblePartiesTable>
  );
}
