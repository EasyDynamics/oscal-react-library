import React from "react";
import { styled } from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import OSCALControl from "./OSCALControl";
import getControlOrSubControl from "./oscal-utils/OSCALControlResolver";

const PREFIX = "OSCALControlImplementationImplReq";

const classes = {
  OSCALImplReq: `${PREFIX}-OSCALImplReq`,
  OSCALImplReqpControlId: `${PREFIX}-OSCALImplReqpControlId`,
  OSCALImplChildLevel: `${PREFIX}-OSCALImplChildLevel`,
  OSCALImplReqChildLevelTitle: `${PREFIX}-OSCALImplReqChildLevelTitle`,
  tabsContainer: `${PREFIX}-tabsContainer`,
  tabs: `${PREFIX}-tabs`,
  tabButton: `${PREFIX}-tabButton`,
  tabPanelScrollable: `${PREFIX}-tabPanelScrollable`,
};

const StyledCard = styled(Card)(({ theme }) => ({
  [`& .${classes.OSCALImplReq}`]: {
    margin: "1em 0 1em 0",
  },

  [`& .${classes.OSCALImplReqpControlId}`]: {
    "text-transform": "uppercase",
  },

  [`& .${classes.OSCALImplChildLevel}`]: (props) =>
    props.childLevel > 0
      ? {
          margin: "1em 1.5em 1em 1.5em",
          "background-color": "#fffcf0",
        }
      : "",

  [`& .${classes.OSCALImplReqChildLevelTitle}`]: (props) =>
    props.childLevel > 0
      ? {
          "font-size": "1.1rem",
        }
      : "",

  [`& .${classes.tabsContainer}`]: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
    display: "flex",
    height: 440,
  },

  [`& .${classes.tabs}`]: {
    borderRight: `1px solid ${theme.palette.divider}`,
    width: 340,
    minWidth: 340,
  },

  [`& .${classes.tabButton}`]: {
    width: 340,
    maxWidth: 340,
  },

  [`& .${classes.tabPanelScrollable}`]: {
    overflow: "scroll",
  },
}));

/**
 * Sets up elements of the tab panel.
 *
 * @param {object} props SSP properties
 * @returns The corresponding tab panel
 */
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </div>
  );
}

// Set required properties for Tab panel
TabPanel.propTypes = {
  children: PropTypes.node.isRequired,
  index: PropTypes.node.isRequired,
  value: PropTypes.node.isRequired,
};

/**
 * Makes a component dynamic and fit it's associated tab.
 *
 * @param {number} index The given index of a component
 * @returns A component's dynamic attributes
 */
function a11yProps(index) {
  return {
    id: `vertical-tab-${index}`,
    "aria-controls": `vertical-tabpanel-${index}`,
  };
}

/**
 * Creates the internal elements of Control Implementation.
 *
 * @param {object} props SSP properties
 * @returns The corresponding Control Implementation Request
 */
export default function OSCALControlImplementationImplReq(props) {
  const [value, setValue] = React.useState(0);
  // Updates panel based on tab state change
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  // Error check modifications
  const modAlters = props.modifications?.alters || null;
  const modParams = props.modifications?.["set-parameters"] || null;

  // Setup UI of Control Implementation with vertical tabs and a tab panel to
  // display control implementation, which are both wrapped in a card

  return (
    <StyledCard
      className={`${classes.OSCALImplReq} ${classes.OSCALImplChildLevel}`}
    >
      <CardContent>
        <div className={classes.tabsContainer}>
          <Tabs
            orientation="vertical"
            variant="scrollable"
            value={value}
            onChange={handleChange}
            aria-label="Vertical tabs example"
            className={classes.tabs}
          >
            {Object.values(props.components).map((component, index) => (
              <Tab
                label={component.title}
                {...a11yProps(index)}
                className={classes.tabButton}
                key={component.uuid}
              />
            ))}
          </Tabs>
          {Object.values(props.components).map((component, index) => (
            <TabPanel
              value={value}
              index={index}
              className={classes.tabPanelScrollable}
              key={component.uuid}
            >
              <OSCALControl
                control={getControlOrSubControl(
                  props.controls,
                  props.implementedRequirement["control-id"]
                )}
                childLevel={0}
                implementedRequirement={props.implementedRequirement}
                componentId={component.uuid}
                isEditable={props.isEditable}
                modificationAlters={modAlters}
                modificationSetParameters={modParams}
                onRestSuccess={props.onRestSuccess}
                onRestError={props.onRestError}
                partialRestData={props.partialRestData}
              />
            </TabPanel>
          ))}
        </div>
      </CardContent>
    </StyledCard>
  );
}
