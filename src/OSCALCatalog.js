import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListSubheader from '@material-ui/core/ListSubheader';
import OSCALCatalogGroup from './OSCALCatalogGroup.js';

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column'
  }
}));

export default function OSCALCatalog(props) {
	const classes = useStyles();
	
	  return (
	    <div className={classes.paper}>
		    <Typography variant="h6">
	        	{props.catalog.metadata.title}
	        </Typography>
	        <Typography variant="body2">
	          	({props.catalog.metadata.version})
	        </Typography>
	        <List
	        	subheader={
	        		<ListSubheader component="div" disableSticky={true} id="nested-list-subheader">
	        			Control Groups
        			</ListSubheader>
	        	}
	        >
		      {props.catalog.groups.map(group => (
		          <OSCALCatalogGroup group={group} />
	            ))}
		    </List>
	    </div>
	  );
	}