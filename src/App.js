import './App.css';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import CssBaseline from '@material-ui/core/CssBaseline';
import OSCALCatalogLoader from './OSCALCatalogLoader.js';

const useStyles = makeStyles((theme) => ({
	  title: {
	    flexGrow: 1,
	  }
	}));

function App() {
  const classes = useStyles();
	
  return (
    <div className="App">
    	<CssBaseline />
    	<AppBar position="static">
    	 	<Toolbar>
		    	<Typography variant="h6" className={classes.title}>
		    		OSCAL Catalog Browser
			      </Typography>
		    </Toolbar>
    	</AppBar>
    	<Container component="main">
    		<OSCALCatalogLoader />
        </Container>
    </div>
  );
}

export default App;
