import React from "react";
import { TreeView } from "@material-ui/lab";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";
import { Grid, IconButton, List, Paper } from "@material-ui/core";
import ListSubheader from "@material-ui/core/ListSubheader";

export default function OSCALProfileCatalogInheritanceTree(props) {
  const tree =
    props.validIds.length > 0 ? (
      <Grid item className={props.classes.inheritance}>
        <Paper>
          <List
            subheader={
              <ListSubheader
                className={props.classes.OSCALMetadataPartiesHeader}
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
              defaultExpanded={props.validIds}
            >
              {props.treeItems}
            </TreeView>
          </List>
        </Paper>
      </Grid>
    ) : null;

  return tree;
}
