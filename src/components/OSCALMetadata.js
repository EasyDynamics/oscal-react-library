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
import OSCALEditableFieldActions from "./OSCALEditableFieldActions";
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

  OSCALMetadataVersion: {
    marginLeft: theme.spacing(1),
  },
}));

// Returns a string with a locality-sensitive representation of this date
const formatDate = (isoDate) => new Date(isoDate).toLocaleString();

export default function OSCALMetadata(props) {
  const classes = useStyles();
  const versionIsInEditState = useState(false);
  const titleIsInEditState = useState(false);
  const versionReference = useRef("Version TextField Reference");
  const titleReference = useRef("Title TextField Reference");

  /* A JSON formatted variable containing information on how the OSCALEditableTextField
   *   is displayed.
   */
  const textElement = {
    version: {
      typographyVariant: "body2",
      textFieldSize: "small",
      textFieldVariant: "outlined",
    },
    title: {
      typographyVariant: "h6",
      textFieldSize: "medium",
      textFieldVariant: "outlined",
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
        <OSCALEditableTextField
          editedField={
            props.isEditable
              ? [Object.keys(props.patchData)[0], "metadata", "title"]
              : null
          }
          isInEditState={titleIsInEditState[0]}
          reference={titleReference}
          size={6}
          textElement={textElement.title}
          value={props.metadata.title}
        />
        <Grid item>
          <OSCALEditableFieldActions
            canEdit={props.isEditable}
            patchData={
              props.isEditable
                ? {
                    [Object.keys(props.patchData)[0]]: {
                      uuid: props.patchData[Object.keys(props.patchData)[0]]
                        .uuid,
                      metadata: {
                        title: props.metadata.title,
                      },
                    },
                  }
                : null
            }
            editedField={
              props.isEditable
                ? [Object.keys(props.patchData)[0], "metadata", "title"]
                : null
            }
            isInEditState={titleIsInEditState}
            restPatch={props.restPatch}
            reference={titleReference}
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
          <Grid container direction="row" alignItems="center">
            <Grid item className={classes.OSCALMetadataVersion}>
              <Typography
                variant="body2"
                className={classes.OSCALMetadataLabel}
              >
                Version:
              </Typography>
            </Grid>
            <OSCALEditableTextField
              className={classes.OSCALMetadataVersion}
              editedField={
                props.isEditable
                  ? [Object.keys(props.patchData)[0], "metadata", "version"]
                  : null
              }
              isInEditState={versionIsInEditState[0]}
              reference={versionReference}
              size={4}
              textElement={textElement.version}
              value={props.metadata.version}
            />
            <Grid item>
              <OSCALEditableFieldActions
                canEdit={props.isEditable}
                patchData={
                  props.isEditable
                    ? {
                        [Object.keys(props.patchData)[0]]: {
                          uuid: props.patchData[Object.keys(props.patchData)[0]]
                            .uuid,
                          metadata: {
                            version: props.metadata.version,
                          },
                        },
                      }
                    : null
                }
                editedField={
                  props.isEditable
                    ? [Object.keys(props.patchData)[0], "metadata", "version"]
                    : null
                }
                isInEditState={versionIsInEditState}
                reference={versionReference}
                restPatch={props.restPatch}
                update={props.update}
              />
            </Grid>
          </Grid>
          <Grid container spacing={1} direction="row" alignItems="center">
            <Grid item className={classes.OSCALMetadataVersion}>
              <Typography
                variant="body2"
                className={classes.OSCALMetadataLabel}
              >
                Last Modified:
              </Typography>
            </Grid>
            <Grid item>
              <Typography variant="body2">
                {formatDate(props.metadata["last-modified"])}
              </Typography>
            </Grid>
          </Grid>
          <Grid container spacing={1} direction="row" alignItems="center">
            <Grid item className={classes.OSCALMetadataVersion}>
              <Typography
                variant="body2"
                className={classes.OSCALMetadataLabel}
              >
                OSCAL Version:
              </Typography>
            </Grid>
            <Grid item>
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
