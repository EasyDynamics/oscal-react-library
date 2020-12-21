import React from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Collapse from '@material-ui/core/Collapse';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import FolderIcon from '@material-ui/icons/Folder';
import OSCALCatalogGroupControl from './OSCALCatalogGroupControl.js';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
	  OSCALCatalogGroupControlList: {
		  'padding-left': '2em',
		  'padding-right': '2em'
	  }
	}));

export default function OSCALCatalogGroup(props) {
	const classes = useStyles();
	const [open, setOpen] = React.useState(false);

	const handleClick = () => {
	    setOpen(!open);
	  };
	
	return (
			<React.Fragment key={props.group.id + "-fragment"}>
			<ListItem key={props.group.id} button onClick={handleClick}>
				<ListItemAvatar key={props.group.id + "-avatar"}>
		          <Avatar variant="rounded">
		          	<FolderIcon />
		          </Avatar>
		        </ListItemAvatar>
				<ListItemText key={props.group.id + "-text"} primary={props.group.title} />
		        {open ? <ExpandLess /> : <ExpandMore />}
			</ListItem>
			<Collapse key={props.group.id + "-collapse"} in={open} timeout="auto" unmountOnExit>
				<List className={classes.OSCALCatalogGroupControlList}>
	        	{props.group.controls.map(control => (
			          <OSCALCatalogGroupControl control={control} childLevel={0} />
		            ))}
	        	</List>
		     </Collapse>
		     </React.Fragment>
		  );
	
}