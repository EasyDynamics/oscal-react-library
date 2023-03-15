import BusinessIcon from "@mui/icons-material/Business";
import EmailIcon from "@mui/icons-material/Email";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import HomeIcon from "@mui/icons-material/Home";
import MapIcon from "@mui/icons-material/Map";
import PhoneIcon from "@mui/icons-material/Phone";
import SmartphoneIcon from "@mui/icons-material/Smartphone";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardHeader from "@mui/material/CardHeader";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListSubheader from "@mui/material/ListSubheader";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import React from "react";
import InfoIcon from "@mui/icons-material/Info";
import OSCALEditableTextField from "./OSCALEditableTextField";
import OSCALAnchorLinkHeader from "./OSCALAnchorLinkHeader";
import { OSCALMarkupMultiLine } from "./OSCALMarkupProse";

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

const OSCALMetadataPartiesCardHolder = styled(Grid)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  position: "relative",
  overflow: "auto",
  maxHeight: "26em",
  paddingBottom: "1em",
  paddingRight: ".5em",
  paddingTop: ".5em",
  display: "flex",
  direction: "row",
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

function TextWithIcon(props) {
  const { icon, text } = props;
  return (
    <Stack direction="row" gap={1} alignItems="start">
      {icon}
      <Typography>{text}</Typography>
    </Stack>
  );
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

  return <TextWithIcon icon={getAddressIcon(address.type)} text={addrString} />;
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
    <TextWithIcon
      icon={getPhoneIcon(telephone.type)}
      text={<Link href={`tel:${telephone.number}`}>{telephone.number}</Link>}
    />
  );
}

function OSCALMetadataPartyContactTypeHeader(props) {
  return (
    <Stack direction="row" alignItems="center" gap={1}>
      {props.icon}
      <OSCALMetadataPartiesInfoHeader variant="h6" component="h3">
        {props.title}
      </OSCALMetadataPartiesInfoHeader>
    </Stack>
  );
}

export function OSCALMetadataPartyDialog(props) {
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
    <Dialog
      open={props.open}
      onClose={props.handleClose}
      scroll="paper"
      aria-labelledby="scroll-dialog-title"
      aria-describedby="scroll-dialog-description"
      maxWidth="md"
      fullWidth
    >
      <DialogTitle id="scroll-dialog-title">
        <Stack direction="row" alignItems="center" gap={1}>
          {props.avatar}
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
        <Button onClick={props.handleClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}

function MetadataAvatar(props) {
  const avatarColor = (name) => {
    // This implementation hashes the given string to create a
    // color string. This is based of the example algorithm given
    // in the MUI documentation and adapted to our use case.
    let hash = 0;
    for (let i = 0; i < name.length; i += 1) {
      // eslint-disable-next-line no-bitwise
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = "#";
    for (let i = 0; i < 3; i += 1) {
      // eslint-disable-next-line no-bitwise
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.slice(-2);
    }
    return color;
  };

  const avatarValue = (name) =>
    name
      ?.split(" ")
      .map((str) => str.substring(0, 1))
      .join("")
      .substring(0, 2);

  return (
    <Avatar sx={{ bgcolor: avatarColor(props.text) }}>
      {avatarValue(props.text)}
    </Avatar>
  );
}

export function OSCALMetadataParty(props) {
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const avatar = <MetadataAvatar text={props.party.name} />;

  return (
    <Card>
      <CardHeader
        avatar={avatar}
        title={props.party.name}
        subheader={props.partyRolesText?.map((role) => role.title).join(", ")}
      />
      <CardActions>
        <Button
          size="small"
          variant="outlined"
          onClick={handleOpen}
          aria-label={`${props.party.name} details button`}
        >
          <InfoIcon />
          Details
        </Button>
        <OSCALMetadataPartyDialog
          open={open}
          handleOpen={handleOpen}
          handleClose={handleClose}
          party={props.party}
          partyRolesText={props.partyRolesText}
          avatar={avatar}
        />
      </CardActions>
    </Card>
  );
}

export function OSCALMetadataRole(props) {
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Card>
      <CardHeader subheader={props.role.title} />
      <CardActions>
        <Button
          size="small"
          variant="outlined"
          onClick={handleOpen}
          aria-label={`${props.role.title} details button`}
          disabled={!props.role?.description}
        >
          <InfoIcon />
          Details
        </Button>
        <Dialog
          open={open}
          onClose={handleClose}
          scroll="paper"
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>{props.role.title}</DialogTitle>
          <DialogContent dividers>
            <OSCALMarkupMultiLine>
              {props.role?.description}
            </OSCALMarkupMultiLine>
          </DialogContent>
        </Dialog>
      </CardActions>
    </Card>
  );
}

export default function OSCALMetadata(props) {
  if (!props.metadata) {
    return null;
  }
  const getRoleLabel = (roleId) =>
    props.metadata.roles.find((role) => role.id === roleId);

  const getPartyRolesText = (party) =>
    props.metadata["responsible-parties"]
      ?.filter((responsibleParty) =>
        responsibleParty["party-uuids"]?.includes(party.uuid)
      )
      .map((item) => item["role-id"])
      .map(getRoleLabel)
      .filter((item) => item);

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
      <Grid container spacing={1}>
        <Grid component={Paper} item xs={8}>
          <Grid item xs={12}>
            <OSCALMetadataPartiesHeader>
              <OSCALAnchorLinkHeader>Parties</OSCALAnchorLinkHeader>
            </OSCALMetadataPartiesHeader>
          </Grid>
          <OSCALMetadataPartiesCardHolder container spacing={1} wrap="wrap">
            {props.metadata.parties?.map((party) => (
              <Grid item xs={12} md={4} key={party.uuid}>
                <OSCALMetadataParty
                  key={party.uuid}
                  party={party}
                  partyRolesText={getPartyRolesText(party)}
                />
              </Grid>
            ))}
          </OSCALMetadataPartiesCardHolder>
        </Grid>
        <Grid item md={3} xs={12}>
          <Grid item xs={12}>
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
        <Grid component={Paper} item xs={8}>
          <Grid item xs={12}>
            <OSCALMetadataPartiesHeader>Roles</OSCALMetadataPartiesHeader>
          </Grid>
          <OSCALMetadataPartiesCardHolder container spacing={1} wrap="wrap">
            {props.metadata.roles?.map((role) => (
              <Grid item xs={12} md={4} key={role.id}>
                <OSCALMetadataRole key={role.id} role={role} />
              </Grid>
            ))}
          </OSCALMetadataPartiesCardHolder>
        </Grid>
      </Grid>
    </Grid>
  );
}
