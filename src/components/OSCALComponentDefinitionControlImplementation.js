import React from "react";
import { styled } from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { List, ListItem, ListItemText } from "@mui/material";
import OSCALControlImplementationImplReq from "./OSCALControlImplementationImplReq";

const PREFIX = "OSCALComponentDefinitionControlImplementation";

const classes = {
  paper: `${PREFIX}-paper`,
  OSCALSystemImplementationSubDataHeader: `${PREFIX}-OSCALSystemImplementationSubDataHeader`,
  OSCALComponentControlImplementationHeader: `${PREFIX}-OSCALComponentControlImplementationHeader`,
};

const Root = styled("div")(({ theme }) => ({
  [`&.${classes.paper}`]: {
    marginTop: theme.spacing(2),
    display: "flex",
    flexDirection: "column",
  },

  [`& .${classes.OSCALSystemImplementationSubDataHeader}`]: {
    "text-transform": "capitalize",
    "white-space": "nowrap",
  },

  // TODO - This is hacky
  [`& .${classes.OSCALComponentControlImplementationHeader}`]: {
    "& .MuiTypography-root": {
      "font-size": "0.875rem",
      color: "#0000008a",
    },
  },
}));

export default function OSCALComponentDefinitionControlImplementation(props) {
  return (
    <Root className={classes.paper}>
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
                                modifications={controlImpl.modifications}
                                isEditable={props.isEditable}
                                onRestSuccess={props.onRestSuccess}
                                onRestError={props.onRestError}
                                partialRestData={props.partialRestData}
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
    </Root>
  );
}
