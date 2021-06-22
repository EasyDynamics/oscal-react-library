import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { List, ListItem, ListItemText } from "@material-ui/core";
import OSCALControlImplementationImplReq from "./OSCALControlImplementationImplReq";

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
  OSCALComponentControlImplementationHeader: {
    "& .MuiTypography-root": {
      "font-size": "0.875rem",
      color: "#0000008a",
    },
  },
}));

export default function OSCALComponentDefinitionControlImplementation(props) {
  const classes = useStyles();

  return (
    <div className={classes.paper}>
      <Card>
        <CardContent>
          <Grid container spacing={2}>
            <Grid
              item
              xs={12}
              className={classes.OSCALComponentControlImplementationHeader}
            >
              <Typography>Control Implementations</Typography>
            </Grid>
            <Grid item xs={12}>
              <List>
                {props.controlImplementations.map((controlImpl) => (
                  <ListItem key={controlImpl.uuid}>
                    <ListItemText>
                      {controlImpl.description}
                      <Grid item xs={12}>
                        <List
                          className={
                            classes.OSCALControlImplementationImplReqList
                          }
                        >
                          {controlImpl["implemented-requirements"].map(
                            (implementedRequirement) => (
                              <OSCALControlImplementationImplReq
                                implementedRequirement={implementedRequirement}
                                components={props.components}
                                controls={props.controls}
                                childLevel={0}
                                key={implementedRequirement.uuid}
                              />
                            )
                          )}
                        </List>
                      </Grid>
                    </ListItemText>
                  </ListItem>
                ))}
              </List>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </div>
  );
}
