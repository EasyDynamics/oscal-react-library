import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
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
  },
  // TODO - This is hacky
  OSCALSystemImplementationHeader: {
    "& .MuiTypography-root": {
      "font-size": "0.875rem",
      color: "#0000008a",
    },
  },
}));

export default function OSCALSystemImplementation(props) {
  const classes = useStyles();
  if (!props.systemImplementation) {
    return null;
  }

  /* eslint-enable */

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
                      ([key, component], index) => (
                        <TableRow key={key}>
                          <TableCell component="th" scope="row">
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
                                        <TableCell align="right">
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
