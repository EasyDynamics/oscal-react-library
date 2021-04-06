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
import { Route, Switch, Redirect } from "react-router-dom";
import { Link as RouterLink } from 'react-router-dom';
import Link from '@material-ui/core/Link';
import { OSCALCatalogLoader, OSCALSSPLoader, OSCALComponentLoader } from './OSCALLoader.js';

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
		    		<Route path="/catalog">OSCAL Catalog Viewer</Route>
		    		<Route path="/system-security-plan">OSCAL System Security Plan Viewer</Route>
					<Route path="/component-definition">OSCAL Component Viewer</Route>
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
	        <MenuItem onClick={handleAppNavClose}><Link component={RouterLink} to="/catalog">Catalog Viewer</Link></MenuItem>
	        <MenuItem onClick={handleAppNavClose}><Link component={RouterLink} to="/system-security-plan">System Security Plan Viewer</Link></MenuItem>
			<MenuItem onClick={handleAppNavClose}><Link component={RouterLink} to="/component-definition">Component Viewer</Link></MenuItem>
	    </Menu>
    	<Container component="main">
    	  <Switch>
    	  	{/* TODO - This doesn't load properly */}
    	  	<Route exact path="/">
    	  		<Redirect to="/catalog" />
	        </Route>
    		<Route path="/catalog">
	    		<OSCALCatalogLoader />
	    	</Route>
    		<Route exact path="/system-security-plan">
	    		<OSCALSSPLoader />
	    	</Route>
			<Route exact path="/component-definition">
	    		<OSCALComponentLoader />
	    	</Route>
	      </Switch>
        </Container>
    </div>
  );
}

export default App;
