import { Catalog, ControlGroup } from "@easydynamics/oscal-types";
import React, { useEffect } from "react";
import OSCALBackMatter from "./OSCALBackMatter";
import OSCALCatalogGroups from "./OSCALCatalogGroups";
import { EditableFieldProps } from "./OSCALEditableTextField";
import { OSCALDocumentRoot } from "./OSCALLoaderStyles";
import OSCALMetadata from "./OSCALMetadata";

export interface OSCALCatalogProps extends EditableFieldProps {
  onResolutionComplete: React.EffectCallback;
  catalog: Catalog;
  urlFragment?: string | undefined;
  parentUrl: string;
}

export const OSCALCatalog: React.FC<OSCALCatalogProps> = (props) => {
  const { onResolutionComplete, catalog, isEditable, onFieldSave, urlFragment, parentUrl } = props;

  useEffect(onResolutionComplete);

  const partialRestData = {
    catalog: {
      uuid: catalog.uuid,
    },
  };

  const defaultGroup: ControlGroup = {
    title: "*Ungrouped Controls*",
    controls: catalog.controls,
  };

  return (
    <OSCALDocumentRoot>
      <OSCALMetadata
        metadata={catalog.metadata}
        isEditable={isEditable}
        onFieldSave={onFieldSave}
        partialRestData={partialRestData}
        urlFragment={urlFragment}
      />

      <OSCALCatalogGroups
        groups={catalog.controls ? [defaultGroup, ...(catalog.groups ?? [])] : catalog.groups}
        urlFragment={urlFragment}
      />

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
