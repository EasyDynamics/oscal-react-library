import React from "react";
import { styled } from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Grid from "@mui/material/Grid";
import { Typography } from "@mui/material";
import FormatQuoteIcon from "@mui/icons-material/FormatQuote";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import StyledTooltip from "./OSCALStyledTooltip";
import { getAbsoluteUrl, guessExtensionFromHref } from "./oscal-utils/OSCALLinkUtils";
import { OSCALSection, OSCALSectionHeader } from "../styles/CommonPageStyles";
import { OSCALMarkupLine } from "./OSCALMarkupProse";
import OSCALAnchorLinkHeader from "./OSCALAnchorLinkHeader";
import OSCALEditableTextField from "./OSCALEditableTextField";
import { Resource, ResourceLink, BackMatter } from "@easydynamics/oscal-types";
import { ReactElement } from "react";

export const OSCALBackMatterCard = styled(Card)(
  ({ theme }) => `
    margin-top: ${theme.spacing(1)};
    display: flex;
    flex-direction: column;
`
);

interface TitleDisplayProps {
  uuid: string;
  children: any | any[];
}

function TitleDisplay(props: TitleDisplayProps): ReactElement {
  const { children, uuid } = props;
  return (
    <OSCALAnchorLinkHeader value={uuid}>
      <Typography variant="subtitle1">{children}</Typography>
    </OSCALAnchorLinkHeader>
  );
}

interface CitationDisplayProps {
  readonly resource: Resource;
}

function CitationDisplay(props: CitationDisplayProps): ReactElement {
  if (!props.resource.citation?.text) {
    return (
      <FormatQuoteIcon
        color="disabled"
        fontSize="small"
        titleAccess={`${props.resource.title}-citation`}
      />
    );
  }
  return (
    <StyledTooltip title={<OSCALMarkupLine>{props.resource.citation.text}</OSCALMarkupLine>}>
      <FormatQuoteIcon
        color="primary"
        fontSize="small"
        titleAccess={`${props.resource.title}-citation`}
      />
    </StyledTooltip>
  );
}

function getObjectRootKey(object: unknown): string {
  if (!object) {
    return "";
  }

  const keys = Object.keys(object);
  if (keys.length !== 1) {
    throw new Error(
      `The given object does not have exactly one root key ${JSON.stringify(object)}`
    );
  }
  return keys[0];
}

interface EditableFieldProps {
  isEditable?: boolean;
  onFieldSave?: (...args: any[]) => void;
  partialRestData?: Record<string, any>;
}

interface OSCALBackMatterProps extends EditableFieldProps {
  backMatter: BackMatter | undefined;
  parentUrl: string;
}

interface BackMatterResourceProps extends OSCALBackMatterProps {
  resource: Resource;
}

function BackMatterResource(props: BackMatterResourceProps) {
  const { resource } = props;

  const getMediaType = (rlink: ResourceLink) =>
    rlink["media-type"] ||
    guessExtensionFromHref(getAbsoluteUrl(rlink.href, props.parentUrl) ?? "");

  const objectKey = getObjectRootKey(props.partialRestData);

  return (
    <Grid item xs={3} key={resource.uuid}>
      <OSCALBackMatterCard>
        <CardContent>
          <Grid container spacing={0}>
            <Grid item xs={11}>
              <TitleDisplay uuid={resource.uuid}>
                <OSCALEditableTextField
                  fieldName="title"
                  canEdit={props.isEditable}
                  editedField={props.isEditable ? [objectKey, "back-matter", "resources"] : null}
                  editedValue={props.backMatter?.resources}
                  editedValueId={resource.uuid}
                  onFieldSave={props.onFieldSave}
                  partialRestData={
                    props.isEditable
                      ? {
                          [objectKey]: {
                            uuid: props.partialRestData?.[objectKey].uuid,
                            "back-matter": props.backMatter,
                          },
                        }
                      : null
                  }
                  value={resource.title}
                />
              </TitleDisplay>
            </Grid>
            <Grid item xs={1}>
              <Grid container spacing={0} justifyContent="flex-end">
                <CitationDisplay resource={resource} />
              </Grid>
            </Grid>
          </Grid>
          <OSCALEditableTextField
            fieldName="description"
            canEdit={props.isEditable}
            editedField={props.isEditable ? [objectKey, "back-matter", "resources"] : null}
            editedValue={props.backMatter?.resources}
            editedValueId={resource.uuid}
            onFieldSave={props.onFieldSave}
            partialRestData={
              props.isEditable
                ? {
                    [objectKey]: {
                      uuid: props.partialRestData?.[objectKey].uuid,
                      "back-matter": props.backMatter,
                    },
                  }
                : null
            }
            value={resource.description}
          />
          <Typography>
            {resource.rlinks?.map((rlink) => (
              <Chip
                icon={<OpenInNewIcon />}
                key={rlink.href}
                label={getMediaType(rlink)}
                component="a"
                role="button"
                href={getAbsoluteUrl(rlink.href, props.parentUrl)}
                target="_blank"
                variant="outlined"
                clickable
              />
            ))}
          </Typography>
        </CardContent>
      </OSCALBackMatterCard>
    </Grid>
  );
}

export default function OSCALBackMatter(props: OSCALBackMatterProps): ReactElement {
  return (
    <OSCALSection>
      <Card>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <OSCALAnchorLinkHeader>
                <OSCALSectionHeader>Back Matter</OSCALSectionHeader>
              </OSCALAnchorLinkHeader>
            </Grid>
            <Grid item xs={7}>
              <Typography variant="body1">Resources</Typography>
            </Grid>
          </Grid>
          <Grid container spacing={2} padding={2}>
            {props.backMatter?.resources?.map((resource) => (
              <BackMatterResource
                key={resource.uuid}
                backMatter={props.backMatter}
                isEditable={props.isEditable}
                onFieldSave={props.onFieldSave}
                partialRestData={props.partialRestData}
                resource={resource}
                parentUrl={props.parentUrl}
              />
            ))}
          </Grid>
        </CardContent>
      </Card>
    </OSCALSection>
  );
}
