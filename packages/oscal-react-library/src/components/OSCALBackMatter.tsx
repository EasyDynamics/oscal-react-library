import React from "react";
import { styled } from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import { Typography } from "@mui/material";
import FormatQuoteIcon from "@mui/icons-material/FormatQuote";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { getAbsoluteUrl } from "./oscal-utils/OSCALLinkUtils";
import { OSCALSection, OSCALSectionHeader } from "../styles/CommonPageStyles";
import { OSCALMarkupMultiLine } from "./OSCALMarkupProse";
import { OSCALAnchorLinkHeader } from "./OSCALAnchorLinkHeader";
import OSCALEditableTextField from "./OSCALEditableTextField";
import { Resource, BackMatter, ResourceLink } from "@easydynamics/oscal-types";
import { ReactElement } from "react";
import { OSCALPropertiesDialog } from "./OSCALProperties";
import { propWithName } from "./oscal-utils/OSCALPropUtils";
import { NotSpecifiedTypography } from "./StyledTypography";
import { getFriendlyDisplayOfMediaType } from "./oscal-utils/OSCALMediaTypeUtils";
import { HoverablePopover } from "./HoverablePopover";

export const OSCALBackMatterCard = styled(Card)(
  ({ theme }) => `
    margin-top: ${theme.spacing(1)};
    display: flex;
    flex-direction: column;
`
);

// This maps the well-known back matter types to more human-readable names
// based on their descriptions.
const backMatterTypeLookup: Record<string, string> = {
  logo: "Logo",
  image: "Image",
  "screen-shot": "Screenshot",
  law: "Law",
  regulation: "Regulation",
  standard: "Standard",
  "external-guidance": "External Guidance",
  acronymns: "Acronyms",
  citation: "Citation",
  policy: "Policy",
  procedure: "Procedure",
  "system-guide": "System Guide",
  "users-guide": "User's/Administrator's Guide",
  "administrators-guide": "Administrator's Guide",
  "rules-of-behavior": "Rules of Behavior",
  plan: "Plan",
  artifact: "Artifact",
  evidence: "Evidence",
  "tool-output": "Tool output",
  "raw-data": "Raw Data",
  "interview-notes": "Interview Notes",
  questionnaire: "Questionnaire",
  report: "Report",
  agreement: "Agreement",
};

interface BackMatterTypeRepresentationOptions {
  /**
   * A mapping of possible values for the `type` field to descriptive names.
   *
   * @default - `backMatterTypeLookup`
   */
  mapToFriendlyName?: Record<string, string>;

  /**
   * For values not in the given mapping, whether to transform the name from
   * the typical kebab-case to title case.
   *
   * @default - no conversion is applied to unknown values
   */
  convertToTitleCase?: boolean;
}

/**
 * Transform the text for a `type` property on a back matter resource to a more
 * human-friendly representation.
 *
 * @param value the string to transform
 * @param opts options for the transformation
 * @returns the transformed string
 */
function backMatterTypeRepresentation(
  value: string,
  opts?: BackMatterTypeRepresentationOptions
): string {
  const knownName = (opts?.mapToFriendlyName ?? backMatterTypeLookup)[value];
  if (knownName) {
    return knownName;
  }

  if (opts?.convertToTitleCase) {
    return value
      .split("-")
      .map((str) => str.charAt(0).toUpperCase() + str.slice(1))
      .join(" ");
  }
  return value;
}

interface TitleDisplayProps {
  /**
   * uuid of the title prop
   */
  uuid: string;
  /**
   * Children to display in typography
   */
  children: React.ReactNode;
}

function TitleDisplay(props: TitleDisplayProps): ReactElement {
  const { children, uuid } = props;
  return (
    <OSCALAnchorLinkHeader name={uuid}>
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
    <HoverablePopover
      popoverContent={<OSCALMarkupMultiLine>{props.resource.citation.text}</OSCALMarkupMultiLine>}
    >
      <FormatQuoteIcon
        color="primary"
        fontSize="small"
        titleAccess={`${props.resource.title}-citation`}
      />
    </HoverablePopover>
  );
}

export interface OSCALBackMatterProps {
  /**
   * Backmatter object of an OSCALDocument
   */
  backMatter: BackMatter | undefined;
  /**
   * The url of the parent for resolution purposes
   */
  parentUrl: string;
}

interface BackMatterResourceLinkButtonsProps {
  rlinks: ResourceLink[];
  parentUrl: string;
}
const BackMatterResourceLinkButtons: React.FC<BackMatterResourceLinkButtonsProps> = ({
  rlinks,
  parentUrl,
}) => {
  return (
    <Box>
      <Typography variant="subtitle2">Resource Links</Typography>
      <ButtonGroup size="small" variant="outlined">
        {rlinks.map((rlink) => {
          const display = getFriendlyDisplayOfMediaType(rlink);
          return (
            <Button
              startIcon={<OpenInNewIcon />}
              key={rlink.href}
              href={getAbsoluteUrl(rlink.href, parentUrl)!}
              target="_blank"
              role="button"
              title={`Open as ${display}`}
              aria-label={`Open as ${display}`}
              sx={{ textTransform: "none" }}
            >
              {display}
            </Button>
          );
        })}
      </ButtonGroup>
    </Box>
  );
};

interface BackMatterResourceProps extends OSCALBackMatterProps {
  resource: Resource;
}

function BackMatterResource(props: BackMatterResourceProps) {
  const { resource, parentUrl } = props;

  const resourceType = propWithName(resource.props, "type")?.value;
  const typeDisplay = resourceType && backMatterTypeRepresentation(resourceType);

  return (
    <Grid item xs={3} key={resource.uuid}>
      <OSCALBackMatterCard sx={{ height: "100%" }}>
        <CardHeader
          title={
            <TitleDisplay uuid={resource.uuid}>
              <OSCALEditableTextField value={resource.title} />
            </TitleDisplay>
          }
          subheader={typeDisplay}
          action={
            <>
              <OSCALPropertiesDialog
                properties={resource?.props}
                title={
                  resource?.title ?? (
                    <NotSpecifiedTypography component="span">Resource</NotSpecifiedTypography>
                  )
                }
              />
              <CitationDisplay resource={resource} />
            </>
          }
        />
        <CardContent>
          <OSCALEditableTextField value={resource.description} />
          {resource.rlinks?.length ? (
            <BackMatterResourceLinkButtons rlinks={resource.rlinks} parentUrl={parentUrl} />
          ) : null}
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
          <Stack>
            <OSCALAnchorLinkHeader>
              <OSCALSectionHeader>Back Matter</OSCALSectionHeader>
            </OSCALAnchorLinkHeader>
            <Typography variant="body1">Resources</Typography>
          </Stack>
          <Grid container spacing={2} padding={2}>
            {props.backMatter?.resources?.map((resource) => (
              <BackMatterResource
                key={resource.uuid}
                backMatter={props.backMatter}
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
