import {
  PartyOrganizationOrPerson,
  PublicationMetadata,
  Role,
  PartyType,
} from "@easydynamics/oscal-types";
import EmailIcon from "@mui/icons-material/Email";
import MapIcon from "@mui/icons-material/Map";
import PhoneIcon from "@mui/icons-material/Phone";
import PersonIcon from "@mui/icons-material/Person";
import GroupIcon from "@mui/icons-material/Group";
import { Card, DialogContent, DialogTitle, Grid, List, Stack, Typography } from "@mui/material";
import React from "react";
import {
  MetadataAvatar,
  MetadataInfoList,
  MetadataInfoType,
  OSCALMetadataCard,
  OSCALMetadataContactTypeHeader,
  OSCALMetadataFieldArea,
} from "./OSCALMetadataCommon";

export interface OSCALMetadataPartyProps {
  party: PartyOrganizationOrPerson;
  partyRolesText: Role[] | undefined;
}

export const OSCALMetadataParty: React.FC<OSCALMetadataPartyProps> = (props) => {
  const fallbackIcon =
    props.party?.type === PartyType.ORGANIZATION ? <GroupIcon /> : <PersonIcon />;

  const avatar = (
    <MetadataAvatar id={props.party.uuid} text={props.party.name} fallbackIcon={fallbackIcon} />
  );

  return (
    <OSCALMetadataCard
      title={props.party.name}
      subheader={props.partyRolesText?.map((role) => role.title).join(", ")}
      avatar={avatar}
    >
      <DialogTitle id="scroll-dialog-title">
        <Stack direction="row" alignItems="center" gap={1}>
          {avatar}
          <Stack direction="column">
            {props.party.name}
            {props.partyRolesText?.map((role) => (
              <Typography key={role.title}> {role.title} </Typography>
            ))}
          </Stack>
        </Stack>
      </DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={1}>
          <Grid item xs={4}>
            <OSCALMetadataContactTypeHeader icon={<MapIcon fontSize="small" />} title="Address" />
            <List>
              <MetadataInfoList
                list={props.party.addresses}
                infoType={MetadataInfoType.address}
                emptyMessage="No address information provided"
              />
            </List>
          </Grid>
          <Grid item xs={4}>
            <OSCALMetadataContactTypeHeader icon={<PhoneIcon fontSize="small" />} title="Phone" />
            <List>
              <MetadataInfoList
                list={props.party["telephone-numbers"]}
                infoType={MetadataInfoType.telephone}
                emptyMessage="No telephone information provided"
              />
            </List>
          </Grid>
          <Grid item xs={4}>
            <OSCALMetadataContactTypeHeader icon={<EmailIcon fontSize="small" />} title="Email" />
            <List>
              <MetadataInfoList
                list={props.party["email-addresses"]}
                infoType={MetadataInfoType.email}
                emptyMessage="No email information provided"
              />
            </List>
          </Grid>
        </Grid>
      </DialogContent>
    </OSCALMetadataCard>
  );
};

export interface OSCALMetadataPartiesProps {
  metadata: PublicationMetadata;
  parties: PartyOrganizationOrPerson[] | undefined;
  urlFragment?: string;
}

export const OSCALMetadataParties: React.FC<OSCALMetadataPartiesProps> = (props) => {
  const { parties, urlFragment } = props;

  const getRoleLabel = (roleId: string) =>
    props.metadata?.roles?.find((role) => role.id === roleId);

  const getPartyRolesText = (party: PartyOrganizationOrPerson) =>
    props.metadata["responsible-parties"]
      ?.filter((responsibleParty) => responsibleParty["party-uuids"]?.includes(party.uuid))
      .map((item) => item["role-id"])
      .map(getRoleLabel)
      .filter((item): item is Role => !!item);

  const cards = parties?.map((party) => (
    <Grid item xs={12} md={4} key={party.uuid} component={Card}>
      <OSCALMetadataParty party={party} partyRolesText={getPartyRolesText(party)} />
    </Grid>
  ));

  return (
    <OSCALMetadataFieldArea title="Parties" urlFragment={urlFragment}>
      {cards}
    </OSCALMetadataFieldArea>
  );
};
