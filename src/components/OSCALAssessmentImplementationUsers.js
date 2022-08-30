import React from "react";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import StyledTooltip from "./OSCALStyledTooltip";

const SmallTableCell = styled(TableCell)`
  text-align: right;
  padding: 0.75em 0.75em;
`;

const OSCALAssessmentImplementationTableTitle = styled(Typography)`
  flex: 1 1 100%;
  padding-top: 1em;
  padding-bottom: 1em;
`;

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

const OSCALPropertiesSubDataHeader = styled(TableCell)`
  text-transform: capitalize;
  white-space: nowrap;
  padding: 0.75em 0.75em;
`;

function PropertiesTable(props) {
  return (
    <TableContainer>
      <Table size="small">
        <TableBody>
          {props.list?.map((property) => (
            <TableRow key={property.name}>
              <OSCALPropertiesSubDataHeader component="th" scope="row">
                {property.name}
              </OSCALPropertiesSubDataHeader>
              <SmallTableCell>{property.value}</SmallTableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

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

export default function OSCALAssessmentImplementationUsers(props) {
  return (
    <>
      <OSCALAssessmentImplementationTableTitle variant="h6" id="tableTitle">
        Users
      </OSCALAssessmentImplementationTableTitle>
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
