import React, { useEffect } from "react";
import OSCALBackMatter from "./OSCALBackMatter";
import OSCALCatalogGroups from "./OSCALCatalogGroups";
import { OSCALDocumentRoot } from "./OSCALLoaderStyles";
import OSCALMetadata from "./OSCALMetadata";

export default function OSCALCatalog(props) {
  useEffect(props.onResolutionComplete);

  const partialRestData = {
    catalog: {
      uuid: props.catalog.uuid,
    },
  };

  return (
    <OSCALDocumentRoot>
      <OSCALMetadata
        metadata={props.catalog.metadata}
        isEditable={props.isEditable}
        onFieldSave={props.onFieldSave}
        partialRestData={partialRestData}
      />

      <OSCALCatalogGroups groups={props.catalog.groups} />

      <OSCALBackMatter
        backMatter={props.catalog["back-matter"]}
        parentUrl={props.parentUrl}
      />
    </OSCALDocumentRoot>
  );
}
