import React from "react";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import PropTypes from "prop-types";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Box from "@material-ui/core/Box";
import { makeStyles } from "@material-ui/core/styles";
import OSCALControl from "./OSCALControl";

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

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `vertical-tab-${index}`,
    "aria-controls": `vertical-tabpanel-${index}`,
  };
}

export default function OSCALControlImplementationImplReq(props) {
  const classes = useStyles(props);
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const control = props.controls.find(
    (control) => control.id === props.implementedRequirement["control-id"]
  );

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
            {Object.entries(props.components).map(([key, component], index) => (
              <Tab
                label={component.title}
                {...a11yProps(index)}
                className={classes.tabButton}
                key={key}
              />
            ))}
          </Tabs>
          {Object.entries(props.components).map(([key, component], index) => (
            <TabPanel
              value={value}
              index={index}
              className={classes.tabPanelScrollable}
              key={key}
            >
              <OSCALControl
                control={control}
                childLevel={0}
                implReqStatements={props.implementedRequirement.statements}
                componentId={key}
              />
            </TabPanel>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
