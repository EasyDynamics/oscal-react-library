import React from "react";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import Collapse from "@material-ui/core/Collapse";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import FolderIcon from "@material-ui/icons/Folder";
import { makeStyles } from "@material-ui/core/styles";
import OSCALControl from "./OSCALControl";

const useStyles = makeStyles((theme) => ({
  OSCALControlList: {
    "padding-left": "2em",
    "padding-right": "2em",
  },
}));

export default function OSCALCatalogGroup(props) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);

  const handleClick = () => {
    setOpen(!open);
  };

  return (
    <>
      <ListItem key={props.group.id} button onClick={handleClick}>
        <ListItemAvatar key={`${props.group.id}-avatar`}>
          <Avatar variant="rounded">
            <FolderIcon />
          </Avatar>
        </ListItemAvatar>
        <ListItemText primary={props.group.title} />
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItem>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List className={classes.OSCALControlList}>
          {props.group.controls.map((control) => (
            <OSCALControl
              control={control}
              childLevel={0}
              key={`control-${control.id}`}
            />
          ))}
        </List>
      </Collapse>
    </>
  );
}
