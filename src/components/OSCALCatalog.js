import React from "react";
import List from "@material-ui/core/List";
import ListSubheader from "@material-ui/core/ListSubheader";
import { useLoaderStyles } from "./OSCALLoaderStyles";
import OSCALMetadata from "./OSCALMetadata";
import OSCALCatalogGroup from "./OSCALCatalogGroup";
import OSCALBackMatter from "./OSCALBackMatter";

export default function OSCALCatalog(props) {
  const classes = useLoaderStyles();
  props.onResolutionComplete();

  return (
    <div className={classes.paper}>
      <OSCALMetadata metadata={props.catalog.metadata} />
      <List
        subheader={
          <ListSubheader
            component="div"
            disableSticky
            id="nested-list-subheader"
          >
            Control Groups
          </ListSubheader>
        }
      >
        {props.catalog.groups.map((group) => (
          <OSCALCatalogGroup group={group} key={group.id} />
        ))}
      </List>
      <OSCALBackMatter
        backMatter={props.catalog["back-matter"]}
        parentUrl={props.parentUrl}
      />
    </div>
  );
}
