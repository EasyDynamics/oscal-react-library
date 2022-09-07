import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import FolderIcon from "@mui/icons-material/Folder";
import Avatar from "@mui/material/Avatar";
import Collapse from "@mui/material/Collapse";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import { styled } from "@mui/material/styles";
import React from "react";
import OSCALControl from "./OSCALControl";
import OSCALControlParamLegend from "./OSCALControlParamLegend";

export const OSCALControlList = styled(List)`
  padding-left: 2em;
  padding-right: 2em;
`;

function CollapseableListItem(props) {
  const [open, setOpen] = React.useState(false);

  const handleClick = () => {
    setOpen(!open);
  };

  return (
    <div>
      <ListItem button onClick={handleClick}>
        <ListItemAvatar>
          <Avatar variant="rounded">
            <FolderIcon />
          </Avatar>
        </ListItemAvatar>
        <ListItemText primary={props.itemText} />
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItem>
      <Collapse in={open} timeout="auto" unmountOnExit>
        {props.children}
      </Collapse>
    </div>
  );
}

function OSCALCatalogControlListItem(props) {
  const { control } = props;

  return (
    <CollapseableListItem
      itemText={`${control.id.toUpperCase()} ${control.title}`}
    >
      <OSCALControl
        control={control}
        childLevel={0}
        key={`control-${control.id}`}
      />
    </CollapseableListItem>
  );
}

// Groups may not necessarily have an ID (it is not required per the spec);
// therefore, we need to be able to come up with a semi-constant ID. All
// groups will have a title. We can (poorly) hash that hopefully that will
// be good enough.
const groupKey = (group) => {
  if (group.id) {
    return group.id;
  }
  let hash = 7;
  // eslint-disable-next-line no-restricted-syntax
  for (const char of group.title) {
    hash = 31 * hash + char.charCodeAt(0);
  }
  return hash;
};

function OSCALCatalogGroupList(props) {
  return (
    <CollapseableListItem itemText={props.group.title}>
      <OSCALControlList>
        {props.group.groups?.map((innerGroup) => (
          <OSCALCatalogGroupList
            group={innerGroup}
            key={groupKey(innerGroup)}
          />
        ))}
        {props.group.controls?.map((control) => (
          <OSCALCatalogControlListItem control={control} key={control.id} />
        ))}
      </OSCALControlList>
    </CollapseableListItem>
  );
}

export default function OSCALCatalogGroup(props) {
  return (
    <div>
      <Box display="flex" justifyContent="flex-end">
        <OSCALControlParamLegend />
      </Box>
      <OSCALControlList>
        {props.group.groups?.map((innerGroup) => (
          <OSCALCatalogGroupList
            group={innerGroup}
            key={groupKey(innerGroup)}
          />
        ))}
        {props.group.controls?.map((control) => (
          <OSCALCatalogControlListItem control={control} key={control.id} />
        ))}
      </OSCALControlList>
    </div>
  );
}
