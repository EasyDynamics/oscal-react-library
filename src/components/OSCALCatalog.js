import React, { useEffect } from "react";
import List from "@mui/material/List";
import ListSubheader from "@mui/material/ListSubheader";
import { OSCALDocumentRoot } from "./OSCALLoaderStyles";
import OSCALMetadata from "./OSCALMetadata";
import OSCALCatalogGroup from "./OSCALCatalogGroup";
import OSCALBackMatter from "./OSCALBackMatter";
import OSCALCatalogGroups from "./OSCALCatalogGroups";

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
