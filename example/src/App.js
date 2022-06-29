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
import ReactGA from "react-ga";
import {
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

function App() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [isRestMode, setIsRestMode] = useState(
    // We want to ensure that throughout the app this is always a boolean
    // so that it can be decoupled from the _actual_ API URL (which may
    // be different).
    !!process.env.REACT_APP_REST_BASE_URL
  );
  const [backendUrl] = useState(process.env.REACT_APP_REST_BASE_URL);

  const appType = React.useMemo(
    () => (isRestMode ? "Editor" : "Viewer"),
    [isRestMode]
  );
  useEffect(() => {
    document.title = `OSCAL ${appType}`;
  }, [appType]);

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
      elementName: "Component Definition",
      loaderElement: OSCALComponentLoader,
    },
    {
      pathName: "system-security-plan",
      elementName: "System Security Plan",
      loaderElement: OSCALSSPLoader,
    },
  ];

  const appBarRoutes = (
    <Route path="/">
      <Route index element={`OSCAL Catalog ${appType}`} />
      {oscalObjectTypes.map((oscalObjectType) => (
        <Route path={oscalObjectType.pathName} key={oscalObjectType.pathName}>
          <Route
            path=""
            element={`OSCAL ${oscalObjectType.elementName} ${appType}`}
          />
          <Route
            path=":id"
            element={`OSCAL ${oscalObjectType.elementName} ${appType}`}
          />
        </Route>
      ))}
    </Route>
  );

  const oscalObjectLoaderProps = {
    renderForm: true,
    isRestMode,
    setIsRestMode,
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
          <Route
            path=""
            element={createElement(
              oscalObjectType.loaderElement,
              oscalObjectLoaderProps
            )}
          />
          <Route
            path=":id"
            element={createElement(
              oscalObjectType.loaderElement,
              oscalObjectLoaderProps
            )}
          />
        </Route>
      ))}
    </Route>
  );

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={appTheme}>
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
                <Routes>{appBarRoutes}</Routes>
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
              {`Catalog ${appType}`}
            </MenuItem>
            <MenuItem
              onClick={handleAppNavClose}
              component={RouterLink}
              to="/profile"
            >
              {`Profile ${appType}`}
            </MenuItem>
            <MenuItem
              onClick={handleAppNavClose}
              component={RouterLink}
              to="/component-definition"
            >
              {`Component ${appType}`}
            </MenuItem>
            <MenuItem
              onClick={handleAppNavClose}
              component={RouterLink}
              to="/system-security-plan"
            >
              {`System Security Plan ${appType}`}
            </MenuItem>
          </Menu>
          <Container maxWidth={false} component="main">
            <Routes>{navRoutes} </Routes>
          </Container>
        </div>
      </ThemeProvider>
    </StyledEngineProvider>
  );
}

export default App;
