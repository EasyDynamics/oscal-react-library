import React from "react";
import { styled } from "@mui/material/styles";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import FolderIcon from "@mui/icons-material/Folder";
import OSCALControl from "./OSCALControl";
import OSCALControlParamLegend from "./OSCALControlParamLegend";

export const OSCALControlList = styled(List)`
  padding-left: 2em;
  padding-right: 2em;
`;

export default function OSCALCatalogGroup(props) {
  const [open, setOpen] = React.useState(false);

  const handleClick = () => {
    setOpen(!open);
  };

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

  return (
    <div>
      <ListItem key={groupKey(props.group)} button onClick={handleClick}>
        <ListItemAvatar key={`${groupKey(props.group)}-avatar`}>
          <Avatar variant="rounded">
            <FolderIcon />
          </Avatar>
        </ListItemAvatar>
        <ListItemText primary={props.group.title} />
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItem>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <Box display="flex" justifyContent="flex-end">
          <OSCALControlParamLegend />
        </Box>
        <OSCALControlList>
          {props.group.groups?.map((innerGroup) => (
            <OSCALCatalogGroup group={innerGroup} key={innerGroup.id} />
          ))}
          {props.group.controls?.map((control) => (
            <OSCALControl
              control={control}
              childLevel={0}
              key={`control-${control.id}`}
            />
          ))}
        </OSCALControlList>
      </Collapse>
    </div>
  );
}
