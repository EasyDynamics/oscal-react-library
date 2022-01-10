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
import GroupIcon from "@material-ui/icons/Group";
import { makeStyles } from "@material-ui/core/styles";
import OSCALModificationIcons from "./OSCALModificationIcons";
import OSCALEditableTextField from "./OSCALEditableTextField";

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

export default function OSCALMetadata(props) {
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
      value: props.metadata.version,
      typographyVariant: "body2",
    },
    title: {
      ref: useRef("Title TextField Reference"),
      edit: useState(false),
      value: props.metadata.title,
      typographyVariant: "h6",
    },
  };

  if (!props.metadata) {
    return null;
  }

  let patchData;

  if (props.edit) {
    patchData = props.patchData;
    patchData[props.editedField[0]].metadata = {
      version: props.metadata.version,
      title: props.metadata.title,
    };
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
        <Grid item>
          <OSCALEditableTextField
            modifiableData={modifiableMetadata.title}
            editedField={
              props.edit ? props.editedField.concat(["title"]) : null
            }
          />
        </Grid>
        <Grid item>
          <OSCALModificationIcons
            canEdit={props.edit}
            data={patchData}
            editedField={
              props.edit ? props.editedField.concat(["title"]) : null
            }
            modifiableData={modifiableMetadata.title}
            onSave={props.onSave}
            update={props.update}
          />
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
            <Grid container justify="flex-end">
              <OSCALModificationIcons
                canEdit={props.edit}
                data={patchData}
                editedField={
                  props.edit ? props.editedField.concat(["version"]) : null
                }
                modifiableData={modifiableMetadata.version}
                onSave={props.onSave}
                update={props.update}
              />
            </Grid>
            <Grid item xs={4}>
              <Typography
                variant="body2"
                className={classes.OSCALMetadataLabel}
              >
                Version:
              </Typography>
            </Grid>
            <Grid item xs={8}>
              <OSCALEditableTextField
                editedField={
                  props.edit ? props.editedField.concat(["version"]) : null
                }
                modifiableData={modifiableMetadata.version}
              />
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
