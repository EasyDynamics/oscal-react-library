import { Catalog, ControlGroup } from "@easydynamics/oscal-types";
import { Card, CardContent } from "@mui/material";
import React, { useEffect } from "react";
import { OSCALSection, OSCALSectionHeader } from "../styles/CommonPageStyles";
import { OSCALAnchorLinkHeader } from "./OSCALAnchorLinkHeader";
import OSCALBackMatter from "./OSCALBackMatter";
import { OSCALCatalogControlListItem } from "./OSCALCatalogGroup";
import OSCALCatalogGroups from "./OSCALCatalogGroups";
import { EditableFieldProps } from "./OSCALEditableTextField";
import { OSCALDocumentRoot } from "./OSCALLoaderStyles";
import OSCALMetadata from "./OSCALMetadata";
import { OSCALParams } from "./OSCALParam";
import OSCALCatalogBaseline from "./OSCALCatalogBaseline";

const UNGROUPED_CONTROLS_TITLE = "*Top*";

interface OSCALCatalogControlsListProps {
  readonly controls: Catalog["controls"];
  readonly urlFragment?: string;
}

const OSCALCatalogControlsList: React.FC<OSCALCatalogControlsListProps> = ({
  controls,
  urlFragment,
}) => {
  const [isControlListItemOpened, setIsControlListItemOpened] = React.useState(false);
  const [previousHandledFragment, setPreviousHandledFragment] = React.useState(undefined);

  return (
    <OSCALSection>
      <Card>
        <CardContent>
          <OSCALAnchorLinkHeader>
            <OSCALSectionHeader>Controls</OSCALSectionHeader>
          </OSCALAnchorLinkHeader>
          {controls?.map((control) => (
            <OSCALCatalogControlListItem
              key={control.id}
              control={control}
              urlFragment={urlFragment}
              fragmentPrefix=""
              fragmentSuffix=""
              isControlListItemOpened={isControlListItemOpened}
              setIsControlListItemOpened={setIsControlListItemOpened}
              previousHandledFragment={previousHandledFragment}
              setPreviousHandledFragment={setPreviousHandledFragment}
            />
          ))}
        </CardContent>
      </Card>
    </OSCALSection>
  );
};

export interface OSCALCatalogProps extends EditableFieldProps {
  readonly onResolutionComplete: React.EffectCallback;
  readonly catalog: Catalog;
  readonly urlFragment?: string | undefined;
  readonly parentUrl: string;
  readonly onRestError?: (error: any) => void;
  readonly onRestSuccess?: (data: any) => void;
}

export const OSCALCatalog: React.FC<OSCALCatalogProps> = ({
  onResolutionComplete,
  catalog,
  isEditable,
  onFieldSave,
  urlFragment,
  parentUrl,
}) => {
  useEffect(onResolutionComplete);
  const partialRestData = {
    catalog: {
      uuid: catalog.uuid,
    },
  };

  const defaultGroup: ControlGroup = {
    title: UNGROUPED_CONTROLS_TITLE,
    controls: catalog.controls,
  };
  if (isEditable || true) return <OSCALCatalogBaseline></OSCALCatalogBaseline>;
  return (
    <OSCALDocumentRoot>
      <OSCALMetadata
        metadata={catalog.metadata}
        isEditable={isEditable}
        onFieldSave={onFieldSave}
        partialRestData={partialRestData}
        urlFragment={urlFragment}
        parentUrl={parentUrl}
        backMatter={catalog["back-matter"]}
      />
      <OSCALSection>
        <Card>
          <CardContent>
            <OSCALSectionHeader>Parameters</OSCALSectionHeader>
            <OSCALParams params={catalog.params} />
          </CardContent>
        </Card>
      </OSCALSection>
      {catalog.groups ? (
        <OSCALCatalogGroups
          groups={catalog.controls ? [defaultGroup, ...(catalog.groups ?? [])] : catalog.groups}
          urlFragment={urlFragment}
        />
      ) : catalog.controls ? (
        <OSCALCatalogControlsList controls={catalog.controls} urlFragment={urlFragment} />
      ) : undefined}
      <OSCALBackMatter
        backMatter={catalog["back-matter"]}
        parentUrl={parentUrl}
        isEditable={isEditable}
        onFieldSave={onFieldSave}
        partialRestData={partialRestData}
      />
    </OSCALDocumentRoot>
  );
};

export default OSCALCatalog;
