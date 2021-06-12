import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableRow from "@material-ui/core/TableRow";

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
  console.log(props);
  const classes = useStyles();

  const getPartyName = (partyUuid) => {
    if (!props.parties) {
      return null;
    }
    let party;
    // TODO iterators/generators require regenerator-runtime, which is too heavyweight for this guide to allow them. Separately, loops should be avoided in favor of array iterations  no-restricted-syntax
    /* eslint-disable */
    for (party of props.parties) {
      if (party.uuid === partyUuid) {
        return party.name;
      }
    }
    return null;
  };
  /* eslint-enable */

  return (
    <TableContainer>
      <Table size="small">
        <TableBody>
          {props.responsibleRoles &&
            Object.entries(props.responsibleRoles).map(([key, role], index) => (
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
