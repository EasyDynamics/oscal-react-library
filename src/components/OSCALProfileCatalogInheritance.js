import React, { useState } from "react";
import { styled } from "@mui/material/styles";
import { TreeItem, TreeView } from "@mui/lab";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { Grid, IconButton, List, Paper } from "@mui/material";
import ListSubheader from "@mui/material/ListSubheader";

const PREFIX = "OSCALProfileCatalogInheritance";

const classes = {
  inheritance: `${PREFIX}-inheritance`,
  treeStyle: `${PREFIX}-treeStyle`,
};

const StyledGrid = styled(Grid)(({ theme }) => ({
  [`& .${classes.inheritance}`]: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    position: "relative",
    overflow: "auto",
  },

  [`& .${classes.treeStyle}`]: {
    marginLeft: theme.spacing(2),
  },
}));

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
    <StyledGrid item>
      <Paper className={classes.inheritance}>
        <List
          subheader={
            <ListSubheader
              className={classes.OSCALMetadataPartiesHeader}
              component="div"
              id="oscal-metadata-parties"
            >
              Profiles/Catalog Inheritance
            </ListSubheader>
          }
        >
          <TreeView
            className={classes.treeStyle}
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
      </Paper>
    </StyledGrid>
  ) : null;
}
