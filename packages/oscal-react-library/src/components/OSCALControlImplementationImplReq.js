import React from "react";
import { styled } from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import OSCALControl from "./OSCALControl";
import getControlOrSubControl from "./oscal-utils/OSCALControlResolver";

const OSCALImplReqCard = styled(Card, {
  // https://github.com/mui/material-ui/blob/c34935814b81870ca325099cdf41a1025a85d4b5/packages/mui-system/src/createStyled.js#L56
  shouldForwardProp: (prop) =>
    !["childLevel", "withdrawn", "ownerState", "theme", "sx", "as"].includes(prop),
})`
  margin-top: 1em;
  margin-bottom: 1em;
  margin-left: ${(props) => (props.childLevel > 0 ? "1.5em" : "0")};
  margin-right: ${(props) => (props.childLevel > 0 ? "1.5em" : "0")};
  ${(props) => props.childLevel > 0 && "background-color: #fffcf0;"}
`;

const ComponentTabContainer = styled(Grid)(
  ({ theme }) => `
  flex-grow: 1;
  background-color: ${theme.palette.background.paper};
  display: flex;
  height: 440;
`
);

const ComponentTabs = styled(Tabs)(
  ({ theme }) => `
  border-right: 1px solid ${theme.palette.divider};
  width: 340;
  min-width: 340;
`
);

const ComponentTabButton = styled(Tab)`
  width: 340;
  min-width: 340;
`;

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
const ComponentTabPanelScrollable = styled(TabPanel)`
  overflow: scroll;
`;

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
 * @returns The corresponding Control Implementation
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
    <OSCALImplReqCard>
      <CardContent>
        <ComponentTabContainer container>
          <Grid item lg={2.5} sm={12}>
            <ComponentTabs
              orientation="vertical"
              variant="scrollable"
              value={value}
              onChange={handleChange}
              aria-label="Vertical tabs example"
            >
              {Object.values(props.components).map((component, index) => (
                <ComponentTabButton
                  label={component.title}
                  {...a11yProps(index)}
                  key={component.uuid}
                />
              ))}
            </ComponentTabs>
          </Grid>
          <Grid item lg={9.5} sm={12}>
            {Object.values(props.components).map((component, index) => (
              <ComponentTabPanelScrollable value={value} index={index} key={component.uuid}>
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
              </ComponentTabPanelScrollable>
            ))}
          </Grid>
        </ComponentTabContainer>
      </CardContent>
    </OSCALImplReqCard>
  );
}
