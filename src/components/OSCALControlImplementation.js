import React from "react";
import makeStyles from "@mui/styles/makeStyles";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import OSCALControlImplementationImplReq from "./OSCALControlImplementationImplReq";
import OSCALControlImplementationAdd from "./OSCALControlImplementationAdd";

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
  OSCALControlImplementationHeader: {
    "& .MuiTypography-root": {
      "font-size": "0.875rem",
      color: "#0000008a",
    },
  },
}));

/**
 * Creates the control implementation by setting up the header and outer grid elements
 * and calls OSCALControlImplementationReqList.
 *
 * @param {object} props SSP properties
 * @returns The corresponding Control Implementation
 */
export default function OSCALControlImplementation(props) {
  const classes = useStyles();

  const implementedRequirements =
    props.controlImplementation["implemented-requirements"];
  const controlIds = implementedRequirements.map(
    (implementedControl) => implementedControl["control-id"]
  );

  return (
    <div className={classes.paper}>
      <Card>
        <CardContent>
          <Grid container spacing={2}>
            <Grid
              item
              xs={12}
              className={classes.OSCALControlImplementationHeader}
            >
              <Typography>Control Implementation</Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography>{props.controlImplementation.description}</Typography>
            </Grid>
            <Grid item xs={12}>
              <List className={classes.OSCALControlImplementationImplReqList}>
                {implementedRequirements.map((implementedRequirement) => (
                  <OSCALControlImplementationImplReq
                    implementedRequirement={implementedRequirement}
                    components={props.components}
                    controls={props.controls}
                    childLevel={0}
                    key={implementedRequirement.uuid}
                    modifications={props.modifications}
                    isEditable={props.isEditable}
                    onRestSuccess={props.onRestSuccess}
                    onRestError={props.onRestError}
                    partialRestData={props.partialRestData}
                  />
                ))}
              </List>
              {props.isEditable ? (
                <Grid item>
                  <OSCALControlImplementationAdd
                    controls={props.controls}
                    implementedControls={controlIds}
                    onRestSuccess={props.onRestSuccess}
                    onRestError={props.onRestError}
                    partialRestData={props.partialRestData}
                  />
                </Grid>
              ) : null}
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </div>
  );
}
