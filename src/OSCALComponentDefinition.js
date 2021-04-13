import { makeStyles } from '@material-ui/core/styles';
import OSCALMetadata from './OSCALMetadata.js';
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
import OSCALResponsibleRoles from './OSCALResponsibleRoles.js';

const useStyles = makeStyles((theme) => ({
    paper: {
      marginTop: theme.spacing(2),
      display: 'flex',
      flexDirection: 'column'
    },
	OSCALComponentsHeader: {
		'& .MuiTypography-root': {
			'font-size': '0.875rem',
			color: '#0000008a'
		}
	}
  }));

  export default function OSCALComponentDefinition(props) {
	const classes = useStyles();
	    
        return (
	        <div className={classes.paper}>
	            <OSCALMetadata metadata={props.componentDefinition.metadata} />
                <Card>
	    		    <CardContent>
	    		    <Grid container spacing={2}>
		    		    <Grid item xs={12} className={classes.OSCALComponentsHeader}>
			        	    <Typography>
			        		    Components
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
                                {Object.entries(props.componentDefinition.components).map(([key, component], index) => (
				                  <TableRow key={key}>
				                    <TableCell component="th" scope="row">
				                    	<Tooltip title={component.description}>
				                    		<Typography variant="body2">{component.title}</Typography>
				                    	</Tooltip>
				                    </TableCell>
				                    <TableCell>{component.type}</TableCell>
				                    <TableCell>
					                    <OSCALResponsibleRoles responsibleRoles={component.['responsible-roles']} parties={props.componentDefinition.metadata.parties} />
				                    </TableCell>
				                  </TableRow>
				                ))}
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
