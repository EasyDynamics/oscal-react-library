import React from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";

const PREFIX = "OSCALResponsibleRoles";

const classes = {
  paper: `${PREFIX}-paper`,
  OSCALResponsibleRolesSubDataHeader: `${PREFIX}-OSCALResponsibleRolesSubDataHeader`,
};

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  [`& .${classes.paper}`]: {
    marginTop: theme.spacing(2),
    display: "flex",
    flexDirection: "column",
  },

  [`& .${classes.OSCALResponsibleRolesSubDataHeader}`]: {
    "text-transform": "capitalize",
    "white-space": "nowrap",
  },
}));

export default function OSCALResponsibleRoles(props) {
  const getPartyName = (partyUuid) =>
    props.parties?.find((party) => party.uuid === partyUuid)?.name;

  return (
    <StyledTableContainer>
      <Table size="small">
        <TableBody>
          {props.responsibleRoles &&
            Object.entries(props.responsibleRoles).map(([key, role]) => (
              <TableRow key={key}>
                <TableCell
                  className={classes.OSCALResponsibleRolesSubDataHeader}
                  component="th"
                  scope="row"
                >
                  {role["role-id"]}
                </TableCell>
                <TableCell align="right">
                  {role["party-uuids"] &&
                    role["party-uuids"].map((partyUuid) =>
                      getPartyName(partyUuid)
                    )}
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </StyledTableContainer>
  );
}
