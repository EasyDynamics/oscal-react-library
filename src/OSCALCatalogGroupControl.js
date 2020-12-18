import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Collapse from '@material-ui/core/Collapse';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import { makeStyles } from '@material-ui/core/styles';
import OSCALCatalogGroupControlPart from './OSCALCatalogGroupControlPart.js';

const useStyles = makeStyles((theme) => ({
	  OSCALCatalogGroupControlId: {
		  'text-transform': 'uppercase',
		  'backgroundColor': '#FF6600',
		  'font-size': '0.85em'
	  },
	  OSCALCatalogGroupControlEnhancements: {
		  'margin-left': '1.5em'
	  }
	}));

export default function OSCALCatalogGroupControl(props) {
	const classes = useStyles();
	
	const [open, setOpen] = React.useState(true);

	const handleClick = () => {
	    setOpen(!open);
	  };
	
	return (
			<React.Fragment key={props.control.id + "-fragment"}>
			<ListItem key={props.control.id} button onClick={handleClick}>
				<ListItemAvatar key={props.control.id + "=avatar"}>
		          <Avatar className={classes.OSCALCatalogGroupControlId}>{props.control.id}</Avatar>
		        </ListItemAvatar>
				<ListItemText key={props.control.id + "-text"} primary={props.control.title} />
		        {open ? <ExpandLess /> : <ExpandMore />}
			</ListItem>
			<Collapse key={props.control.id + "-controls"} in={open} timeout="auto" unmountOnExit>
				{props.control.parts && props.control.parts.map(part => (
		          <OSCALCatalogGroupControlPart part={part} parameters={props.control.parameters} />
	            ))}
				{props.control.controls && props.control.controls.map(control => (
		          <OSCALCatalogGroupControl control={control} parameters={control.parameters} />
	            ))}
		    </Collapse>
		    </React.Fragment>
		  );
	
}