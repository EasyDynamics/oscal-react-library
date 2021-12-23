import React, { useRef, useState } from "react";
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

function saveModifiedMetadata(modifiedField, modifiableMetadata, newValue) {
  /* We must specify a method of PATCH so the backend service knows we are just
   * updating a value.
   *
   * We also provide a body so we can specify what needs to be modified.
   */
  fetch(window.location.href, {
    method: "PATCH",
    body: JSON.stringify({
      metadata: {
        modifiedField: newValue,
      },
    }),
  })
    .then((res) => res.json())
    .then(
      (result) => {
        /* If we reach this point, then the OSCAL file has successfully been modified
         * and we want those changes to be visible to the user.
         */
        modifiableMetadata["last-modified"][1](
          formatDate(result["last-modified"])
        );
        modifiableMetadata[modifiedField].value[1](newValue);
      },
      () => {
        alert(
          `Could not update the ${modifiedField} metadata field with value: ${newValue}.`
        );
      }
    );
}

function displayEditableTextField(modifiedField, modifiableMetadata) {
  return modifiableMetadata[modifiedField].edit[0] ? (
    <Typography variant="body1">
      <TextField
        size="medium"
        variant="outlined"
        inputRef={modifiableMetadata[modifiedField].ref}
      >
        {modifiableMetadata[modifiedField].value[0]}
      </TextField>
    </Typography>
  ) : (
    <Typography variant="body1">
      {modifiableMetadata[modifiedField].value[0]}
    </Typography>
  );
}

function displayEditIcons(modifiedField, modifiableMetadata) {
  const edit = modifiableMetadata[modifiedField].edit[0];
  const setEdit = modifiableMetadata[modifiedField].edit[1];

  return edit ? (
    <>
      <IconButton
        onClick={() => {
          setEdit(!edit);
        }}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
      <IconButton
        onClick={() => {
          const newValue = modifiableMetadata[modifiedField].ref.current.value;
          saveModifiedMetadata(modifiedField, modifiableMetadata, newValue);
          setEdit(!edit);
        }}
      >
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

  /* A JSON formatted variable so only one variable needs to be passed around between
   *  functions that deals with the modification of metadata fields.
   *
   *  For each top-level field, we have a value sub-field which is an array of two
   *  elements, where the first element of the array is the actual value of the
   *  top-level field and the second element of the array is a function that
   *  modifies the value of the top-level field.
   *
   *  We have an "edit" sub-field for the top-level "version" and "title" fields. This
   *  represents whether we are currently editing either of those fields.
   *
   *  We have the last modified top-level field because when other metadata fields are
   *  updated, we want to update the last modified field.
   */
  const modifiableMetadata = {
    "last-modified": useState(formatDate(props.metadata["last-modified"])),
    version: {
      ref: useRef("Version TextField Reference"),
      edit: useState(false),
      value: useState(props.metadata.version),
    },
    title: {
      ref: useRef("Title TextField Reference"),
      edit: useState(false),
      value: useState(props.metadata.title),
    },
  };

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
          {displayEditableTextField("title", modifiableMetadata)}
        </Grid>
        <Grid item spacing={1}>
          {props.edit ? displayEditIcons("title", modifiableMetadata) : null}
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
                {displayEditIcons("version", modifiableMetadata)}
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
              {displayEditableTextField("version", modifiableMetadata)}
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
                {modifiableMetadata["last-modified"][0]}
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
