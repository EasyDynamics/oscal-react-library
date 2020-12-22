import React from 'react';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
	OSCALMetadataAdditional: {
		  padding: theme.spacing(1)
	},
	OSCALMetadataLabel: {
		'text-align': 'right',
		'color': '#0000008a'
	}
	}));

export default function OSCALCatalogGroupControlGuidance(props) {
	const classes = useStyles();
	
	return (
		<Grid container spacing={3}>
        	<Grid item xs={8}>
	        	<Typography variant="h6">
		        	{props.metadata.title}
		        </Typography>
        	</Grid>
        	<Grid item xs={4}>
        		<Paper variant="outlined" className={classes.OSCALMetadataAdditional}>
        			<Grid container spacing={1}>
	        			<Grid item xs={4}>
				        	<Typography variant="body2" className={classes.OSCALMetadataLabel}>
					          	Version:
					        </Typography>
					     </Grid>
        				<Grid item xs={8}>
				        	<Typography variant="body2">
					          	{props.metadata.version}
					        </Typography>
					     </Grid>
					     <Grid item xs={4}>
				        	<Typography variant="body2" className={classes.OSCALMetadataLabel}>
					          	Last Modified:
					        </Typography>
					     </Grid>
					     <Grid item xs={8}>
						     <Typography variant="body2">
					          	{props.metadata.['last-modified']}
					        </Typography>
					     </Grid>
					     <Grid item xs={4}>
				        	<Typography variant="body2" className={classes.OSCALMetadataLabel}>
					          	OSCAL Version:
					        </Typography>
					     </Grid>
					     <Grid item xs={8}>
						     <Typography variant="body2">
					          	{props.metadata.['oscal-version']}
					        </Typography>
					     </Grid>
					   </Grid>
	          	</Paper>
        	</Grid>
        </Grid>
	);
	
}