import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { TreeItem } from "@material-ui/lab";
import OSCALProfileCatalogInheritanceTree from "./OSCALProfileCatalogInheritanceTree";

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
  const [validIds, setValidIds] = useState([false, []]);
  const ids = [];

  const children = createTree(props.inheritedProfilesAndCatalogs, ids);

  if (ids.length > 0 && !validIds[0]) {
    setValidIds([true, ids]);
  }

  return (
    <OSCALProfileCatalogInheritanceTree
      treeItems={children}
      validIds={validIds[1]}
      classes={classes}
    />
  );
}
