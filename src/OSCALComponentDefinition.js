import { makeStyles } from '@material-ui/core/styles';
import OSCALMetadata from './OSCALMetadata.js';
import OSCALComponents from './OSCALComponents.js';

const useStyles = makeStyles((theme) => ({
    paper: {
      marginTop: theme.spacing(2),
      display: 'flex',
      flexDirection: 'column'
    }
  }));

  export default function OSCALComponentDefinition(props) {
	const classes = useStyles();
	
	const componentDefinition = props.['component-definition'];

	    return (
	        <div className={classes.paper}>
	            <OSCALMetadata metadata={componentDefinition.metadata} />
                <OSCALComponents
	        	components={componentDefinition.['components']}
	        />
	        </div>
	    );
	}
