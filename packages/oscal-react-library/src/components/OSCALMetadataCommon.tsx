import { Address, TelephoneNumber } from "@easydynamics/oscal-types";
import BusinessIcon from "@mui/icons-material/Business";
import InfoIcon from "@mui/icons-material/Info";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import HomeIcon from "@mui/icons-material/Home";
import SmartphoneIcon from "@mui/icons-material/Smartphone";
import {
  Dialog,
  CardActions,
  Avatar,
  CardHeader,
  ListItem,
  Stack,
  Typography,
  Button,
} from "@mui/material";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import { styled } from "@mui/material/styles";
import { default as React, ReactNode, useEffect } from "react";
import OSCALAnchorLinkHeader from "./OSCALAnchorLinkHeader";
import { OSCALMarkupLine } from "./OSCALMarkupProse";

/**
 * A collection of common components shared amongst
 * OSCALMetadata child components.
 */

const OSCALMetadataCardTitleFallbackText = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
})) as typeof Typography;

export const OSCALMetadataLabel = styled(Typography)(({ theme }) => ({
  textAlign: "right",
  color: theme.palette.text.secondary,
})) as typeof Typography;

const OSCALMetadataSectionInfoHeader = styled(Typography)`
  display: flex;
  align-items: center;
` as typeof Typography;

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

export const MetadataAvatar: React.FC<MetadataAvatarProps> = (props) => {
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

export interface OSCALMetadataContactTypeHeaderProps {
  /**
   * Contact info list title
   */
  title: string;
  /**
   * Optional icon to display
   */
  icon?: ReactNode;
}

export const OSCALMetadataContactTypeHeader: React.FC<OSCALMetadataContactTypeHeaderProps> = (
  props
) => {
  return (
    <Stack direction="row" alignItems="center" gap={1}>
      {props.icon}
      <OSCALMetadataSectionInfoHeader variant="h6" component="h3">
        {props.title}
      </OSCALMetadataSectionInfoHeader>
    </Stack>
  );
};

export interface TextWithIconProps {
  /**
   * icon to display to the left of text
   */
  icon: ReactNode;
  /**
   * React component for text
   */
  children: ReactNode;
}

export const TextWithIcon: React.FC<TextWithIconProps> = (props) => {
  const { icon, children } = props;

  return (
    <Stack direction="row" gap={1} alignItems="start">
      {icon}
      <Typography>{children}</Typography>
    </Stack>
  );
};

// Returns a string with a locality-sensitive representation of this date
export function formatDate(isoDate: string | number | Date): string {
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

export enum MetadataInfoType {
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

export interface MetadataInfoListProps {
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

export const MetadataInfoList: React.FC<MetadataInfoListProps> = (props) => {
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

export interface OSCALMetadataFieldAreaProps {
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

export const OSCALMetadataFieldArea: React.FC<OSCALMetadataFieldAreaProps> = (props) => {
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

export interface OSCALMetadataCardProps {
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

export const OSCALMetadataCard: React.FC<OSCALMetadataCardProps> = (props) => {
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
};
