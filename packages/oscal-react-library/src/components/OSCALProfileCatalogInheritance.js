import React from "react";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { TreeItem, TreeView } from "@mui/lab";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";
import CardContent from "@mui/material/CardContent";
import { OSCALSection, OSCALSectionHeader } from "../styles/CommonPageStyles";
import OSCALAnchorLinkHeader from "./OSCALAnchorLinkHeader";

export default function OSCALProfileCatalogInheritance(props) {
  const documentLabel = (item) => (
    <Stack direction="row" spacing={2}>
      <Typography>{item.title}</Typography>
      <Chip label={item.type[0].toUpperCase() + item.type.slice(1)} />
    </Stack>
  );

  const inheritedListItem = (item) => (
    <TreeItem key={item.uuid} nodeId={item.uuid} label={documentLabel(item)}>
      {item.inherited?.map((inherited) => inheritedListItem(inherited))}
    </TreeItem>
  );
  return (
    <OSCALSection>
      <Card>
        <CardContent>
          <OSCALAnchorLinkHeader value="profile-catalog-inheritance">
            <OSCALSectionHeader>
              Profiles/Catalog Inheritance
            </OSCALSectionHeader>
          </OSCALAnchorLinkHeader>
          <TreeView
            defaultCollapseIcon={<ExpandMoreIcon />}
            defaultExpandIcon={<ChevronRightIcon />}
            multiSelect
          >
            {props.inheritedProfilesAndCatalogs.inherited?.map((item) =>
              inheritedListItem(item)
            )}
          </TreeView>
        </CardContent>
      </Card>
    </OSCALSection>
  );
}
