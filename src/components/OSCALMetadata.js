import BusinessIcon from "@mui/icons-material/Business";
import ContactPageIcon from "@mui/icons-material/ContactPage";
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
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import React from "react";
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

const OSCALMetadataTitle = styled("div")`
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
    <Grid container spacing={1}>
      <Grid item>{icon}</Grid>
      <Grid item>
        <Typography>{text}</Typography>
      </Grid>
    </Grid>
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
    <OSCALMetadataPartiesInfoHeader variant="h6" component="h3">
      {props.icon}
      {props.title}
    </OSCALMetadataPartiesInfoHeader>
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
        {props.party.name}
        <Typography variant="body2">{props.partyRolesText}</Typography>
      </DialogTitle>
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
        <Button onClick={props.handleClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
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

  return (
    <Card>
      <CardHeader
        avatar={<Avatar>{props.party.name?.substring(0, 1)}</Avatar>}
        title={props.party.name}
        subheader={props.partyRolesText}
      />
      <CardActions>
        <Button size="small" variant="outlined" onClick={handleOpen}>
          <ContactPageIcon />
          Contact
        </Button>
        <OSCALMetadataPartyDialog
          open={open}
          handleOpen={handleOpen}
          handleClose={handleClose}
          party={props.party}
          partyRolesText={props.partyRolesText}
        />
      </CardActions>
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
      <Grid container spacing={1}>
        <Grid component={Paper} item xs={8}>
          <Grid item xs={12}>
            <OSCALMetadataPartiesHeader>Parties</OSCALMetadataPartiesHeader>
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
      </Grid>
    </Grid>
  );
}
