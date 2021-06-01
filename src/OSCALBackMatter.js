import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Chip from "@material-ui/core/Chip";
import Grid from "@material-ui/core/Grid";
import Link from "@material-ui/core/Link";
import { Tooltip, Typography } from "@material-ui/core";
import getUriFromBackMatterByHref from "./oscal-utils/OSCALGetBackMatterUri";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(2),
    display: "flex",
    flexDirection: "column",
  },
  OSCALBackMatterInfo: {
    "text-transform": "capitalize",
    "& .MuiTextField-root": {
      margin: theme.spacing(1),
    },
  },
  // TODO - This is hacky
  OSCALBackMatterHeader: {
    "& .MuiTypography-root": {
      "font-size": "0.875rem",
      color: "#0000008a",
    },
  },
}));

export default function OSCALBackMatter(props) {
  const classes = useStyles(props);

  const rev4URL =
    "https://raw.githubusercontent.com/usnistgov/oscal-content/master/nist.gov/SP800-53/rev4/json/NIST_SP-800-53_rev4_catalog.json";
  const rev5URL =
    "https://raw.githubusercontent.com/usnistgov/oscal-content/master/nist.gov/SP800-53/rev5/json/NIST_SP-800-53_rev5_catalog.json";
  const getHRef = (hRef, mediaType) => {
    let newHRef;
    if (!hRef.endsWith("http")) {
      if (!hRef.endsWith("json") && mediaType.endsWith("json")) {
        newHRef = hRef.replace("xml", "json");
      }
      if (newHRef.includes("rev4")) {
        newHRef = rev4URL;
      }
      if (newHRef.includes("rev5")) {
        newHRef = rev5URL;
      }
      return newHRef;
    }
    return hRef;
  };

  // eslint-disable-next-line
  const backMatterDisplay = (resource) => {
    if (!resource.title) {
      return (
        <Tooltip title={resource.description}>
          <Typography color="error">
            {resource.rlinks.map((rlink) => (
              <Chip
                label="Title"
                component="a"
                href={getUriFromBackMatterByHref(props.backMatter, props.href)}
                clickable
              />
            ))}
          </Typography>
        </Tooltip>
      );
    }
    if (resource.title) {
      return (
        <Tooltip title={resource.description}>
          <Typography>
            {resource.rlinks.map((rlink) => (
              <Chip
                label={resource.title}
                component="a"
                href={getUriFromBackMatterByHref(props.backMatter, props.href)}
                clickable
                variant="default"
              />
            ))}
          </Typography>
        </Tooltip>
      );
    }
  };

  return (
    <Card>
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={12} className={classes.OSCALBackMatterHeader}>
            <Typography>Back Matter</Typography>
          </Grid>
          <Grid item xs={7} className={classes.OSCALBackMatterInfo}>
            <Typography variant="h6">Resources</Typography>
          </Grid>
        </Grid>
        <Grid>
          {props.backMatter.resources.map((resource) =>
            backMatterDisplay(resource)
          )}
        </Grid>
      </CardContent>
    </Card>
  );
}
