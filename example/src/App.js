import "./App.css";
import {
  styled,
  createTheme,
  ThemeProvider,
  StyledEngineProvider,
} from "@mui/material/styles";
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
import useMediaQuery from "@mui/material/useMediaQuery";
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

const OpenNavButton = styled(IconButton)(
  ({ theme }) => `margin-right: ${theme.spacing(2)}`
);
const LogoImage = styled("img")`
  width: 150px;
  margin-right: 1em;
`;

function App() {
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

  // Send a Google Analytics pageview action each time the current browser/window
  // URL changes
  useEffect(() => {
    if (process.env.REACT_APP_GOOGLE_ANALYTICS) {
      ReactGA.pageview(location.pathname + location.search);
    }
  }, [location]);

  // Use a dark theme when the user has a system-wide dark theme applied (and their browser
  // supports telling us about that). We don't currently expose a toggle in the UI for this;
  // however, this at least helps the app match their current system a bit better.
  const isDarkModePreferred = useMediaQuery("(prefers-color-scheme: dark)");
  const getDesignTokens = (isDarkModePreferred) => ({
    palette: {
      mode: isDarkModePreferred ? "dark" : "light",
      primary: {
        main: "#002867",
      }
    }
  });
  const theme = React.useMemo(() => createTheme(getDesignTokens(isDarkModePreferred)), [isDarkModePreferred]);

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="App">
          <AppBar position="static">
            <Toolbar>
              <OpenNavButton
                edge="start"
                onClick={handleAppNavOpen}
                color="inherit"
                aria-label="menu"
                size="large"
              >
                <MenuIcon />
              </OpenNavButton>
              <Typography variant="h6" sx={{ flexGrow: 1 }}>
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
              <Typography
                variant="body2"
                sx={{ color: "white", fontStyle: "italic" }}
              >
                Powered by
              </Typography>
              <Button
                href="https://www.easydynamics.com"
                target="_blank"
                sx={{ color: "white" }}
              >
                <LogoImage src={logo} alt="Easy Dynamics Logo" />
              </Button>
              <IconButton
                href="https://github.com/EasyDynamics/oscal-react-library"
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
          <Container maxWidth={false} component="main">
            <Routes>
              <Route
                exact
                path="/"
                element={<Navigate replace to="/catalog" />}
              />
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
      </ThemeProvider>
    </StyledEngineProvider>
  );
}

export default App;
