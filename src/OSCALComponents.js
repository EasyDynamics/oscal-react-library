import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Tooltip from '@material-ui/core/Tooltip';

const useStyles = makeStyles((theme) => ({
    paper: {
      marginTop: theme.spacing(2),
      display: 'flex',
      flexDirection: 'column'
    },
	OSCALComponentsInfo: {
		'text-transform': 'capitalize',
		'& .MuiTextField-root': {
			margin: theme.spacing(1)
		 }
	},
	// TODO - This is hacky
	OSCALComponentsHeader: {
		'& .MuiTypography-root': {
			'font-size': '0.875rem',
			color: '#0000008a'
		}
	}
  }));

  export default function OSCALComponents (props) {
	const classes = useStyles();
	
	  return (
	    <div className={classes.paper}>
	    	<Card>
	    		<CardContent>
	    		<Grid container spacing={2}>
		    		<Grid item xs={12} className={classes.OSCALComponentsHeader}>
			        	<Typography>
			        		Components
				        </Typography>
		        	</Grid>
		    		<Grid item xs={7} className={classes.OSCALComponentsInfo}>
			        	<Typography variant="h6">
			        		{props.components.['b036a6ac-6cff-4066-92bc-74ddfd9ad6fa'].type}
				        </Typography>
		        	</Grid>
					<Grid item xs={12}>
			            <TableContainer>
				            <Table aria-label="Title">
				              <TableHead>
				                <TableRow>
				                  <TableCell>Title</TableCell>
				                  <TableCell>Description</TableCell>
				                  <TableCell>Responsible Roles</TableCell>
				                </TableRow>
				              </TableHead>
				              <TableBody>
				                  <TableRow>
				                    <TableCell component="th" scope="row">
				                    	<Tooltip title={props.components.['b036a6ac-6cff-4066-92bc-74ddfd9ad6fa'].description}>
				                    		<Typography variant="body2">{props.components.['b036a6ac-6cff-4066-92bc-74ddfd9ad6fa'].title}</Typography>
				                    	</Tooltip>
				                    </TableCell>
				                    <TableCell>{props.components.['b036a6ac-6cff-4066-92bc-74ddfd9ad6fa'].description}</TableCell>
				                    <TableCell>{props.components.['b036a6ac-6cff-4066-92bc-74ddfd9ad6fa'].['responsible-roles'].supplier.['party-uuids']}</TableCell>
				                  </TableRow>
				              </TableBody>
				            </Table>
				        </TableContainer>
		        	</Grid>
				</Grid>
				</CardContent>
			</Card>
		</div>
	  );
  	}	

 