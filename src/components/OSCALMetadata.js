import React, { useState } from "react";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import List from "@material-ui/core/List";
import ListSubheader from "@material-ui/core/ListSubheader";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import CloseIcon from "@material-ui/icons/Close";
import EditIcon from "@material-ui/icons/Edit";
import GroupIcon from "@material-ui/icons/Group";
import SaveIcon from "@material-ui/icons/Save";
import { makeStyles } from "@material-ui/core/styles";
import { IconButton, TextField } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  OSCALMetadataAdditional: {
    padding: theme.spacing(1),
  },
  OSCALMetadataLabel: {
    "text-align": "right",
    color: "#0000008a",
  },
  OSCALMetadataParties: {
    backgroundColor: theme.palette.background.paper,
    position: "relative",
    overflow: "auto",
    maxHeight: "12em",
  },
  OSCALMetadataPartiesHeader: {
    backgroundColor: theme.palette.background.paper,
  },
}));

// Returns a string with a locality-sensitive representation of this date
const formatDate = (isoDate) => new Date(isoDate).toLocaleString();

function displayEditableTextField(editing, textFieldValue) {
  return editing ? (
    <Typography variant="body1">
      <TextField
        defaultValue={textFieldValue}
        variant="outlined"
        size="medium"
      />
    </Typography>
  ) : (
    <Typography variant="body1">{textFieldValue}</Typography>
  );
}

function displayEditIcons(edit, setEdit) {
  return edit ? (
    <>
      <IconButton
        onClick={() => {
          setEdit(!edit);
        }}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
      <IconButton>
        <SaveIcon fontSize="small" />
      </IconButton>
    </>
  ) : (
    <IconButton
      onClick={() => {
        setEdit(!edit);
      }}
    >
      <EditIcon fontSize="small" />
    </IconButton>
  );
}

export default function OSCALControlGuidance(props) {
  const classes = useStyles();
  const [versionEdit, setVersionEdit] = useState(false);
  const [titleEdit, setTitleEdit] = useState(false);

  if (!props.metadata) {
    return null;
  }

  const getRoleLabel = (roleId) =>
    props.metadata.roles.find((role) => role.id === roleId)?.title;

  const getPartyRolesText = (party) =>
    props.metadata["responsible-parties"]
      ?.filter((responsibleParty) =>
        responsibleParty["party-uuids"]?.includes(party.uuid)
      )
      .map((item) => item["role-id"])
      .map(getRoleLabel)
      // Remove empty/falsey items from the list
      .filter((item) => item)
      .join(", ");

  return (
    <Grid container spacing={3}>
      <Grid container direction="row" alignItems="center">
        <Grid item spacing={1}>
          {displayEditableTextField(titleEdit, props.metadata.title)}
        </Grid>
        <Grid item spacing={1}>
          {props.edit ? displayEditIcons(titleEdit, setTitleEdit) : null}
        </Grid>
      </Grid>
      <Grid item xs={8}>
        <Paper className={classes.OSCALMetadataParties}>
          <List
            subheader={
              <ListSubheader
                className={classes.OSCALMetadataPartiesHeader}
                component="div"
                id="oscal-metadata-parties"
              >
                Parties
              </ListSubheader>
            }
          >
            {props.metadata.parties?.map((party) => (
              <ListItem key={`${party.uuid}-parties-listItem`}>
                <ListItemAvatar>
                  <Avatar>
                    {party.type === "organization" ? <GroupIcon /> : null}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={party.name}
                  secondary={getPartyRolesText(party)}
                />
              </ListItem>
            ))}
          </List>
        </Paper>
      </Grid>
      <Grid item xs={4}>
        <Paper className={classes.OSCALMetadataAdditional}>
          <Grid container spacing={1}>
            {props.edit ? (
              <Grid container justify="flex-end" xs={12}>
                {displayEditIcons(versionEdit, setVersionEdit)}
              </Grid>
            ) : null}
            <Grid item xs={4}>
              <Typography
                variant="body2"
                className={classes.OSCALMetadataLabel}
              >
                Version:
              </Typography>
            </Grid>
            <Grid item xs={8}>
              {displayEditableTextField(versionEdit, props.metadata.version)}
            </Grid>
            <Grid item xs={4}>
              <Typography
                variant="body2"
                className={classes.OSCALMetadataLabel}
              >
                Last Modified:
              </Typography>
            </Grid>
            <Grid item xs={8}>
              <Typography variant="body2">
                {formatDate(props.metadata["last-modified"])}
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography
                variant="body2"
                className={classes.OSCALMetadataLabel}
              >
                OSCAL Version:
              </Typography>
            </Grid>
            <Grid item xs={8}>
              <Typography variant="body2">
                {props.metadata["oscal-version"]}
              </Typography>
            </Grid>
          </Grid>
        </Paper>
      </Grid>
    </Grid>
  );
}
