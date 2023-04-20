import { PublicationMetadata, Role } from "@easydynamics/oscal-types";
import WorkIcon from "@mui/icons-material/Work";
import { CardContent } from "@mui/material";
import Card from "@mui/material/Card";
import Chip from "@mui/material/Chip";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import React from "react";
import { OSCALSection } from "../styles/CommonPageStyles";
import { propWithName } from "./oscal-utils/OSCALPropUtils";
import OSCALEditableTextField, { EditableFieldProps } from "./OSCALEditableTextField";
import { OSCALMetadataLocations } from "./OSCALLocations";
import { OSCALMarkupMultiLine } from "./OSCALMarkupProse";
import {
  formatDate,
  MetadataAvatar,
  OSCALMetadataCard,
  OSCALMetadataFieldArea,
  OSCALMetadataLabel,
} from "./OSCALMetadataCommon";
import { OSCALMetadataParties } from "./OSCALParty";
import { OSCALRevisionsButton } from "./OSCALRevision";

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
