import React from "react";
import { styled } from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import OSCALResponsibleRoles from "./OSCALResponsibleRoles";
import StyledTooltip from "./OSCALStyledTooltip";
import { OSCALSection, OSCALSectionHeader } from "../styles/CommonPageStyles";
import { OSCALMarkupMultiLine } from "./OSCALMarkupProse";

const SmallTableCell = styled(TableCell)`
  text-align: right;
  padding: 0.75em 0.75em;
`;

const ComponentTableCell = styled(TableCell)`
  text-align: left;
  minwidth: 20em;
`;

const OSCALSystemImplementationSubDataHeader = styled(TableCell)`
  text-transform: capitalize;
  white-space: nowrap;
  padding: 0.75em 0.75em;
`;

const OSCALSystemImplementationTableTitle = styled(Typography)`
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

function PropertiesTable(props) {
  return (
    <TableContainer>
      <Table size="small">
        <TableBody>
          {props.list?.map((property) => (
            <TableRow key={property.name}>
              <OSCALSystemImplementationSubDataHeader
                component="th"
                scope="row"
              >
                {property.name}
              </OSCALSystemImplementationSubDataHeader>
              <SmallTableCell>{property.value}</SmallTableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

function OSCALSystemImplementationComponents(props) {
  return (
    <>
      <OSCALSystemImplementationTableTitle variant="h6" id="tableTitle">
        Components
      </OSCALSystemImplementationTableTitle>
      <TableContainer sx={{ maxHeight: "25em" }}>
        <Table aria-label="Components" sx={{ height: "max-content" }}>
          <TableHead>
            <TableRow>
              <StyledHeaderTableCell>Component</StyledHeaderTableCell>
              <StyledHeaderTableCell>Type</StyledHeaderTableCell>
              <StyledHeaderTableCell>Status</StyledHeaderTableCell>
              <StyledHeaderTableCell>Properties</StyledHeaderTableCell>
              <StyledHeaderTableCell>Responsible Roles</StyledHeaderTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {props.components.map((component) => (
              <StyledTableRow key={component.uuid}>
                <ComponentTableCell component="th" scope="row">
                  <StyledTooltip title={component.description}>
                    <Typography>{component.title}</Typography>
                  </StyledTooltip>
                </ComponentTableCell>
                <TableCell>{component.type}</TableCell>
                <TableCell>{component.status?.state}</TableCell>
                <TableCell>
                  <PropertiesTable list={component.props} />
                </TableCell>
                <TableCell>
                  <OSCALResponsibleRoles
                    responsibleRoles={component["responsible-roles"]}
                    parties={props.parties}
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

function OSCALSystemImplementationUsers(props) {
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

function OSCALResponsibleParties(props) {
  const getPartyName = (partyUuid) =>
    props.parties?.find((party) => party.uuid === partyUuid)?.name;

  return (
    <TableContainer>
      <Table size="small">
        <TableBody>
          {props.responsibleParties?.map((party) => (
            <TableRow key={party["role-id"]}>
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
    </TableContainer>
  );
}

function ImplementedComponents(props) {
  const getComponent = (compUuid) =>
    props.components?.find((component) => component.uuid === compUuid);

  return (
    <TableContainer>
      <Table size="small">
        <TableBody>
          {props.implementedComponents?.map((comp) => (
            <TableRow key={comp["component-uuid"]}>
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
    </TableContainer>
  );
}

function OSCALInventoryItems(props) {
  if (!props.inventoryItems) {
    return null;
  }

  return (
    <>
      <OSCALSystemImplementationTableTitle variant="h6" id="tableTitle">
        Inventory Items
      </OSCALSystemImplementationTableTitle>

      <TableContainer sx={{ maxHeight: "25em" }}>
        <Table aria-label="Inventory Items" sx={{ height: "max-content" }}>
          <TableHead>
            <TableRow>
              <StyledHeaderTableCell>Item</StyledHeaderTableCell>
              <StyledHeaderTableCell>Properties</StyledHeaderTableCell>
              <StyledHeaderTableCell>Responsible Parties</StyledHeaderTableCell>
              <StyledHeaderTableCell>
                Implemented Components
              </StyledHeaderTableCell>
              <StyledHeaderTableCell>Remarks</StyledHeaderTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {props.inventoryItems.map((inventoryItem) => (
              <StyledTableRow key={inventoryItem.uuid}>
                <TableCell>{inventoryItem.description}</TableCell>
                <TableCell>
                  <PropertiesTable list={inventoryItem.props} />
                </TableCell>
                <TableCell>
                  <OSCALResponsibleParties
                    responsibleParties={inventoryItem["responsible-parties"]}
                    parties={props.parties}
                  />
                </TableCell>
                <TableCell>
                  <ImplementedComponents
                    implementedComponents={
                      inventoryItem["implemented-components"]
                    }
                    components={props.components}
                  />
                </TableCell>
                <TableCell>{inventoryItem.remarks}</TableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}

export default function OSCALSystemImplementation(props) {
  if (!props.systemImplementation) {
    return null;
  }

  return (
    <OSCALSection>
      <Card>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <OSCALSectionHeader>System Implementation</OSCALSectionHeader>
            </Grid>
            <Grid item xs={12}>
              <OSCALMarkupMultiLine paragraphComponent={Typography}>
                {props.systemImplementation.remarks}
              </OSCALMarkupMultiLine>
            </Grid>
            <Grid item xs={12}>
              <OSCALSystemImplementationUsers
                users={props.systemImplementation.users}
              />
            </Grid>
            <Grid item xs={12}>
              <OSCALSystemImplementationComponents
                components={props.systemImplementation.components}
                parties={props.parties}
              />
            </Grid>
            <Grid item xs={12}>
              <OSCALInventoryItems
                inventoryItems={props.systemImplementation["inventory-items"]}
                parties={props.parties}
                components={props.components}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </OSCALSection>
  );
}
