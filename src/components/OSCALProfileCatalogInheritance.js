import React, { useState } from "react";
import { styled } from "@mui/material/styles";
import { TreeItem, TreeView } from "@mui/lab";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { Grid, IconButton, List, Paper, ListSubheader } from "@mui/material";
import OSCALAnchorLinkHeader from "./OSCALAnchorLinkHeader";

const CatalogInheritancePaper = styled(Paper)(
  ({ theme }) => `
  margin-top: ${theme.spacing(2)};
  margin-bottom: ${theme.spacing(2)};
  position: relative;
  overflow: auto;
`
);

function generateLabel(title, type) {
  return type === "profile" ? `Profile: ${title}` : `Catalog: ${title}`;
}

function createTree(tree, ids) {
  if (tree.inherited == null) {
    return null;
  }

  const children = [];

  tree.inherited.forEach((childProfileOrCatalog) => {
    ids.push(`${childProfileOrCatalog.uuid} #${ids.length + 1}`);
    children.push(
      <TreeItem
        nodeId={`${childProfileOrCatalog.uuid} #${ids.length}`}
        key={`${childProfileOrCatalog.uuid} #${ids.length}`}
        label={generateLabel(
          childProfileOrCatalog.title,
          childProfileOrCatalog.type
        )}
      >
        {createTree(childProfileOrCatalog, ids)}
      </TreeItem>
    );
  });

  return children;
}

export default function OSCALProfileCatalogInheritance(props) {
  const [expandedIds, setExpandedIds] = useState([]);
  const ids = [];

  const children = createTree(props.inheritedProfilesAndCatalogs, ids);

  if (ids.length > 0 && expandedIds.length === 0) {
    setExpandedIds(ids);
  }

  return expandedIds.length > 0 ? (
    <Grid item>
      <CatalogInheritancePaper>
        <List
          subheader={
            <ListSubheader component="div" id="oscal-metadata-parties">
              <OSCALAnchorLinkHeader
                title="Profiles/Catalog Inheritance"
                value="profile-catalog-inheritance"
              />
            </ListSubheader>
          }
        >
          <TreeView
            defaultExpandIcon={
              <IconButton size="large">
                <ExpandMoreIcon />
              </IconButton>
            }
            defaultCollapseIcon={
              <IconButton size="large">
                <ExpandLessIcon />
              </IconButton>
            }
            defaultExpanded={expandedIds}
          >
            {children}
          </TreeView>
        </List>
      </CatalogInheritancePaper>
    </Grid>
  ) : null;
}
