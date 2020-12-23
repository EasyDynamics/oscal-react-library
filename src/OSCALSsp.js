import { makeStyles } from '@material-ui/core/styles';
import OSCALMetadata from './OSCALMetadata.js';

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
	          TODO
	    </div>
	  );
	}