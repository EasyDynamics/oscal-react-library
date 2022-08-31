import React from "react";
import Typography from "@mui/material/Typography";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import StyledTooltip from "./OSCALStyledTooltip";
import {
  OSCALSystemImplementationTableTitle,
  StyledHeaderTableCell,
  StyledTableRow,
} from "./OSCALSystemImplementationTableStyles";
import PropertiesTable from "./OSCALSystemImplementationPropertiesTable";

function FunctionsPreformedTable(props) {
  return (
    <TableContainer>
      <Table size="small">
        <TableBody>
          {props.functions?.map((func) => (
            <TableRow key={func}>
              <TableCell>{func}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

function AuthorizedPrivilegesTable(props) {
  return (
    <TableContainer>
      <Table size="small">
        <TableBody>
          {props.authorizedPrivileges?.map((privilege) => (
            <TableRow key={privilege.title}>
              <TableCell>
                <StyledTooltip
                  title={privilege.description ? privilege.description : ""}
                >
                  <Typography>{privilege.title}</Typography>
                </StyledTooltip>
              </TableCell>
              <TableCell>
                <FunctionsPreformedTable
                  functions={privilege["functions-performed"]}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

function RoleIdTable(props) {
  return (
    <TableContainer>
      <Table size="small">
        <TableBody>
          {props.roleIds?.map((roleId) => (
            <TableRow key={roleId}>
              <TableCell>{roleId}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default function OSCALSystemImplementationUsers(props) {
  return (
    <>
      <OSCALSystemImplementationTableTitle variant="h6" id="tableTitle">
        Users
      </OSCALSystemImplementationTableTitle>
      <TableContainer sx={{ maxHeight: "25em" }}>
        <Table aria-label="Components" sx={{ height: "max-content" }}>
          <TableHead>
            <TableRow>
              <StyledHeaderTableCell>Title</StyledHeaderTableCell>
              <StyledHeaderTableCell>Short Name</StyledHeaderTableCell>
              <StyledHeaderTableCell>Properties</StyledHeaderTableCell>
              <StyledHeaderTableCell>Roll IDs</StyledHeaderTableCell>
              <StyledHeaderTableCell>
                Authorized Privileges
              </StyledHeaderTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {props.users.map((user) => (
              <StyledTableRow key={user.uuid}>
                <TableCell>
                  <StyledTooltip
                    title={user.description ? user.description : ""}
                  >
                    <Typography>{user.title}</Typography>
                  </StyledTooltip>
                </TableCell>
                <TableCell>{user["short-name"]}</TableCell>
                <TableCell>
                  <PropertiesTable list={user.props} />
                </TableCell>
                <TableCell>
                  <RoleIdTable roleIds={user["role-ids"]} />
                </TableCell>
                <TableCell>
                  <AuthorizedPrivilegesTable
                    authorizedPrivileges={user["authorized-privileges"]}
                  />
                </TableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
