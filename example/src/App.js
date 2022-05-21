import "./App.css";
import {
  createTheme,
  ThemeProvider,
  StyledEngineProvider,
  adaptV4Theme,
} from "@mui/material/styles";
import makeStyles from "@mui/styles/makeStyles";
import React, { useEffect, useState } from "react";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import MenuIcon from "@mui/icons-material/Menu";
import GitHubIcon from "@mui/icons-material/GitHub";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import CssBaseline from "@mui/material/CssBaseline";
import ReactGA from "react-ga";
import {
  Navigate,
  Route,
  Routes,
  Link as RouterLink,
  useLocation,
} from "react-router-dom";

import {
  OSCALCatalogLoader,
  OSCALSSPLoader,
  OSCALComponentLoader,
  OSCALProfileLoader,
} from "@EasyDynamics/oscal-react-library";
import logo from "./images/logo-header.svg";

const theme = createTheme(
  adaptV4Theme({
    palette: {
      primary: {
        main: "#002867",
      },
    },
  })
);

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

function AppWrapper() {
  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>
    </StyledEngineProvider>
  );
}

function App() {
  const classes = useStyles();

  const [anchorEl, setAnchorEl] = useState(null);
  const [isRestMode, setIsRestMode] = useState(
    // We want to ensure that throughout the app this is always a boolean
    // so that it can be decoupled from the _actual_ API URL (which may
    // be different).
    !!process.env.REACT_APP_REST_BASE_URL
  );
  const [backendUrl] = useState(process.env.REACT_APP_REST_BASE_URL);

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
            size="large"
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
            size="large"
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
        <MenuItem
          onClick={handleAppNavClose}
          component={RouterLink}
          to="/catalog"
        >
          Catalog Viewer
        </MenuItem>
        <MenuItem
          onClick={handleAppNavClose}
          component={RouterLink}
          to="/system-security-plan"
        >
          System Security Plan Viewer
        </MenuItem>
        <MenuItem
          onClick={handleAppNavClose}
          component={RouterLink}
          to="/component-definition"
        >
          Component Viewer
        </MenuItem>
        <MenuItem
          onClick={handleAppNavClose}
          component={RouterLink}
          to="/profile"
        >
          Profile Viewer
        </MenuItem>
      </Menu>
      <Container maxWidth="xl" component="main">
        <Routes>
          <Route exact path="/" element={<Navigate replace to="/catalog" />} />
          <Route
            path="/catalog"
            element={
              <OSCALCatalogLoader
                renderForm
                isRestMode={isRestMode}
                setIsRestMode={setIsRestMode}
                backendUrl={backendUrl}
              />
            }
          />
          <Route
            exact
            path="/system-security-plan"
            element={
              <OSCALSSPLoader
                renderForm
                isRestMode={isRestMode}
                setIsRestMode={setIsRestMode}
                backendUrl={backendUrl}
              />
            }
          />
          <Route
            exact
            path="/component-definition"
            element={
              <OSCALComponentLoader
                renderForm
                isRestMode={isRestMode}
                setIsRestMode={setIsRestMode}
                backendUrl={backendUrl}
              />
            }
          />
          <Route
            exact
            path="/profile"
            element={
              <OSCALProfileLoader
                renderForm
                isRestMode={isRestMode}
                setIsRestMode={setIsRestMode}
                backendUrl={backendUrl}
              />
            }
          />
        </Routes>
      </Container>
    </div>
  );
}

export default AppWrapper;
