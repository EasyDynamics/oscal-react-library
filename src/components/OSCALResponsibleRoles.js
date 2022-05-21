import React from "react";
import makeStyles from "@mui/styles/makeStyles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(2),
    display: "flex",
    flexDirection: "column",
  },
  OSCALResponsibleRolesSubDataHeader: {
    "text-transform": "capitalize",
    "white-space": "nowrap",
  },
}));

export default function OSCALResponsibleRoles(props) {
  const classes = useStyles();

  const getPartyName = (partyUuid) =>
    props.parties?.find((party) => party.uuid === partyUuid)?.name;

  return (
    <TableContainer>
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
    </TableContainer>
  );
}
