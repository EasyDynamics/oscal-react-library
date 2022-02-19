import "./App.css";
import { makeStyles, createTheme } from "@material-ui/core/styles";
import React, { useEffect, useState } from "react";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";
import MenuIcon from "@material-ui/icons/Menu";
import GitHubIcon from "@material-ui/icons/GitHub";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import CssBaseline from "@material-ui/core/CssBaseline";
import ReactGA from "react-ga";
import {
  Navigate,
  Route,
  Routes,
  Link as RouterLink,
  useLocation,
} from "react-router-dom";
import Link from "@material-ui/core/Link";

import { ThemeProvider } from "@material-ui/styles";
import {
  OSCALCatalogLoader,
  OSCALSSPLoader,
  OSCALComponentLoader,
  OSCALProfileLoader,
} from "@EasyDynamics/oscal-react-library";
import logo from "./images/logo-header.svg";

const theme = createTheme({
  palette: {
    primary: {
      main: "#002867",
    },
  },
});

const useStyles = makeStyles((themeData) => ({
  title: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: themeData.spacing(2),
  },
  logoText: {
    color: "white",
    "font-style": "italic",
  },
  logoImage: {
    width: "150px",
    "margin-right": "1em",
  },
  githubButton: {
    color: "white",
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

  if (process.env.REACT_APP_GOOGLE_ANALYTICS) {
    ReactGA.initialize(process.env.REACT_APP_GOOGLE_ANALYTICS, {
      testMode: process.env.NODE_ENV === "test",
    });
  }

  const location = useLocation();
  useEffect(() => {
    if (process.env.REACT_APP_GOOGLE_ANALYTICS) {
      ReactGA.pageview(location.pathname + location.search);
    }
  }, [location]);
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
              <Routes>
                {/*
                 * Because we immediately redirect users, `/` won't be visible for
                 * long; however, having this entry means that we avoid a console
                 * warning and at least presents something if the redirect or
                 * rendering fails for any reason.
                 */}
                <Route exact path="/" element="OSCAL Viewer" />
                <Route exact path="/catalog" element="OSCAL Catalog Viewer" />
                <Route
                  exact
                  path="/system-security-plan"
                  element="OSCAL System Security Plan Viewer"
                />
                <Route
                  exact
                  path="/component-definition"
                  element="OSCAL Component Viewer"
                />
                <Route exact path="/profile" element="OSCAL Profile Viewer" />
              </Routes>
            </Typography>
            <Typography variant="body2" className={classes.logoText}>
              Powered by
            </Typography>
            <Button
              href="https://www.easydynamics.com"
              className={classes.githubButton}
              target="_blank"
            >
              <img
                src={logo}
                alt="Easy Dynamics Logo"
                className={classes.logoImage}
              />
            </Button>
            <IconButton
              href="https://github.com/EasyDynamics/oscal-react-library"
              className={classes.githubButton}
              target="_blank"
              rel="noreferrer"
            >
              <GitHubIcon htmlColor="white" />
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
        <Container maxWidth="xl" component="main">
          <Routes>
            <Route
              exact
              path="/"
              element={<Navigate replace to="/catalog" />}
            />
            <Route
              path="/catalog"
              element={<OSCALCatalogLoader renderForm />}
            />
            <Route
              exact
              path="/system-security-plan"
              element={<OSCALSSPLoader renderForm />}
            />
            <Route
              exact
              path="/component-definition"
              element={<OSCALComponentLoader renderForm />}
            />
            <Route
              exact
              path="/profile"
              element={<OSCALProfileLoader renderForm />}
            />
          </Routes>
        </Container>
      </div>
    </ThemeProvider>
  );
}

export default App;
