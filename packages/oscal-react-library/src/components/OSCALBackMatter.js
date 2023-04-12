import React from "react";
import { styled } from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Grid from "@mui/material/Grid";
import { Typography } from "@mui/material";
import FormatQuoteIcon from "@mui/icons-material/FormatQuote";
import DescriptionIcon from "@mui/icons-material/Description";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import StyledTooltip from "./OSCALStyledTooltip";
import { getAbsoluteUrl, guessExtensionFromHref } from "./oscal-utils/OSCALLinkUtils";
import { OSCALSection, OSCALSectionHeader } from "../styles/CommonPageStyles";
import { OSCALMarkupLine, OSCALMarkupMultiLine } from "./OSCALMarkupProse";
import OSCALAnchorLinkHeader from "./OSCALAnchorLinkHeader";
import OSCALEditableTextField from "./OSCALEditableTextField";

export const OSCALBackMatterCard = styled(Card)(
  ({ theme }) => `
    margin-top: ${theme.spacing(1)};
    display: flex;
    flex-direction: column;
`
);

function TitleDisplay(props) {
  const { children, uuid } = props;
  return (
    <OSCALAnchorLinkHeader value={uuid}>
      <Typography variant="subtitle1">{children}</Typography>
    </OSCALAnchorLinkHeader>
  );
}

function CitationDisplay(props) {
  if (!props.resource?.citation?.text) {
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

export default function OSCALBackMatter(props) {
  if (!props.backMatter) {
    return null;
  }

  const getMediaType = (rlink) =>
    rlink["media-type"] || guessExtensionFromHref(getAbsoluteUrl(rlink.href, props.parentUrl));

  const backMatterDisplay = (resource) => (
    <Grid item xs={3} key={resource.uuid}>
      <OSCALBackMatterCard>
        <CardContent>
          <Grid container spacing={0}>
            <Grid item xs={11}>
              <TitleDisplay uuid={resource.uuid}>
                <OSCALEditableTextField
                  fieldName="title"
                  canEdit={props.isEditable}
                  editedField={
                    props.isEditable
                      ? [Object.keys(props.partialRestData)[0], "back-matter", "resources"]
                      : null
                  }
                  editedValue={props.backMatter.resources}
                  editedValueId={resource.uuid}
                  onFieldSave={props.onFieldSave}
                  partialRestData={
                    props.isEditable
                      ? {
                          [Object.keys(props.partialRestData)[0]]: {
                            uuid: props.partialRestData[Object.keys(props.partialRestData)[0]].uuid,
                            "back-matter": {
                              resources: props.backMatter.resources,
                            },
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
            editedField={
              props.isEditable
                ? [Object.keys(props.partialRestData)[0], "back-matter", "resources"]
                : null
            }
            editedValue={props.backMatter.resources}
            editedValueId={resource.uuid}
            onFieldSave={props.onFieldSave}
            partialRestData={
              props.isEditable
                ? {
                    [Object.keys(props.partialRestData)[0]]: {
                      uuid: props.partialRestData[Object.keys(props.partialRestData)[0]].uuid,
                      "back-matter": {
                        resources: props.backMatter.resources,
                      },
                    },
                  }
                : null
            }
            value={resource.description}
          />
          <Typography>
            {resource.rlinks &&
              resource.rlinks.map((rlink) => (
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
            {props.backMatter.resources.map((resource) => backMatterDisplay(resource))}
          </Grid>
        </CardContent>
      </Card>
    </OSCALSection>
  );
}
