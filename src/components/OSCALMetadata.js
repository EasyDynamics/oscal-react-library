import React from "react";
import { styled } from "@mui/material/styles";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
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

export function OSCALMetadataPartyAddress(props) {
  // TODO: Show an icon for the address type (home, work)
  const { address } = props;
  return (
    <address>
      <Typography>
        {`${address["addr-lines"]?.join(", ")} ${address.city} ${
          address["postal-code"]
        } ${address.country}`}
      </Typography>
    </address>
  );
}

export function OSCALMetadataPartyEmail(props) {
  return <Link href={`mailto:${props.email}`}>{props.email}</Link>;
}

export function OSCALMetadataPartyTelephone(props) {
  // TODO: Show an icon for the telephone type (home, work, mobile)
  return (
    <Link href={`tel:${props.telephone.number}`}>{props.telephone.number}</Link>
  );
}

export function OSCALMetadataParty(props) {
  return (
    <ListItem key={`${props.party.uuid}-parties-listItem`}>
      <ListItemAvatar>
        <Avatar>
          {props.party.type === "organization" ? <GroupIcon /> : null}
        </Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={props.party.name}
        secondary={props.partyRolesText}
      />
      {props.party["telephone-numbers"]?.map((telephone) => (
        <OSCALMetadataPartyTelephone telephone={telephone} />
      ))}
      {props.party["email-addresses"]?.map((email) => (
        <OSCALMetadataPartyEmail email={email} />
      ))}
      {props.party.addresses?.map((address) => (
        <OSCALMetadataPartyAddress address={address} />
      ))}
    </ListItem>
  );
}

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
                {props.metadata.parties?.map((party) => (
                  <OSCALMetadataParty
                    key={party.uuid}
                    party={party}
                    partyRolesText={getPartyRolesText(party)}
                  />
                ))}
                {props.metadata.parties?.map((party) => console.log(party))}
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
