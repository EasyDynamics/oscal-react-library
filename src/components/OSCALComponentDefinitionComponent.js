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
  OSCALComponentsHeader: {
    "& .MuiTypography-root": {
      "font-size": "0.875rem",
      color: "#0000008a",
    },
  },
}));

export default function OSCALComponentDefinitionComponent(props) {
  const classes = useStyles();

  return (
    <div className={classes.paper}>
      <Card>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} className={classes.OSCALComponentsHeader}>
              <Typography>Components</Typography>
            </Grid>
            <Grid item xs={12}>
              <TableContainer>
                <Table aria-label="Title">
                  <TableHead>
                    <TableRow>
                      <TableCell>Title</TableCell>
                      <TableCell>Description</TableCell>
                      <TableCell>Responsible Roles</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow key={props.component.uuid}>
                      <TableCell component="th" scope="row">
                        <StyledTooltip title={props.component.description}>
                          <Typography variant="body2">
                            {props.component.title}
                          </Typography>
                        </StyledTooltip>
                      </TableCell>
                      <TableCell>{props.component.type}</TableCell>
                      <TableCell>
                        <OSCALResponsibleRoles
                          responsibleRoles={
                            props.component["responsible-roles"]
                          }
                          parties={props.parties}
                        />
                      </TableCell>
                    </TableRow>
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
