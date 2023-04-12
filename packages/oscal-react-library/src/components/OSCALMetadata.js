import BusinessIcon from "@mui/icons-material/Business";
import EmailIcon from "@mui/icons-material/Email";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import GroupIcon from "@mui/icons-material/Group";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import HomeIcon from "@mui/icons-material/Home";
import InfoIcon from "@mui/icons-material/Info";
import MapIcon from "@mui/icons-material/Map";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import PersonIcon from "@mui/icons-material/Person";
import PhoneIcon from "@mui/icons-material/Phone";
import PlaceIcon from "@mui/icons-material/Place";
import SmartphoneIcon from "@mui/icons-material/Smartphone";
import WorkIcon from "@mui/icons-material/Work";
import { CardContent } from "@mui/material";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardHeader from "@mui/material/CardHeader";
import Chip from "@mui/material/Chip";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import React, { useEffect } from "react";
import { OSCALSection } from "../styles/CommonPageStyles";
import { propWithName } from "./oscal-utils/OSCALPropUtils";
import OSCALEditableTextField from "./OSCALEditableTextField";
import OSCALAnchorLinkHeader from "./OSCALAnchorLinkHeader";
import { OSCALMarkupLine, OSCALMarkupMultiLine } from "./OSCALMarkupProse";

const OSCALMetadataSectionInfoHeader = styled(Typography)`
  display: flex;
  align-items: center;
`;

const OSCALMetadataLabel = styled(Typography)(({ theme }) => ({
  textAlign: "right",
  color: theme.palette.text.secondary,
}));

const OSCALMetadataCardTitleFallbackText = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
}));

const OSCALMetadataTitle = styled(Grid)`
  height: 56px;
`;

const OSCALMetadataSection = styled(Grid)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  position: "relative",
  overflow: "auto",
  maxHeight: "26em",
  paddingBottom: "1em",
  paddingRight: ".5em",
  paddingTop: ".5em",
  display: "flex",
}));

// Returns a string with a locality-sensitive representation of this date
function formatDate(isoDate) {
  if (!isoDate) {
    return isoDate;
  }
  return new Date(isoDate).toLocaleString();
}

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
  const { icon, children } = props;

  return (
    <Stack direction="row" gap={1} alignItems="start">
      {icon}
      <Typography>{children}</Typography>
    </Stack>
  );
}

export function OSCALMetadataAddress(props) {
  const tryFormatAddress = (address) => {
    const lines = address["addr-lines"] ?? [];
    const cityAndState = [address.city, address.state].filter((it) => it).join(", ");
    const line = [cityAndState, address["postal-code"]].filter((it) => it).join(" ");
    const allLines = [...lines, line, address.country].filter((it) => it);
    return allLines;
  };
  const { address } = props;

  const addr = tryFormatAddress(address);
  const formatted = addr.flatMap((it, index) => [it, <br key={index} />]);

  return addr.length ? (
    <TextWithIcon icon={getAddressIcon(address.type)} key={address}>
      {formatted}
    </TextWithIcon>
  ) : (
    <TextWithIcon icon={<ErrorOutlineIcon />} key={address}>
      <Typography variant="body2">Address cannot be formatted</Typography>
    </TextWithIcon>
  );
}

export function OSCALMetadataEmail(props) {
  return (
    <Typography>
      <Link href={`mailto:${props.email}`}>{props.email}</Link>
    </Typography>
  );
}

export function OSCALMetadataTelephone(props) {
  const { telephone } = props;

  return (
    <TextWithIcon icon={getPhoneIcon(telephone.type)}>
      <Link href={`tel:${telephone.number}`}>{telephone.number}</Link>
    </TextWithIcon>
  );
}

function OSCALMetadataContactTypeHeader(props) {
  return (
    <Stack direction="row" alignItems="center" gap={1}>
      {props.icon}
      <OSCALMetadataSectionInfoHeader variant="h6" component="h3">
        {props.title}
      </OSCALMetadataSectionInfoHeader>
    </Stack>
  );
}

function MetadataAvatar(props) {
  const { id, text, fallbackIcon } = props;

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
      .substring(0, 2)
      .toUpperCase();

  return <Avatar sx={{ bgcolor: avatarColor(id) }}>{avatarValue(text) ?? fallbackIcon}</Avatar>;
}

const MetadataInfoTypes = {
  address: "address",
  telephone: "telephone",
  email: "email",
};

const TYPE_MAPPING = (infoProps) => ({
  address: <OSCALMetadataAddress address={infoProps} />,
  telephone: <OSCALMetadataTelephone telephone={infoProps} />,
  email: <OSCALMetadataEmail email={infoProps} />,
});

const getMetadataInfoList = (list, infoType, emptyMessage = "No information provided") => {
  if (!list?.length) {
    return <Typography> {emptyMessage} </Typography>;
  }

  return list.map((item) => (
    <ListItem key={infoType === "email" ? item : `${item?.type}--${item?.name}`}>
      {TYPE_MAPPING(item)[infoType]}
    </ListItem>
  ));
};

export function OSCALMetadataParty(props) {
  const fallbackIcon = props.party?.type === "organziation" ? <GroupIcon /> : <PersonIcon />;
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
              {getMetadataInfoList(
                props.party.addresses,
                MetadataInfoTypes.address,
                "No address information provided"
              )}
            </List>
          </Grid>
          <Grid item xs={4}>
            <OSCALMetadataContactTypeHeader icon={<PhoneIcon fontSize="small" />} title="Phone" />
            <List>
              {getMetadataInfoList(
                props.party["telephone-numbers"],
                MetadataInfoTypes.telephone,
                "No telephone information provided"
              )}
            </List>
          </Grid>
          <Grid item xs={4}>
            <OSCALMetadataContactTypeHeader icon={<EmailIcon fontSize="small" />} title="Email" />
            <List>
              {getMetadataInfoList(
                props.party["email-addresses"],
                MetadataInfoTypes.email,
                "No email information provided"
              )}
            </List>
          </Grid>
        </Grid>
      </DialogContent>
    </OSCALMetadataCard>
  );
}

export function OSCALMetadataRole(props) {
  const { role } = props;

  const avatar = <MetadataAvatar id={role.id} text={role.title} fallbackIcon={<WorkIcon />} />;

  return (
    <OSCALMetadataCard
      title={role.title}
      subheader={role["short-name"]}
      avatar={avatar}
      disabled={!role.description}
    >
      <DialogTitle>{role.title}</DialogTitle>
      <DialogContent dividers>
        <OSCALMarkupMultiLine>{role?.description}</OSCALMarkupMultiLine>
      </DialogContent>
    </OSCALMetadataCard>
  );
}

function OSCALMetadataCard(props) {
  const { title, subheader, avatar, disabled, children } = props;

  const [open, setOpen] = React.useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const cardTitle = title ? (
    <OSCALMarkupLine>{title}</OSCALMarkupLine>
  ) : (
    <OSCALMetadataCardTitleFallbackText>Not Specified</OSCALMetadataCardTitleFallbackText>
  );

  return (
    <>
      <CardHeader title={cardTitle} subheader={subheader} avatar={avatar} />
      <CardActions>
        <Button
          size="small"
          variant="outlined"
          onClick={handleOpen}
          aria-label={`${title ?? subheader} details button`}
          disabled={disabled}
          startIcon={<InfoIcon />}
        >
          Details
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
          {children}
        </Dialog>
      </CardActions>
    </>
  );
}

function OSCALMetadataBasicDataItem(props) {
  const { title, data } = props;

  return (
    <Stack direction="row" spacing={1}>
      <OSCALMetadataLabel variant="body2">{title}</OSCALMetadataLabel>
      <Typography variant="body2">{data}</Typography>
    </Stack>
  );
}

function OSCALMetadataBasicData(props) {
  const { metadata, isEditable, partialRestData, onFieldSave } = props;

  return (
    <Stack direction="row" spacing={4}>
      <Stack direction="row" spacing={1}>
        <OSCALMetadataLabel variant="body2">Document Version:</OSCALMetadataLabel>
        <OSCALEditableTextField
          fieldName="Version"
          canEdit={isEditable}
          editedField={isEditable ? [Object.keys(partialRestData)[0], "metadata", "version"] : null}
          onFieldSave={onFieldSave}
          partialRestData={
            isEditable
              ? {
                  [Object.keys(partialRestData)[0]]: {
                    uuid: partialRestData[Object.keys(partialRestData)[0]].uuid,
                    metadata: {
                      version: metadata.version,
                    },
                  },
                }
              : null
          }
          size={4}
          textFieldSize="small"
          typographyVariant="body2"
          value={metadata.version}
        />
      </Stack>
      <OSCALMetadataBasicDataItem title="OSCAL Version:" data={metadata["oscal-version"]} />
      <OSCALMetadataBasicDataItem
        title="Last Modified:"
        data={formatDate(metadata["last-modified"])}
      />
      <OSCALMetadataBasicDataItem
        title="Published Date:"
        data={formatDate(metadata.published) ?? "Not published"}
      />
    </Stack>
  );
}

function OSCALMetadataRoles(props) {
  const { roles, urlFragment } = props;
  const cards = roles?.map((role) => (
    <Grid item xs={12} md={4} key={role.id} component={Card}>
      <OSCALMetadataRole role={role} />
    </Grid>
  ));

  return (
    <OSCALMetadataFieldArea title="Roles" urlFragment={urlFragment}>
      {cards}
    </OSCALMetadataFieldArea>
  );
}

function OSCALMetadataParties(props) {
  const { parties, urlFragment } = props;

  const getRoleLabel = (roleId) => props.metadata.roles.find((role) => role.id === roleId);

  const getPartyRolesText = (party) =>
    props.metadata["responsible-parties"]
      ?.filter((responsibleParty) => responsibleParty["party-uuids"]?.includes(party.uuid))
      .map((item) => item["role-id"])
      .map(getRoleLabel)
      .filter((item) => item);

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
}

function OSCALMetadataLocations(props) {
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
}

function OSCALMetadataLocationUrls(props) {
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
}

export function OSCALMetadataLocationContent(props) {
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
            {getMetadataInfoList(
              location["telephone-numbers"],
              MetadataInfoTypes.telephone,
              "No telephone information provided"
            )}
          </List>
        </Grid>
        <Grid item xs={4}>
          <OSCALMetadataContactTypeHeader icon={<EmailIcon fontSize="small" />} title="Email" />
          <List>
            {getMetadataInfoList(
              location["email-addresses"],
              MetadataInfoTypes.email,
              "No email information provided"
            )}
          </List>
        </Grid>
      </Grid>
      <OSCALMetadataLocationUrls urls={location?.urls} />
    </Stack>
  );
}

export function OSCALMetadataLocation(props) {
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
}

function OSCALMetadataFieldArea(props) {
  const { title, children, summary, urlFragment } = props;

  const [isExpanded, setIsExpanded] = React.useState(false);

  const handleExpand = () => {
    setIsExpanded((isCurrentlyExpanded) => !isCurrentlyExpanded);
  };

  useEffect(() => {
    // Grab fragment identifier following hash character if fragment exists in location
    const controlFragment = urlFragment || null;
    // Expand metadata accordion section if control fragment matches title
    if (controlFragment === title.toLowerCase()) {
      setIsExpanded(true);
    }
  }, [urlFragment, title]);

  return (
    <Accordion expanded={isExpanded} onChange={handleExpand}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <OSCALAnchorLinkHeader>
          <Typography>{title}</Typography>
        </OSCALAnchorLinkHeader>
        <Typography sx={{ color: "text.secondary" }}>{summary}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Grid container alignItems="stretch">
          {children}
        </Grid>
      </AccordionDetails>
    </Accordion>
  );
}

export function OSCALMetadataKeyword(props) {
  const { keyword } = props;
  const text = keyword.trim();

  return text && <Chip label={text} size="small" role="chip" />;
}

export function OSCALMetadataKeywords(props) {
  const { keywords, urlFragment } = props;

  const chips = (keywords ?? "")
    .split(",")
    .map((keyword) => keyword.trim())
    .map((keyword) => <OSCALMetadataKeyword key={keyword} keyword={keyword} />);

  return (
    <OSCALMetadataFieldArea title="Keywords" urlFragment={urlFragment}>
      {chips}
    </OSCALMetadataFieldArea>
  );
}

export default function OSCALMetadata(props) {
  if (!props.metadata) {
    return null;
  }

  return (
    <OSCALSection>
      <Stack>
        <OSCALMetadataTitle container direction="row" alignItems="center">
          <OSCALEditableTextField
            fieldName="Title"
            canEdit={props.isEditable}
            editedField={
              props.isEditable ? [Object.keys(props.partialRestData)[0], "metadata", "title"] : null
            }
            onFieldSave={props.onFieldSave}
            partialRestData={
              props.isEditable
                ? {
                    [Object.keys(props.partialRestData)[0]]: {
                      uuid: props.partialRestData[Object.keys(props.partialRestData)[0]].uuid,
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
      </Stack>
      <Card>
        <CardContent>
          <Stack>
            <OSCALMetadataSection>
              <OSCALMetadataBasicData
                metadata={props.metadata}
                isEditable={props.isEditable}
                partialRestData={props.partialRestData}
                onFieldSave={props.onFieldSave}
              />
            </OSCALMetadataSection>
            <OSCALMarkupMultiLine>{props.metadata.remarks}</OSCALMarkupMultiLine>
            <OSCALMetadataKeywords
              keywords={propWithName(props.metadata.props, "keywords")?.value}
              urlFragment={props.urlFragment}
            />
            <OSCALMetadataParties
              parties={props.metadata?.parties}
              metadata={props.metadata}
              urlFragment={props.urlFragment}
            />
            <OSCALMetadataRoles roles={props.metadata?.roles} urlFragment={props.urlFragment} />
            <OSCALMetadataLocations
              locations={props.metadata?.locations}
              urlFragment={props.urlFragment}
            />
          </Stack>
        </CardContent>
      </Card>
    </OSCALSection>
  );
}