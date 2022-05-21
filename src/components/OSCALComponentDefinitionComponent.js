import React from "react";
import { styled } from "@mui/material/styles";
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

const PREFIX = "OSCALComponentDefinitionComponent";

const classes = {
  paper: `${PREFIX}-paper`,
  OSCALComponentsHeader: `${PREFIX}-OSCALComponentsHeader`,
};

const Root = styled("div")(({ theme }) => ({
  [`&.${classes.paper}`]: {
    marginTop: theme.spacing(2),
    display: "flex",
    flexDirection: "column",
  },

  [`& .${classes.OSCALComponentsHeader}`]: {
    "& .MuiTypography-root": {
      "font-size": "0.875rem",
      color: "#0000008a",
    },
  },
}));

export default function OSCALComponentDefinitionComponent(props) {
  return (
    <Root className={classes.paper}>
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
    </Root>
  );
}
