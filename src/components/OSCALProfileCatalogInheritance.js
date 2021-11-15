import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { TreeView, TreeItem } from "@material-ui/lab";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";
import { Grid, IconButton, List, Paper } from "@material-ui/core";
import ListSubheader from "@material-ui/core/ListSubheader";

const useStyles = makeStyles((theme) => ({
  inheritance: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
}));

function renderTree(nodes, id) {
  if (nodes.inherited == null) {
    return null;
  }

  const generateLabel = (title, type) =>
    type == "profile" ? `Profile: ${title}` : `Catalog: ${title}`;

  const children = [];

  nodes.inherited.forEach((node) => {
    id[0] += 1;
    children.push(
      <TreeItem
        nodeId={id[0]}
        label={generateLabel(node.title, node.type)}
        children={}
        expandIcon={
          <IconButton aria-label={`expand-profiles-and-catalogs ${id[0] - 1}`}>
            <ChevronRightIcon />
          </IconButton>
        }
        collapseIcon={
          <IconButton
            aria-label={`collapse-profiles-and-catalogs ${id[0] - 1}`}
          >
            <ExpandLessIcon />
          </IconButton>
        }
      >
        {renderTree(node, id)}
      </TreeItem>
    );
  });

  return children;
}

export default function OSCALProfileCatalogInheritance(props) {
  const classes = useStyles();
  const id = [0];

  return props.inheritedProfilesAndCatalogs ? (
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
            aria-label="profile and catalog inheritance display"
          >
            {renderTree(props.inheritedProfilesAndCatalogs, id)}
          </TreeView>
        </List>
      </Paper>
    </Grid>
  ) : null;
}
