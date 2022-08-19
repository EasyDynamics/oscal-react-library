import React from "react";
import { styled } from "@mui/material/styles";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Link from "@mui/material/Link";
import ListSubheader from "@mui/material/ListSubheader";
import Card from "@mui/material/Card";
import MapIcon from "@mui/icons-material/Map";
import AlternateEmailIcon from "@mui/icons-material/AlternateEmail";
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
import OSCALEditableTextField from "./OSCALEditableTextField";

export const OSCALMetadataPartiesHeader = styled(ListSubheader)(
  ({ theme }) => `
  background-color: ${theme.palette.background.paper};
`
);

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

export function OSCALMetadataPartyAddress(props) {
  const { address } = props;
  return (
    <>
      {address.type === "home" ? <HomeIcon /> : <BusinessIcon />}
      <address>
        <Typography>
          {`${address["addr-lines"]?.join(", ")} ${address.city} ${
            address["postal-code"]
          } ${address.country}`}
        </Typography>
      </address>
    </>
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
  let icon = null;

  switch (telephone.type) {
    case "home":
      icon = <HomeIcon />;
      break;
    case "mobile":
      icon = <SmartphoneIcon />;
      break;
    case "office":
      icon = <BusinessIcon />;
      break;
    default:
      break;
  }

  return (
    <Typography>
      {icon}
      <Link href={`tel:${telephone.number}`}>{telephone.number}</Link>
    </Typography>
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

  return (
    <CardActions>
      <Button size="small" onClick={handleOpen}>
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
        <DialogContent>
          <Grid container spacing={1}>
            <Grid item xs={4}>
              <Typography>
                <MapIcon />
                Addresses
              </Typography>
              <List>
                {props.party.addresses?.map((address) => (
                  <ListItem key={`${address.type}`}>
                    <OSCALMetadataPartyAddress address={address} />
                  </ListItem>
                ))}
              </List>
            </Grid>

            <Grid item xs={4}>
              <Typography>
                <PhoneIcon />
                Phone
              </Typography>
              <List>
                {props.party["telephone-numbers"]?.map((telephone) => (
                  <ListItem key={`${telephone.type}-${telephone.number}`}>
                    <OSCALMetadataPartyTelephone telephone={telephone} />
                  </ListItem>
                ))}
              </List>
            </Grid>
            <Grid item xs={4}>
              <Typography>
                <AlternateEmailIcon />
                Email
              </Typography>
              <List>
                {props.party["email-addresses"]?.map((email) => (
                  <ListItem key={email}>
                    <OSCALMetadataPartyEmail email={email} />
                  </ListItem>
                ))}
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
            <Typography>
              {props.party.name}
              {props.partyRolesText}
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
      <OSCALMetadataPartyDialog party={props.party} />
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
