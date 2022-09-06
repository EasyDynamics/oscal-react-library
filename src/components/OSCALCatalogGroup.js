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

function OSCALCatalogGroupControl(props) {
  const [open, setOpen] = React.useState(false);

  const handleClick = () => {
    setOpen(!open);
  };

  const { control } = props;

  return (
    <div>
      <ListItem button onClick={handleClick}>
        <ListItemAvatar key={`${control.id}-avatar`}>
          <Avatar variant="rounded">
            <FolderIcon />
          </Avatar>
        </ListItemAvatar>
        <ListItemText
          primary={`${control.id.toUpperCase()} ${control.title}`}
        />
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItem>

      <Collapse in={open} timeout="auto" unmountOnExit>
        <OSCALControl
          control={control}
          childLevel={0}
          key={`control-${control.id}`}
        />
      </Collapse>
    </div>
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
          <OSCALCatalogGroup group={innerGroup} key={innerGroup.id} />
        ))}
        {props.group.controls?.map((control) => (
          <OSCALCatalogGroupControl control={control} key={control.id} />
        ))}
      </OSCALControlList>
    </div>
  );
}
