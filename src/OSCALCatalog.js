import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListSubheader from '@material-ui/core/ListSubheader';
import OSCALMetadata from './OSCALMetadata.js';
import OSCALCatalogGroup from './OSCALCatalogGroup.js';

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column'
  }
}));

export default function OSCALCatalog(props) {
	const classes = useStyles();
	
	  return (
	    <div className={classes.paper}>
	        <OSCALMetadata metadata={props.catalog.metadata} />
	        <List
	        	subheader={
	        		<ListSubheader component="div" disableSticky={true} id="nested-list-subheader">
	        			Control Groups
        			</ListSubheader>
	        	}
	        >
		      {props.catalog.groups.map(group => (
		          <OSCALCatalogGroup group={group} key={group.id} />
	            ))}
		    </List>
	    </div>
	  );
	}