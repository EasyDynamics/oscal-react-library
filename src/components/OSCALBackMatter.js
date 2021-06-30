import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Chip from "@material-ui/core/Chip";
import Grid from "@material-ui/core/Grid";
import { Typography } from "@material-ui/core";
import FormatQuoteIcon from "@material-ui/icons/FormatQuote";
import DescriptionIcon from "@material-ui/icons/Description";
import StyledTooltip from "./OSCALStyledTooltip";
import { getAbsoluteUrl } from "../oscal-utils/OSCALBackMatterUtils";

// TODO: Temporary fix for missing media type (https://github.com/GSA/fedramp-automation/issues/103)
// Uses file extension instead
const getURLMediaType = (url) => {
  const lastUrlPath = url.split("//").pop().split("/").pop();
  return lastUrlPath.match(/\.[A-Za-z]{3,4}($|\?)/) || "Unknown";
};

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

function TitleDisplay(props) {
  const title = props.resource.title || "No Title";
  const color = props.resource.title ? "initial" : "error";
  return (
    <Typography color={color} variant="subtitle1">
      {title}
    </Typography>
  );
}

function DescriptionDisplay(props) {
  if (!props.resource?.description) {
    return (
      <DescriptionIcon
        color="disabled"
        fontSize="small"
        titleAccess={`${props.resource.title}-description`}
      />
    );
  }
  return (
    <StyledTooltip title={props.resource.description}>
      <DescriptionIcon
        color="primary"
        fontSize="small"
        titleAccess={`${props.resource.title}-description`}
      />
    </StyledTooltip>
  );
}

function CitationDisplay(props) {
  if (!props.resource?.citation?.text) {
    return (
      <FormatQuoteIcon
        color="disabled"
        fontSize="small"
        titleAccess={`${props.resource.title}-citation`}
      />
    );
  }
  return (
    <StyledTooltip title={props.resource.citation.text}>
      <FormatQuoteIcon
        color="primary"
        fontSize="small"
        titleAccess={`${props.resource.title}-citation`}
      />
    </StyledTooltip>
  );
}

export default function OSCALBackMatter(props) {
  if (!props.backMatter) {
    return null;
  }
  const classes = useStyles(props);

  const getMediaType = (rlink) =>
    rlink["media-type"] ||
    getURLMediaType(getAbsoluteUrl(rlink, props.parentUrl));

  // eslint-disable-next-line
  const backMatterDisplay = (resource) => {
    return (
      <Grid item xs={3} key={resource.uuid}>
        <Card>
          <CardContent>
            <Grid container spacing={0}>
              <Grid item xs={10}>
                <TitleDisplay resource={resource} />
              </Grid>
              <Grid item xs={2}>
                <Grid container spacing={0} justify="flex-end">
                  <DescriptionDisplay resource={resource} />
                  <CitationDisplay resource={resource} />
                </Grid>
              </Grid>
            </Grid>
            <Grid>
              <Typography>
                {resource.rlinks &&
                  resource.rlinks.map((rlink) => (
                    <Chip
                      key={resource.uuid}
                      label={getMediaType(rlink)}
                      component="a"
                      href={getAbsoluteUrl(rlink, props.parentUrl)}
                      variant="outlined"
                      clickable
                    />
                  ))}
              </Typography>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
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
        <Grid container spacing={2}>
          {props.backMatter.resources.map((resource) =>
            backMatterDisplay(resource)
          )}
        </Grid>
      </CardContent>
    </Card>
  );
}
