import "./App.css";
import {
  styled,
  createTheme,
  ThemeProvider,
  StyledEngineProvider,
} from "@mui/material/styles";
import React, { createElement, useEffect, useState } from "react";
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
import ReactGA from "react-ga4";
import {
  Route,
  Routes,
  Link as RouterLink,
  useLocation,
} from "react-router-dom";
import Grid from "@mui/material/Grid";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import {
  OSCALCatalogLoader,
  OSCALSSPLoader,
  OSCALComponentLoader,
  OSCALProfileLoader,
  OSCALDrawerSelector,
} from "@EasyDynamics/oscal-react-library";
import logo from "./images/logo-header.svg";

const appTheme = createTheme({
  palette: {
    primary: {
      main: "#002867",
    },
  },
});

const OpenNavButton = styled(IconButton)(
  ({ theme }) => `margin-right: ${theme.spacing(2)}`
);
const LogoImage = styled("img")`
  width: 150px;
  margin-right: 1em;
`;

function getBackEndUrl(urlString) {
  // If given something falsey, we need to also return something falsey.
  // This ensures that we don't accidentally force the application
  // to always be in editor/REST mode by creating a URL.
  if (!urlString) {
    return null;
  }
  // Because the URL may be a relative path and various application logic
  // assumes that it will always be an absolute URL, it is easiest to just
  // handle converting the potentially relative URL to an absolute URL and
  // explicitly use the current origin as the base.
  try {
    return new URL(urlString, window.location.href).toString();
  } catch (err) {
    // If the given URL is invalid, for some reason, fallback to just using
    // the provided value. This may result in more predictable errors
    // elsewhere.
    return urlString;
  }
}

function App() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isRestMode, setIsRestMode] = useState(
    // We want to ensure that throughout the app this is always a boolean
    // so that it can be decoupled from the _actual_ API URL (which may
    // be different).
    !!process.env.REACT_APP_REST_BASE_URL
  );
  const [backendUrl] = useState(
    getBackEndUrl(process.env.REACT_APP_REST_BASE_URL)
  );
  const [hasDefaultUrl, setHasDefaultUrl] = useState(false);

  useEffect(() => {
    const currentUrl = window.location.href;
    // Open the drawer when in REST mode and no uuid is present.
    // Note: The lowest subdirectory of the url is extracted to see if
    // it contains a uuid.
    if (
      isRestMode &&
      currentUrl.substring(currentUrl.lastIndexOf("/") + 1) === ""
    ) {
      setIsDrawerOpen(true);
    }
  }, [isRestMode]);

  const appType = React.useMemo(
    () => (isRestMode ? "Editor" : "Viewer"),
    [isRestMode]
  );
  useEffect(() => {
    document.title = `OSCAL ${appType}`;
  }, [appType]);

  const handleAppNavOpen = (event) => {
    if (event) {
      setAnchorEl(event.currentTarget);
    }

    setIsDrawerOpen(true);
  };

  const handleAppNavClose = () => {
    setAnchorEl(null);
    setIsDrawerOpen(false);
  };

  if (process.env.REACT_APP_GOOGLE_ANALYTICS) {
    ReactGA.initialize(process.env.REACT_APP_GOOGLE_ANALYTICS, {
      testMode: process.env.NODE_ENV === "test",
    });
  }

  const location = useLocation();
  useEffect(() => {
    if (process.env.REACT_APP_GOOGLE_ANALYTICS) {
      ReactGA.send({
        hitType: "pageview",
        page: location.pathname + location.search,
      });
    }
  }, [location]);

  const oscalObjectTypes = [
    {
      pathName: "catalog",
      elementName: "Catalog",
      loaderElement: OSCALCatalogLoader,
    },
    {
      pathName: "profile",
      elementName: "Profile",
      loaderElement: OSCALProfileLoader,
    },
    {
      pathName: "component-definition",
      elementName: "Component",
      loaderElement: OSCALComponentLoader,
    },
    {
      pathName: "system-security-plan",
      elementName: "System Security Plan",
      loaderElement: OSCALSSPLoader,
    },
  ];

  const routePaths = ["", ":id"];

  const appBarRoutes = (
    <Route path="/">
      <Route index element={`OSCAL Catalog ${appType}`} />
      {oscalObjectTypes.map((oscalObjectType) => (
        <Route path={oscalObjectType.pathName} key={oscalObjectType.pathName}>
          {routePaths.map((path) => (
            <Route
              path={path}
              key={path}
              element={`OSCAL ${oscalObjectType.elementName} ${appType}`}
            />
          ))}
        </Route>
      ))}
    </Route>
  );

  const oscalObjectLoaderProps = {
    renderForm: !isRestMode,
    isRestMode,
    hasDefaultUrl,
    setHasDefaultUrl,
    backendUrl,
  };

  const navRoutes = (
    <Route path="/">
      {/* Default index will open up the Catalog */}
      <Route
        index
        element={createElement(
          oscalObjectTypes[0].loaderElement,
          oscalObjectLoaderProps
        )}
      />
      {oscalObjectTypes.map((oscalObjectType) => (
        <Route path={oscalObjectType.pathName} key={oscalObjectType.pathName}>
          {routePaths.map((path) => (
            <Route
              path={path}
              key={path}
              element={createElement(
                oscalObjectType.loaderElement,
                oscalObjectLoaderProps
              )}
            />
          ))}
        </Route>
      ))}
    </Route>
  );

  const navigation = isRestMode ? (
    <OSCALDrawerSelector
      open={isDrawerOpen}
      handleClose={handleAppNavClose}
      backendUrl={backendUrl}
      handleOpen={handleAppNavOpen}
    />
  ) : (
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
        to="/catalog/"
      >
        {`Catalog ${appType}`}
      </MenuItem>
      <MenuItem
        onClick={handleAppNavClose}
        component={RouterLink}
        to="/profile/"
      >
        {`Profile ${appType}`}
      </MenuItem>
      <MenuItem
        onClick={handleAppNavClose}
        component={RouterLink}
        to="/component-definition/"
      >
        {`Component ${appType}`}
      </MenuItem>
      <MenuItem
        onClick={handleAppNavClose}
        component={RouterLink}
        to="/system-security-plan/"
      >
        {`System Security Plan ${appType}`}
      </MenuItem>
    </Menu>
  );

  const onChangeRestMode = (event) => {
    setIsRestMode(event.target.checked);
    setHasDefaultUrl(false);
  };

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={appTheme}>
        <CssBaseline />
        <div className="App">
          <AppBar position="static">
            <Toolbar>
              <Grid container alignItems="center">
                <Grid item md={4} align="left">
                  <Grid container alignItems="center">
                    <Grid item align="left">
                      <OpenNavButton
                        edge="start"
                        onClick={handleAppNavOpen}
                        color="inherit"
                        aria-label="menu"
                        size="large"
                      >
                        <MenuIcon />
                      </OpenNavButton>
                      {navigation}
                    </Grid>
                    <Grid item align="left">
                      <Typography variant="h6">
                        <Routes>{appBarRoutes}</Routes>
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item md={4}>
                  <Grid container alignItems="center" justifyContent="center">
                    <Grid item align="center">
                      <Typography
                        variant="body2"
                        sx={{ color: "white", fontStyle: "italic" }}
                      >
                        Powered by
                      </Typography>
                    </Grid>
                    <Grid item align="center">
                      <Button
                        href="https://www.easydynamics.com"
                        target="_blank"
                        sx={{ color: "white" }}
                      >
                        <LogoImage src={logo} alt="Easy Dynamics Logo" />
                      </Button>
                    </Grid>
                    <Grid item align="center">
                      <IconButton
                        href="https://github.com/EasyDynamics/oscal-react-library"
                        target="_blank"
                        rel="noreferrer"
                        size="large"
                      >
                        <GitHubIcon htmlColor="white" />
                      </IconButton>
                    </Grid>
                  </Grid>
                </Grid>
                {backendUrl && (
                  <Grid item md={4} align="right">
                    <FormControlLabel
                      control={
                        <Switch
                          checked={isRestMode}
                          color="warning"
                          onChange={onChangeRestMode}
                          name="isRestMode"
                        />
                      }
                      label="REST Mode"
                    />
                  </Grid>
                )}
              </Grid>
            </Toolbar>
          </AppBar>
          <Container maxWidth={false} component="main">
            <Routes>{navRoutes}</Routes>
          </Container>
        </div>
      </ThemeProvider>
    </StyledEngineProvider>
  );
}

export default App;
