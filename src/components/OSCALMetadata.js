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

export const OSCALMetadataPartiesHeader = styled(ListSubheader)(
  ({ theme }) => `
  background-color: ${theme.palette.background.paper};
`
);
const OSCALMetadataLabel = styled(Typography)`
  text-align: right;
  color: #0000008a;
`;

const OSCALMetadataTitle = styled(Grid)`
  height: 56px;
`;

const OSCALMetadataKey = styled(Grid)(
  ({ theme }) => `margin-left: ${theme.spacing(1)};`
);

const OSCALMetadataAdditional = styled(Paper)(
  ({ theme }) => `padding: ${theme.spacing(1)};`
);

const OSCALMetadataPartiesCard = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  position: "relative",
  overflow: "auto",
  maxHeight: "12em",
}));

// Returns a string with a locality-sensitive representation of this date
const formatDate = (isoDate) => new Date(isoDate).toLocaleString();

function OSCALMetadataParty(partyName, partyUuid, partyType, metadata) {
  const getRoleLabel = (roleId) =>
    metadata.roles.find((role) => role.id === roleId)?.title;

  const getPartyRolesText = () =>
    metadata["responsible-parties"]
      ?.filter((responsibleParty) =>
        responsibleParty["party-uuids"]?.includes(partyUuid)
      )
      .map((item) => item["role-id"])
      .map(getRoleLabel)
      // Remove empty/falsey items from the list
      .filter((item) => item)
      .join(", ");

  return (
    <ListItem key={`${partyUuid}-parties-listItem`}>
      <ListItemAvatar>
        <Avatar>{partyType === "organization" ? <GroupIcon /> : null}</Avatar>
      </ListItemAvatar>
      <ListItemText primary={partyName} secondary={getPartyRolesText()} />{" "}
    </ListItem>
  );
}

export default function OSCALMetadata(props) {
  if (!props.metadata) {
    return null;
  }

  return (
    <Grid container>
      <Grid item xs={12}>
        <OSCALMetadataTitle container direction="row" alignItems="center">
          <OSCALEditableTextField
            fieldName="Title"
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
        </OSCALMetadataTitle>
      </Grid>
      <Grid item xs={12}>
        <Grid container spacing={3}>
          <Grid item xs={8}>
            <OSCALMetadataPartiesCard>
              <List
                subheader={
                  <OSCALMetadataPartiesHeader
                    component="div"
                    id="oscal-metadata-parties"
                  >
                    Parties
                  </OSCALMetadataPartiesHeader>
                }
              >
                {props.metadata.parties?.map((party) =>
                  OSCALMetadataParty(
                    party.name,
                    party.uuid,
                    party.type,
                    props.metadata
                  )
                )}
              </List>
            </OSCALMetadataPartiesCard>
          </Grid>
          <Grid item xs={4}>
            <OSCALMetadataAdditional>
              <Grid container direction="row" alignItems="center">
                <OSCALMetadataKey item>
                  <OSCALMetadataLabel variant="body2">
                    Version:
                  </OSCALMetadataLabel>
                </OSCALMetadataKey>
                <OSCALEditableTextField
                  fieldName="Version"
                  canEdit={props.isEditable}
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
                <OSCALMetadataKey item>
                  <OSCALMetadataLabel variant="body2">
                    Last Modified:
                  </OSCALMetadataLabel>
                </OSCALMetadataKey>
                <Grid item>
                  <Typography variant="body2">
                    {formatDate(props.metadata["last-modified"])}
                  </Typography>
                </Grid>
              </Grid>
              <Grid container spacing={1} direction="row" alignItems="center">
                <OSCALMetadataKey item>
                  <OSCALMetadataLabel variant="body2">
                    OSCAL Version:
                  </OSCALMetadataLabel>
                </OSCALMetadataKey>
                <Grid item>
                  <Typography variant="body2">
                    {props.metadata["oscal-version"]}
                  </Typography>
                </Grid>
              </Grid>
            </OSCALMetadataAdditional>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}
