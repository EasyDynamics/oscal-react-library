import { makeStyles } from '@material-ui/core/styles';
import OSCALMetadata from './OSCALMetadata.js';
import OSCALSystemCharacteristics from './OSCALSystemCharacteristics.js';
import OSCALSystemImplementation from './OSCALSystemImplementation.js';

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column'
  }
}));

export default function OSCALSsp(props) {
	const classes = useStyles();
	
	  return (
	    <div className={classes.paper}>
	        <OSCALMetadata metadata={props.['system-security-plan'].metadata} />
	        <OSCALSystemCharacteristics 
	        	systemCharacteristics={props.['system-security-plan'].['system-characteristics']}
	        />
	        <OSCALSystemImplementation 
	        	systemImplementation={props.['system-security-plan'].['system-implementation']}
	            parties={props.['system-security-plan'].metadata.parties}
	        />
	    </div>
	  );
	}