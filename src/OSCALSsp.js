import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import OSCALMetadata from './OSCALMetadata.js';
import OSCALSystemCharacteristics from './OSCALSystemCharacteristics.js';
import OSCALSystemImplementation from './OSCALSystemImplementation.js';
import OSCALControlImplementation from './OSCALControlImplementation.js';
import OSCALSspResolveProfile from './oscal-utils/OSCALSspResolver.js';

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column'
  }
}));

export default function OSCALSsp(props) {
	const [error, setError] = useState(null);
	const [isLoaded, setIsLoaded] = useState(false);
	const classes = useStyles();

	const ssp = props.['system-security-plan'];
	
	useEffect(() => {
		OSCALSspResolveProfile(ssp, props.parentUrl,
			() => { 
				setIsLoaded(true);
			},
			() => {
				setError(error);
				setIsLoaded(true);
			}
		);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	},[]);
	
	let controlImpl;

	if (!isLoaded) {
		controlImpl = null;
	} else {
		controlImpl = <OSCALControlImplementation 
			controlImplementation={ssp.['control-implementation']}
			components={ssp.['system-implementation'].components}
			controls={ssp.controls}
			/>
	}

	  return (
	    <div className={classes.paper}>
	        <OSCALMetadata metadata={ssp.metadata} />
	        <OSCALSystemCharacteristics 
	        	systemCharacteristics={ssp.['system-characteristics']}
	        />
	        <OSCALSystemImplementation 
	        	systemImplementation={ssp.['system-implementation']}
	            parties={ssp.metadata.parties}
	        />
			{controlImpl}
	    </div>
	  );
	}