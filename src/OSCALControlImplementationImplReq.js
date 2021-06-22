import React from "react";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import PropTypes from "prop-types";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Box from "@material-ui/core/Box";
import { makeStyles } from "@material-ui/core/styles";
import OSCALControl from "./OSCALControl";
import getControlOrSubControl from "./oscal-utils/OSCALControlResolver";

const useStyles = makeStyles((theme) => ({
  OSCALImplReq: {
    margin: "1em 0 1em 0",
  },
  OSCALImplReqpControlId: {
    "text-transform": "uppercase",
  },
  OSCALImplChildLevel: (props) =>
    props.childLevel > 0
      ? {
          margin: "1em 1.5em 1em 1.5em",
          "background-color": "#fffcf0",
        }
      : "",
  OSCALImplReqChildLevelTitle: (props) =>
    props.childLevel > 0
      ? {
          "font-size": "1.1rem",
        }
      : "",
  tabsContainer: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
    display: "flex",
    height: 440,
  },
  tabs: {
    borderRight: `1px solid ${theme.palette.divider}`,
    width: 340,
    minWidth: 340,
  },
  tabButton: {
    width: 340,
    maxWidth: 340,
  },
  tabPanelScrollable: {
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
  const classes = useStyles(props);
  const [value, setValue] = React.useState(0);
  // Updates panel based on tab state change
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  // Error check implementedRequirement statements. In the case that none
  // are provided, create an empty list.
  let implReqStatements = props.implementedRequirement.statements;
  if (!implReqStatements) {
    implReqStatements = [];
  }
  // Setup UI of Control Implemention with verticle tabs and a tab panel to
  // display control implementation, which are both wrapped in a card
  return (
    <Card className={`${classes.OSCALImplReq} ${classes.OSCALImplChildLevel}`}>
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
              />
            ))}
          </Tabs>
          {Object.values(props.components).map((component, index) => (
            <TabPanel
              value={value}
              index={index}
              className={classes.tabPanelScrollable}
            >
              <OSCALControl
                control={getControlOrSubControl(
                  props.controls,
                  props.implementedRequirement["control-id"]
                )}
                childLevel={0}
                implReqStatements={implReqStatements}
                componentId={component.uuid}
              />
            </TabPanel>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
