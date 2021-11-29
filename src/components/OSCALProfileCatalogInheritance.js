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
  const classes = useStyles();
  const [validIds, setValidIds] = useState([]);
  const ids = [];

  const children = createTree(props.inheritedProfilesAndCatalogs, ids);

  if (ids.length > 0 && validIds.length === 0) {
    setValidIds(ids);
  }

  return validIds.length > 0 ? (
    <Grid item className={classes.inheritance}>
      <Paper>
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
            defaultExpanded={validIds}
          >
            {children}
          </TreeView>
        </List>
      </Paper>
    </Grid>
  ) : null;
}
