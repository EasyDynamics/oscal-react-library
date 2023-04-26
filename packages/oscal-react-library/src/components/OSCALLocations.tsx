import { Location } from "@easydynamics/oscal-types";
import {
  DialogTitle,
  Stack,
  Grid,
  Card,
  Link,
  Typography,
  List,
  DialogContent,
} from "@mui/material";
import React from "react";
import {
  OSCALMetadataContactTypeHeader,
  TextWithIcon,
  OSCALMetadataFieldArea,
  OSCALMetadataAddress,
  MetadataInfoList,
  MetadataInfoType,
  OSCALMetadataCard,
  MetadataAvatar,
} from "./OSCALMetadataCommon";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import MapIcon from "@mui/icons-material/Map";
import PlaceIcon from "@mui/icons-material/Place";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import { OSCALMarkupLine } from "./OSCALMarkupProse";

export interface OSCALMetadataLocationsProps {
  locations: Location[] | undefined;
  urlFragment?: string;
}

export const OSCALMetadataLocations: React.FC<OSCALMetadataLocationsProps> = (props) => {
  const { locations, urlFragment } = props;

  const cards = locations?.map((location) => (
    <Grid item xs={12} md={4} key={location.uuid} component={Card}>
      <OSCALMetadataLocation location={location} />
    </Grid>
  ));

  return (
    <OSCALMetadataFieldArea title="Locations" urlFragment={urlFragment}>
      {cards}
    </OSCALMetadataFieldArea>
  );
};

interface OSCALMetadataLocationUrlsProps {
  /**
   * List of urls for a given location.
   */
  urls: string[] | undefined;
}

const OSCALMetadataLocationUrls: React.FC<OSCALMetadataLocationUrlsProps> = (props) => {
  const { urls } = props;
  return (
    <Stack>
      <OSCALMetadataContactTypeHeader title="URLs" />
      {urls?.length ? (
        urls.map((url) => (
          <TextWithIcon key={url} icon={<OpenInNewIcon />}>
            <Link href={url} target="_blank" rel="noreferrer">
              {url}
            </Link>
          </TextWithIcon>
        ))
      ) : (
        <Typography>No URL specified</Typography>
      )}
    </Stack>
  );
};

export const OSCALMetadataLocationContent: React.FC<OSCALMetadataLocationProps> = (props) => {
  const { location } = props;

  return (
    <Stack spacing={2}>
      <Grid container>
        <Grid item xs={4}>
          <OSCALMetadataContactTypeHeader icon={<MapIcon fontSize="small" />} title="Address" />
          <OSCALMetadataAddress address={location.address} />
        </Grid>
        <Grid item xs={4}>
          <OSCALMetadataContactTypeHeader icon={<PhoneIcon fontSize="small" />} title="Phone" />
          <List>
            <MetadataInfoList
              list={location["telephone-numbers"]}
              infoType={MetadataInfoType.telephone}
              emptyMessage="No telephone information provided"
            />
          </List>
        </Grid>
        <Grid item xs={4}>
          <OSCALMetadataContactTypeHeader icon={<EmailIcon fontSize="small" />} title="Email" />
          <List>
            <MetadataInfoList
              list={location["email-addresses"]}
              infoType={MetadataInfoType.email}
              emptyMessage="No email information provided"
            />
          </List>
        </Grid>
      </Grid>
      <OSCALMetadataLocationUrls urls={location?.urls} />
    </Stack>
  );
};

export interface OSCALMetadataLocationProps {
  location: Location;
}

export const OSCALMetadataLocation: React.FC<OSCALMetadataLocationProps> = (props) => {
  const { location } = props;

  const avatar = (
    <MetadataAvatar id={location.uuid} text={location.title} fallbackIcon={<PlaceIcon />} />
  );

  return (
    <OSCALMetadataCard title={location.title} avatar={avatar}>
      <DialogTitle>
        <OSCALMarkupLine>{location.title}</OSCALMarkupLine>
      </DialogTitle>
      <DialogContent dividers>
        <OSCALMetadataLocationContent location={location} />
      </DialogContent>
    </OSCALMetadataCard>
  );
};
