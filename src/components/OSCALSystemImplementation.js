import React from "react";
import makeStyles from "@mui/styles/makeStyles";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import OSCALResponsibleRoles from "./OSCALResponsibleRoles";
import StyledTooltip from "./OSCALStyledTooltip";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(2),
    display: "flex",
    flexDirection: "column",
  },
  OSCALSystemImplementationSubDataHeader: {
    "text-transform": "capitalize",
    "white-space": "nowrap",
    padding: "0.75em 0.75em",
  },
  // TODO - This is hacky
  OSCALSystemImplementationHeader: {
    "& .MuiTypography-root": {
      "font-size": "0.875rem",
      color: "#0000008a",
    },
  },
  SmallTableCell: {
    "text-align": "right",
    padding: "0.75em 0.75em",
  },
  ComponentTitleCell: {
    "text-align": "left",
    minWidth: "20em",
  },
}));

export default function OSCALSystemImplementation(props) {
  const classes = useStyles();
  if (!props.systemImplementation) {
    return null;
  }

  return (
    <div className={classes.paper}>
      <Card>
        <CardContent>
          <Grid container spacing={2}>
            <Grid
              item
              xs={12}
              className={classes.OSCALSystemImplementationHeader}
            >
              <Typography>System Implementation</Typography>
            </Grid>
            <Grid
              item
              xs={12}
              className={classes.OSCALSystemCharacteristicsInfo}
            >
              <Typography>{props.systemImplementation.remarks}</Typography>
            </Grid>
            <Grid item xs={12}>
              <TableContainer>
                <Table aria-label="Components">
                  <TableHead>
                    <TableRow>
                      <TableCell>Component</TableCell>
                      <TableCell>Type</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Properties</TableCell>
                      <TableCell>Responsible Roles</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {Object.entries(props.systemImplementation.components).map(
                      ([key, component]) => (
                        <TableRow key={key}>
                          <TableCell
                            component="th"
                            scope="row"
                            className={classes.ComponentTitleCell}
                          >
                            <StyledTooltip title={component.description}>
                              <Typography variant="body2">
                                {component.title}
                              </Typography>
                            </StyledTooltip>
                          </TableCell>
                          <TableCell>{component.type}</TableCell>
                          <TableCell>
                            {component.status && component.status.state}
                          </TableCell>
                          <TableCell>
                            <TableContainer>
                              <Table size="small">
                                <TableBody>
                                  {component.props &&
                                    component.props.map((property) => (
                                      <TableRow key={property.name}>
                                        <TableCell
                                          className={
                                            classes.OSCALSystemImplementationSubDataHeader
                                          }
                                          component="th"
                                          scope="row"
                                        >
                                          {property.name}
                                        </TableCell>
                                        <TableCell
                                          className={classes.SmallTableCell}
                                        >
                                          {property.value}
                                        </TableCell>
                                      </TableRow>
                                    ))}
                                </TableBody>
                              </Table>
                            </TableContainer>
                          </TableCell>
                          <TableCell>
                            <OSCALResponsibleRoles
                              responsibleRoles={component["responsible-roles"]}
                              parties={props.parties}
                            />
                          </TableCell>
                        </TableRow>
                      )
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </div>
  );
}
