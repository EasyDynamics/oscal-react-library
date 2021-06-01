import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Chip from "@material-ui/core/Chip";
import Grid from "@material-ui/core/Grid";
import Link from "@material-ui/core/Link";
import { Tooltip, Typography } from "@material-ui/core";
import getUriFromBackMatterByHref from "./oscal-utils/OSCALBackMatterUtils";

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

  // eslint-disable-next-line
  const backMatterDisplay = (resource) => {
    let title;
    let color;
    if (!resource.title) {
      title = "No Title";
      color = "secondary";
    }
    if (resource.title) {
      title = resource.title;
      color = "default";
    }
    return (
      <Tooltip title={resource.description}>
        <Typography>
          {resource.rlinks.map((rlink) => (
            <Chip
              label={title}
              color={color}
              component="a"
              href={getUriFromBackMatterByHref(
                props.backMatter,
                props.href,
                props.parentUrl
              )}
              variant="outlined"
              clickable
            />
          ))}
        </Typography>
      </Tooltip>
    );
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
