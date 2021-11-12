import React from 'react';
import { makeStyles } from "@material-ui/core/styles";
import { TreeView, TreeItem } from "@material-ui/lab";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import { Grid, List, Paper } from '@material-ui/core';
import ListSubheader from "@material-ui/core/ListSubheader";

const useStyles = makeStyles((theme) => ({
  inheritance : {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2)
  }
}));

function renderTree(nodes, id) {
  id[0] += 1;

  return (
    <TreeItem nodeId={id[0]} label={nodes["title"]}>
      {Array.isArray(nodes["inherited"])
        ? nodes["inherited"].map((node) => renderTree(node, id))
        : null}
    </TreeItem>
  );
}

export default function OSCALProfileCatalogInheritance(props) {
  const classes = useStyles();
  const id = [0];

  return(props.inheritedProfilesAndCatalogs ?
    <Grid item className={classes.inheritance}>
      <Paper>
        <List subheader={
              <ListSubheader
                className={classes.OSCALMetadataPartiesHeader}
                component="div"
                id="oscal-metadata-parties"
              >
                Inherited Profiles and Catalogs
              </ListSubheader>
            }>
          <TreeView
            aria-label="profile and catalog inheritance display"
            defaultCollapseIcon={<ExpandMoreIcon />}
            defaultExpandIcon={<ChevronRightIcon />}
          >
            {renderTree(props.inheritedProfilesAndCatalogs, id)}
          </TreeView>
        </List>
      </Paper>
    </Grid> : null
  );
}