import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { TreeItem, TreeView } from "@material-ui/lab";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";
import { Grid, IconButton, List, Paper } from "@material-ui/core";
import ListSubheader from "@material-ui/core/ListSubheader";

const useStyles = makeStyles((theme) => ({
  inheritance: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    position: "relative",
    overflow: "auto",
  },
  treeStyle: {
    marginLeft: theme.spacing(2),
  }
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
  const classes = useStyles();
  const [expandedIds, setExpandedIds] = useState([]);
  const ids = [];

  const children = createTree(props.inheritedProfilesAndCatalogs, ids);

  if (ids.length > 0 && expandedIds.length === 0) {
    setExpandedIds(ids);
  }

  return expandedIds.length > 0 ? (
    <Grid item>
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
              <IconButton>
                <ExpandMoreIcon />
              </IconButton>
            }
            defaultCollapseIcon={
              <IconButton>
                <ExpandLessIcon />
              </IconButton>
            }
            defaultExpanded={expandedIds}
          >
            {children}
          </TreeView>
        </List>
      </Paper>
    </Grid>
  ) : null;
}
