import React from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import OSCALCatalogGroupControlPart from './OSCALCatalogGroupControlPart.js';

const useStyles = makeStyles((theme) => ({
	  OSCALCatalogGroupControl: {
		  'margin': '1em 0 1em 0'
	  },
	  OSCALCatalogGroupControlId: {
		  'text-transform': 'uppercase'
	  },
	  OSCALCatalogGroupControlChildLevel: props => (props.childLevel > 0 ?
			  {
		  		'margin': '1em 1.5em 1em 1.5em',
		  	    'background-color': '#fffcf0'
			  } : ''
	  ),
	  OSCALCatalogGroupControlChildLevelTitle: props => (props.childLevel > 0 ?
			  {
		  		'font-size': '1.1rem'
			  } : ''
	  ),
	 // TODO - This is probably 800-53 specific?
	  OSCALCatalogGroupControlStatus: props => getControlStatusCss(props)
	  }));

// TODO - This is probably 800-53 specific?
function getControlStatusCss(props) {
	if (!props.control.props) {return;}
	var property;
	for (property of props.control.props) {
		if (property.name === 'status') {
			return { 
				'text-decoration': 'line-through',
				'color': '#d4d4d4'
			};
		}
	}
	return '';
}

export default function OSCALCatalogGroupControl(props) {

	const classes = useStyles(props);
	
	return (
		<Card className={`${classes.OSCALCatalogGroupControl} ${classes.OSCALCatalogGroupControlStatus} ${classes.OSCALCatalogGroupControlChildLevel}`}>
			<CardContent>
		        <Typography variant="h6" component="h2" className={classes.OSCALCatalogGroupControlChildLevelTitle}>
		        	<span className={classes.OSCALCatalogGroupControlId}>{props.control.id}</span> {props.control.title}
		        </Typography>
		        {props.control.parts && props.control.parts.map((part, index) => (
		          <OSCALCatalogGroupControlPart part={part} parameters={props.control.params} 
				  	implReqStatements={props.implReqStatements} componentId={props.componentId} key={'part-' + index} />
	            ))}
				{props.control.controls && props.control.controls.map(control => (
		          <OSCALCatalogGroupControl control={control} parameters={control.params} childLevel={props.childLevel+1} key={control.id} />
	            ))}
	        </CardContent>
	     </Card>
	  );
	
}