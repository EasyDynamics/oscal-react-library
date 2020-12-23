import './App.css';
import { makeStyles } from '@material-ui/core/styles';
import React, { useState } from 'react';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import CssBaseline from '@material-ui/core/CssBaseline';
import { Route, Switch } from "react-router-dom";
import { Link as RouterLink } from 'react-router-dom';
import Link from '@material-ui/core/Link';
import OSCALLoader from './OSCALLoader.js';

const useStyles = makeStyles((theme) => ({
	  title: {
	    flexGrow: 1,
	  },
	  menuButton: {
	    marginRight: theme.spacing(2),
	  },
	}));

function App() {
  const classes = useStyles();
  
  const defaultOscalCatalogUrl = "https://raw.githubusercontent.com/usnistgov/oscal-content/master/nist.gov/SP800-53/rev5/json/NIST_SP-800-53_rev5_catalog.json";
  const defaultOscalSspUrl = "https://raw.githubusercontent.com/usnistgov/oscal-content/master/examples/ssp/json/ssp-example.json";
  
  const [anchorEl, setAnchorEl] = useState(null);

  const handleAppNavOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleAppNavClose = () => {
    setAnchorEl(null);
  };
  
  return (
    <div className="App">
    	<CssBaseline />
    	<AppBar position="static">
    	 	<Toolbar>
	    	 	<IconButton edge="start" className={classes.menuButton} onClick={handleAppNavOpen} color="inherit" aria-label="menu">
		            <MenuIcon />
		          </IconButton>
		    	<Typography variant="h6" className={classes.title}>
		    		<Route path="/catalog">OSCAL Catalog Browser</Route>
		    		<Route path="/ssp">OSCAL System Security Plan Browser</Route>
			      </Typography>
		    </Toolbar>
    	</AppBar>
    	<Menu
	        id="app-nav-menu"
	        anchorEl={anchorEl}
	        keepMounted
	        open={Boolean(anchorEl)}
	        onClose={handleAppNavClose}
	      >
	        <MenuItem onClick={handleAppNavClose}><Link component={RouterLink} to="/catalog">Catalog Browser</Link></MenuItem>
	        <MenuItem onClick={handleAppNavClose}><Link component={RouterLink} to="/system-security-plan">System Security Plan Browser</Link></MenuItem>
	    </Menu>
    	<Container component="main">
    	  <Switch>
    	  	{/* TODO - This doesn't load properly */}
    		<Route path="/catalog">
	    		<OSCALLoader 
	    			oscalModelType="Catalog"
	    			oscalUrl={defaultOscalCatalogUrl}
	    		/>
	    	</Route>
    		<Route exact path="/system-security-plan">
	    		<OSCALLoader 
	    			oscalModelType="SSP"
	    			oscalUrl={defaultOscalSspUrl}
	    		/>
	    	</Route>
	      </Switch>
        </Container>
    </div>
  );
}

export default App;
