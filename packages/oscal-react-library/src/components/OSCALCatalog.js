import React, { useEffect } from "react";
import OSCALBackMatter from "./OSCALBackMatter";
import OSCALCatalogGroups from "./OSCALCatalogGroups";
import { OSCALDocumentRoot } from "./OSCALLoaderStyles";
import OSCALMetadata from "./OSCALMetadata";

export default function OSCALCatalog(props) {
  const { onResolutionComplete, catalog, isEditable, onFieldSave, urlFragment, parentUrl } = props;

  useEffect(onResolutionComplete);

  const partialRestData = {
    catalog: {
      uuid: catalog.uuid,
    },
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

      <OSCALCatalogGroups groups={catalog.groups} urlFragment={urlFragment} />

      <OSCALBackMatter
        backMatter={catalog["back-matter"]}
        parentUrl={parentUrl}
        isEditable={isEditable}
        onFieldSave={onFieldSave}
        partialRestData={partialRestData}
      />
    </OSCALDocumentRoot>
  );
}
