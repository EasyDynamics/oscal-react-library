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
import React, { ReactNode, useEffect } from "react";
import { OSCALSection } from "../styles/CommonPageStyles";
import { propWithName } from "./oscal-utils/OSCALPropUtils";
import OSCALEditableTextField, { EditableFieldProps } from "./OSCALEditableTextField";
import OSCALAnchorLinkHeader from "./OSCALAnchorLinkHeader";
import { OSCALMarkupLine, OSCALMarkupMultiLine } from "./OSCALMarkupProse";
import {
  Address,
  PublicationMetadata,
  Location,
  PartyOrganizationOrPerson,
  Role,
  PartyType,
  TelephoneNumber,
} from "@easydynamics/oscal-types";
import { OSCALRevisionsButton } from "./OSCALRevision";
import { OSCALMetadataLabel } from "./OSCALMetadataCommon";
import { NotSpecifiedTypography } from "./StyledTypography";
import { OSCALProperties } from "./OSCALProperties";

const OSCALMetadataSectionInfoHeader = styled(Typography)`
  display: flex;
  align-items: center;
` as typeof Typography;

const OSCALMetadataTitle = styled(Grid)`
  height: 56px;
` as typeof Grid;

const OSCALMetadataSection = styled(Grid)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  position: "relative",
  overflow: "auto",
  maxHeight: "26em",
  paddingBottom: "1em",
  paddingRight: ".5em",
  paddingTop: ".5em",
  display: "flex",
})) as typeof Grid;

// Returns a string with a locality-sensitive representation of this date
function formatDate(isoDate: string | number | Date): string {
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

function getIconOfType(
  mapping: Record<string, ReactNode> | undefined,
  contactType: string | undefined
) {
  if (!mapping || !contactType) {
    return UNKNOWN_TYPE_ICON;
  }
  return mapping[contactType] ?? UNKNOWN_TYPE_ICON;
}

function getPhoneIcon(contactType: string | undefined) {
  return getIconOfType(TELEPHONE_ICON_MAPPING, contactType);
}

function getAddressIcon(contactType: string | undefined) {
  return getIconOfType(ADDRESS_ICON_MAPPING, contactType);
}

interface TextWithIconProps {
  /**
   * icon to display to the left of text
   */
  icon: ReactNode;
  /**
   * React component for text
   */
  children: ReactNode;
}

const TextWithIcon: React.FC<TextWithIconProps> = (props) => {
  const { icon, children } = props;

  return (
    <Stack direction="row" gap={1} alignItems="start">
      {icon}
      <Typography>{children}</Typography>
    </Stack>
  );
};

export interface OSCALMetadataAddressProps {
  address: Address;
}

export const OSCALMetadataAddress: React.FC<OSCALMetadataAddressProps> = (props) => {
  const tryFormatAddress = (address: Address) => {
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
    <TextWithIcon icon={getAddressIcon(address.type)}>{formatted}</TextWithIcon>
  ) : (
    <TextWithIcon icon={<ErrorOutlineIcon />}>
      <Typography variant="body2">Address cannot be formatted</Typography>
    </TextWithIcon>
  );
};

export interface OSCALMetadataEmailProps {
  email: string;
}

export const OSCALMetadataEmail: React.FC<OSCALMetadataEmailProps> = (props) => {
  return (
    <Typography>
      <Link href={`mailto:${props.email}`}>{props.email}</Link>
    </Typography>
  );
};

export interface OSCALMetadataTelephoneProps {
  telephone: TelephoneNumber;
}

export const OSCALMetadataTelephone: React.FC<OSCALMetadataTelephoneProps> = (props) => {
  const { telephone } = props;

  return (
    <TextWithIcon icon={getPhoneIcon(telephone.type)}>
      <Link href={`tel:${telephone.number}`}>{telephone.number}</Link>
    </TextWithIcon>
  );
};

interface OSCALMetadataContactTypeHeaderProps {
  /**
   * Contact info list title
   */
  title: string;
  /**
   * Optional icon to display
   */
  icon?: ReactNode;
}

const OSCALMetadataContactTypeHeader: React.FC<OSCALMetadataContactTypeHeaderProps> = (props) => {
  return (
    <Stack direction="row" alignItems="center" gap={1}>
      {props.icon}
      <OSCALMetadataSectionInfoHeader variant="h6" component="h3">
        {props.title}
      </OSCALMetadataSectionInfoHeader>
    </Stack>
  );
};

interface MetadataAvatarProps {
  /**
   * String to create avatar color with
   */
  id: string;
  /**
   * Text to appear on avatar
   */
  text: string | undefined;
  /**
   * Icon to use if text is undefined
   */
  fallbackIcon: ReactNode;
}

const MetadataAvatar: React.FC<MetadataAvatarProps> = (props) => {
  const { id, text, fallbackIcon } = props;

  const avatarColor = (name: string) => {
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

  const avatarValue = (name: string | undefined) =>
    name
      ?.split(" ")
      .map((str) => str.substring(0, 1))
      .join("")
      .substring(0, 2)
      .toUpperCase();

  return <Avatar sx={{ bgcolor: avatarColor(id) }}>{avatarValue(text) ?? fallbackIcon}</Avatar>;
};

enum MetadataInfoType {
  address = "address",
  telephone = "telephone",
  email = "email",
}

/**
 * Maps a contact list item to the correct component.
 *
 * @param infoProps Props to pass to the component
 * @param type Contact info type to use for map
 */
const mapContactType = (infoProps: Address | TelephoneNumber | string, type: MetadataInfoType) => {
  switch (type) {
    case MetadataInfoType.email:
      return <OSCALMetadataEmail email={infoProps as string} />;
    case MetadataInfoType.address:
      return <OSCALMetadataAddress address={infoProps as Address} />;
    case MetadataInfoType.telephone:
      return <OSCALMetadataTelephone telephone={infoProps as TelephoneNumber} />;
  }
};

interface MetadataInfoListProps {
  /**
   * List of metadata contact info
   */
  list: Address[] | string[] | TelephoneNumber[] | undefined;
  /**
   * Type of metadata contact info
   */
  infoType: MetadataInfoType;
  /**
   * Message to display if list is empty
   */
  emptyMessage: string;
}

const MetadataInfoList: React.FC<MetadataInfoListProps> = (props) => {
  const { list, infoType, emptyMessage } = props;

  if (!list?.length) {
    return <Typography> {emptyMessage} </Typography>;
  }

  return (
    <>
      {list.map((item, index) => {
        return <ListItem key={index}>{mapContactType(item, infoType)}</ListItem>;
      })}
    </>
  );
};

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
      subheader={props.partyRolesText?.map((role: Role) => role.title).join(", ")}
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

interface OSCALMetadataRoleProps {
  role: Role;
}

export const OSCALMetadataRole: React.FC<OSCALMetadataRoleProps> = (props) => {
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
};

interface OSCALMetadataCardProps {
  /**
   * Title of the card
   */
  title: string | undefined;
  /**
   * Optional subheader for the card
   */
  subheader?: string;
  /**
   * Avatar icon for the card
   */
  avatar: ReactNode;
  /**
   * True if modal button should be disabled
   */
  disabled?: boolean;
  /**
   * Dialog component's children
   */
  children: ReactNode;
}

const OSCALMetadataCard: React.FC<OSCALMetadataCardProps> = (props) => {
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
    <NotSpecifiedTypography>Not Specified</NotSpecifiedTypography>
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
};

interface OSCALMetadataBasicDataItemProps {
  /**
   * Title to display
   */
  title: string;
  /**
   * Child data
   */
  data: string;
}

const OSCALMetadataBasicDataItem: React.FC<OSCALMetadataBasicDataItemProps> = (props) => {
  const { title, data } = props;

  return (
    <Stack direction="row" spacing={1}>
      <OSCALMetadataLabel variant="body2">{title}</OSCALMetadataLabel>
      <Typography variant="body2">{data}</Typography>
    </Stack>
  );
};

interface OSCALMetadataBasicDataProps extends EditableFieldProps {
  metadata: PublicationMetadata;
}

const OSCALMetadataBasicData: React.FC<OSCALMetadataBasicDataProps> = (props) => {
  const { metadata, isEditable, partialRestData, onFieldSave } = props;

  return (
    <Stack direction="row" alignItems="center" spacing={4}>
      <Stack direction="row" spacing={1}>
        <OSCALMetadataLabel variant="body2">Document Version:</OSCALMetadataLabel>
        <OSCALEditableTextField
          fieldName="Version"
          isEditable={isEditable}
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
        data={metadata.published ? formatDate(metadata.published) : "Not published"}
      />
      <OSCALRevisionsButton revisions={metadata.revisions} />
    </Stack>
  );
};

interface OSCALMetadataRolesProps {
  roles: Role[] | undefined;
  urlFragment?: string;
}

const OSCALMetadataRoles: React.FC<OSCALMetadataRolesProps> = (props) => {
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
};

interface OSCALMetadataPartiesProps {
  metadata: PublicationMetadata;
  parties: PartyOrganizationOrPerson[] | undefined;
  urlFragment?: string;
}

const OSCALMetadataParties: React.FC<OSCALMetadataPartiesProps> = (props) => {
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

interface OSCALMetadataLocationsProps {
  locations: Location[] | undefined;
  urlFragment?: string | undefined;
}

const OSCALMetadataLocations: React.FC<OSCALMetadataLocationsProps> = (props) => {
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

interface OSCALMetadataFieldAreaProps {
  /**
   * Title of the accordion.
   */
  title: string;
  /**
   * Inner component displayed on opening of accordion.
   */
  children: ReactNode;
  /**
   * Summary element near title.
   */
  summary?: ReactNode;
  urlFragment?: string;
}

const OSCALMetadataFieldArea: React.FC<OSCALMetadataFieldAreaProps> = (props) => {
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
};

export interface OSCALMetadataKeywordProps {
  keyword: string;
}

export const OSCALMetadataKeyword: React.FC<OSCALMetadataKeywordProps> = (props) => {
  const { keyword } = props;
  const text = keyword.trim();

  return <>{text && <Chip label={text} size="small" role="chip" />}</>;
};

export interface OSCALMetadataKeywordsProps {
  /**
   * Comma seperated list of keywords.
   */
  keywords: string | undefined;
  urlFragment?: string;
}

export const OSCALMetadataKeywords: React.FC<OSCALMetadataKeywordsProps> = (props) => {
  const { keywords, urlFragment } = props;

  const chips = !keywords
    ? undefined
    : keywords
        ?.split(",")
        .map((keyword) => keyword.trim())
        .map((keyword) => <OSCALMetadataKeyword key={keyword} keyword={keyword} />);

  return (
    <OSCALMetadataFieldArea title="Keywords" urlFragment={urlFragment}>
      {chips}
    </OSCALMetadataFieldArea>
  );
};

interface OSCALMetadataProps extends EditableFieldProps {
  /**
   * The metadata of an OSCAL document.
   */
  metadata: PublicationMetadata;
  urlFragment?: string;
}

export const OSCALMetadata: React.FC<OSCALMetadataProps> = (props) => {
  if (!props.metadata) {
    return null;
  }

  return (
    <OSCALSection>
      <Stack>
        <OSCALMetadataTitle container direction="row" alignItems="center">
          <OSCALEditableTextField
            fieldName="Title"
            isEditable={props.isEditable}
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
            <OSCALMetadataSection>
              <OSCALProperties properties={props.metadata.props} title={props.metadata.title} />
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
};

export default OSCALMetadata;
