import React from "react";
import { styled } from "@mui/material/styles";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import ContactPageIcon from "@mui/icons-material/ContactPage";
import DialogTitle from "@mui/material/DialogTitle";
import Link from "@mui/material/Link";
import ListSubheader from "@mui/material/ListSubheader";
import Card from "@mui/material/Card";
import MapIcon from "@mui/icons-material/Map";
import EmailIcon from "@mui/icons-material/Email";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import CardContent from "@mui/material/CardContent";
import Avatar from "@mui/material/Avatar";
import GroupIcon from "@mui/icons-material/Group";
import PhoneIcon from "@mui/icons-material/Phone";
import CardActions from "@mui/material/CardActions";
import Button from "@mui/material/Button";
import HomeIcon from "@mui/icons-material/Home";
import BusinessIcon from "@mui/icons-material/Business";
import SmartphoneIcon from "@mui/icons-material/Smartphone";
import Dialog from "@mui/material/Dialog";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import OSCALEditableTextField from "./OSCALEditableTextField";

export const OSCALMetadataPartiesHeader = styled(ListSubheader)(
  ({ theme }) => `
  background-color: ${theme.palette.background.paper};
`
);

const OSCALMetadataPartiesInfoHeader = styled(Typography)`
  display: flex;
  align-items: center;
`;

const OSCALMetadataLabel = styled(Typography)(({ theme }) => ({
  textAlign: "right",
  color: theme.palette.text.secondary,
}));

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
  maxHeight: "18em",
}));

// Returns a string with a locality-sensitive representation of this date
const formatDate = (isoDate) => new Date(isoDate).toLocaleString();

const TELEPHONE_ICON_MAPPING = {
  home: <HomeIcon />,
  mobile: <SmartphoneIcon />,
  office: <BusinessIcon />,
};

const ADDRESS_ICON_MAPPING = {
  home: <HomeIcon />,
  work: <BusinessIcon />,
};

const UNKNOWN_TYPE_ICON = <HelpOutlineIcon />;

function getIconOfType(mapping, contactType) {
  if (!mapping || !contactType) {
    return UNKNOWN_TYPE_ICON;
  }
  return mapping[contactType] ?? UNKNOWN_TYPE_ICON;
}

function getPhoneIcon(contactType) {
  return getIconOfType(TELEPHONE_ICON_MAPPING, contactType);
}

function getAddressIcon(contactType) {
  return getIconOfType(ADDRESS_ICON_MAPPING, contactType);
}

export function OSCALMetadataPartyAddress(props) {
  const { address } = props;
  const addrString = [
    ...address["addr-lines"],
    `${address.city}, ${address.state} ${address["postal-code"]}`,
    address.country,
  ]
    .filter((line) => line)
    .flatMap((item) => [item, <br key={item} />]);

  return (
    <Grid container spacing={1}>
      <Grid item>{getAddressIcon(address.type)}</Grid>
      <Grid item>
        <Typography>{addrString}</Typography>
      </Grid>
    </Grid>
  );
}

export function OSCALMetadataPartyEmail(props) {
  return (
    <Typography>
      <Link href={`mailto:${props.email}`}>{props.email}</Link>
    </Typography>
  );
}

export function OSCALMetadataPartyTelephone(props) {
  const { telephone } = props;
  return (
    <Typography>
      {getPhoneIcon(telephone.type)}
      <Link href={`tel:${telephone.number}`}>{telephone.number}</Link>
    </Typography>
  );
}

function OSCALMetadataPartyContactTypeHeader(props) {
  return (
    <OSCALMetadataPartiesInfoHeader variant="h6" component="h3">
      {props.icon}
      {props.title}
    </OSCALMetadataPartiesInfoHeader>
  );
}

export function OSCALMetadataPartyDialog(props) {
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const PartyInfoTypes = {
    address: "address",
    telephone: "telephone",
    email: "email",
  };

  const TYPE_MAPPING = (infoProps) => ({
    address: <OSCALMetadataPartyAddress address={infoProps} />,
    telephone: <OSCALMetadataPartyTelephone telephone={infoProps} />,
    email: <OSCALMetadataPartyEmail email={infoProps} />,
  });

  const getPartyInfoList = (
    list,
    partyInfoType,
    emptyMessage = "No information provided"
  ) => {
    if (!list?.length) {
      return <Typography> {emptyMessage} </Typography>;
    }

    return list.map((item) => (
      <ListItem
        key={partyInfoType === "email" ? item : `${item?.type}--${item?.name}`}
      >
        {TYPE_MAPPING(item)[partyInfoType]}
      </ListItem>
    ));
  };

  return (
    <CardActions>
      <Button size="small" variant="outlined" onClick={handleOpen}>
        <ContactPageIcon />
        Contact
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        scroll="paper"
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
        maxWidth="md"
        fullWidth
      >
        <DialogTitle id="scroll-dialog-title">{props.party.name}</DialogTitle>
        <DialogContent>{props.partyRolesText}</DialogContent>
        <DialogContent>
          <Grid container spacing={1}>
            <Grid item xs={4}>
              <OSCALMetadataPartyContactTypeHeader
                icon={<MapIcon fontSize="small" />}
                title="Address"
              />
              <List>
                {getPartyInfoList(
                  props.party.addresses,
                  PartyInfoTypes.address,
                  "No address information provided"
                )}
              </List>
            </Grid>
            <Grid item xs={4}>
              <OSCALMetadataPartyContactTypeHeader
                icon={<PhoneIcon fontSize="small" />}
                title="Phone"
              />
              <List>
                {getPartyInfoList(
                  props.party["telephone-numbers"],
                  PartyInfoTypes.telephone,
                  "No telephone information provided"
                )}
              </List>
            </Grid>
            <Grid item xs={4}>
              <OSCALMetadataPartyContactTypeHeader
                icon={<EmailIcon fontSize="small" />}
                title="Email"
              />
              <List>
                {getPartyInfoList(
                  props.party["email-addresses"],
                  PartyInfoTypes.email,
                  "No email information provided"
                )}
              </List>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </CardActions>
  );
}

export function OSCALMetadataParty(props) {
  return (
    <Card>
      <CardContent>
        <Grid container spacing={2}>
          <Grid item>
            <Avatar>
              {props.party.type === "organization" ? <GroupIcon /> : null}
            </Avatar>
          </Grid>
          <Grid item>
            <Typography>{props.party.name}</Typography>
            <Typography variant="subtitle2">{props.partyRolesText}</Typography>
            <OSCALMetadataPartyDialog
              party={props.party}
              partyRolesText={props.partyRolesText}
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
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
              <OSCALMetadataPartiesHeader>Parties</OSCALMetadataPartiesHeader>
              {props.metadata.parties?.map((party) => (
                <OSCALMetadataParty
                  key={party.uuid}
                  party={party}
                  partyRolesText={getPartyRolesText(party)}
                />
              ))}
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
