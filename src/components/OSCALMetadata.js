import React from "react";
import { styled } from "@mui/material/styles";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import ListSubheader from "@mui/material/ListSubheader";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import GroupIcon from "@mui/icons-material/Group";
import OSCALEditableTextField from "./OSCALEditableTextField";

const PREFIX = "OSCALMetadata";

const classes = {
  OSCALMetadataTitle: `${PREFIX}-OSCALMetadataTitle`,
  OSCALMetadataAdditional: `${PREFIX}-OSCALMetadataAdditional`,
  OSCALMetadataLabel: `${PREFIX}-OSCALMetadataLabel`,
  OSCALMetadataParties: `${PREFIX}-OSCALMetadataParties`,
  OSCALMetadataPartiesHeader: `${PREFIX}-OSCALMetadataPartiesHeader`,
  OSCALMetadataVersion: `${PREFIX}-OSCALMetadataVersion`,
};

const StyledGrid = styled(Grid)(({ theme }) => ({
  [`& .${classes.OSCALMetadataTitle}`]: {
    height: "56px",
  },

  [`& .${classes.OSCALMetadataAdditional}`]: {
    padding: theme.spacing(1),
  },

  [`& .${classes.OSCALMetadataLabel}`]: {
    "text-align": "right",
    color: "#0000008a",
  },

  [`& .${classes.OSCALMetadataParties}`]: {
    backgroundColor: theme.palette.background.paper,
    position: "relative",
    overflow: "auto",
    maxHeight: "12em",
  },

  [`& .${classes.OSCALMetadataPartiesHeader}`]: {
    backgroundColor: theme.palette.background.paper,
  },

  [`& .${classes.OSCALMetadataVersion}`]: {
    marginLeft: theme.spacing(1),
  },
}));

// Returns a string with a locality-sensitive representation of this date
const formatDate = (isoDate) => new Date(isoDate).toLocaleString();

export default function OSCALMetadata(props) {
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
    <StyledGrid container>
      <Grid item xs={12}>
        <Grid
          className={classes.OSCALMetadataTitle}
          container
          direction="row"
          alignItems="center"
        >
          <OSCALEditableTextField
            canEdit={props.isEditable}
            editedField={
              props.isEditable
                ? [Object.keys(props.partialRestData)[0], "metadata", "title"]
                : null
            }
            onFieldSave={props.onFieldSave}
            partialRestData={
              props.isEditable
                ? {
                    [Object.keys(props.partialRestData)[0]]: {
                      uuid: props.partialRestData[
                        Object.keys(props.partialRestData)[0]
                      ].uuid,
                      metadata: {
                        title: props.metadata.title,
                      },
                    },
                  }
                : null
            }
            size={6}
            textFieldSize="medium"
            typographyVariant="h6"
            value={props.metadata.title}
          />
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <Grid container spacing={3}>
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
                  canEdit={props.isEditable}
                  className={classes.OSCALMetadataVersion}
                  editedField={
                    props.isEditable
                      ? [
                          Object.keys(props.partialRestData)[0],
                          "metadata",
                          "version",
                        ]
                      : null
                  }
                  onFieldSave={props.onFieldSave}
                  partialRestData={
                    props.isEditable
                      ? {
                          [Object.keys(props.partialRestData)[0]]: {
                            uuid: props.partialRestData[
                              Object.keys(props.partialRestData)[0]
                            ].uuid,
                            metadata: {
                              version: props.metadata.version,
                            },
                          },
                        }
                      : null
                  }
                  size={4}
                  textFieldSize="small"
                  typographyVariant="body2"
                  value={props.metadata.version}
                />
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
      </Grid>
    </StyledGrid>
  );
}
