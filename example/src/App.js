import "./App.css";
import { makeStyles } from "@material-ui/core/styles";
import React, { useState } from "react";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";
import MenuIcon from "@material-ui/icons/Menu";
import GitHubIcon from '@material-ui/icons/GitHub';
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import CssBaseline from "@material-ui/core/CssBaseline";
import { Route, Switch, Redirect, Link as RouterLink } from "react-router-dom";
import Link from "@material-ui/core/Link";
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import logo from './images/logo-header.png';

import {
  OSCALCatalogLoader,
  OSCALSSPLoader,
  OSCALComponentLoader,
  OSCALProfileLoader,
} from "oscal-react-library";

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#002867',
    },
  }
});

const useStyles = makeStyles((theme) => ({
  title: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  logoText: {
    color: "white",
    "font-style": "italic",
  },
  logoImage: {
    maxWidth: "150px",
    "margin-right": "1em",
  },
  githubButton: {
    color: "white",
  }
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
    <ThemeProvider theme={theme}>
      <div className="App">
        <CssBaseline />
        <AppBar position="static">
          <Toolbar>
            <IconButton
              edge="start"
              className={classes.menuButton}
              onClick={handleAppNavOpen}
              color="inherit"
              aria-label="menu"
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" className={classes.title}>
              <Route path="/catalog">OSCAL Catalog Viewer</Route>
              <Route path="/system-security-plan">
                OSCAL System Security Plan Viewer
              </Route>
              <Route path="/component-definition">OSCAL Component Viewer</Route>
              <Route path="/profile">OSCAL Profile Viewer</Route>
            </Typography>
            <Typography variant="body2" className={classes.logoText}>
                Powered by 
              </Typography>
            <Button
              href="https://easydynamics.com"
              className={classes.githubButton}
              target="_blank"
            >
              <img src={logo} alt="Easy Dynamics Logo" className={classes.logoImage} />
              </Button>
            <IconButton
              href="https://github.com/EasyDynamics/oscal-react-library"
              className={classes.githubButton}
              target="_blank"
              rel="noreferrer"
            >
              <GitHubIcon color="white"/>
            </IconButton>
          </Toolbar>
        </AppBar>
        <Menu
          id="app-nav-menu"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleAppNavClose}
        >
          <MenuItem onClick={handleAppNavClose}>
            <Link component={RouterLink} to="/catalog">
              Catalog Viewer
            </Link>
          </MenuItem>
          <MenuItem onClick={handleAppNavClose}>
            <Link component={RouterLink} to="/system-security-plan">
              System Security Plan Viewer
            </Link>
          </MenuItem>
          <MenuItem onClick={handleAppNavClose}>
            <Link component={RouterLink} to="/component-definition">
              Component Viewer
            </Link>
          </MenuItem>
          <MenuItem onClick={handleAppNavClose}>
            <Link component={RouterLink} to="/profile">
              Profile Viewer
            </Link>
          </MenuItem>
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
            <Route exact path="/profile">
              <OSCALProfileLoader />
            </Route>
          </Switch>
        </Container>
      </div>
    </ThemeProvider>
  );
}

export default App;
