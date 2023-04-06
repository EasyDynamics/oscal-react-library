import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import List from "@mui/material/List";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { styled } from "@mui/material/styles";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import PropTypes from "prop-types";
import React, { useEffect } from "react";
import { OSCALSection, OSCALSectionHeader } from "../styles/CommonPageStyles";
import OSCALCatalogGroup from "./OSCALCatalogGroup";
import OSCALControlParamLegend from "./OSCALControlParamLegend";
import OSCALAnchorLinkHeader from "./OSCALAnchorLinkHeader";
import { conformLinkIdText } from "./oscal-utils/OSCALLinkUtils";

export const OSCALControlList = styled(List)`
  padding-left: 2em;
  padding-right: 2em;
`;

function TabPanel(props) {
  const { children, groupId, value, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== groupId}
      id={`vertical-tabpanel-${groupId}`}
      aria-labelledby={`vertical-tabpanel-${groupId}`}
      {...other}
    >
      {value === groupId && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const ComponentTabs = styled(Tabs)(
  ({ theme }) => `
  border-right: 1px solid ${theme.palette.divider};
`
);

const TabPanelList = styled(Grid)(
  ({ theme }) => `
  border-left: 1px solid ${theme.palette.divider};
`
);

const ComponentTab = styled(Tab)(({ theme }) => ({
  borderRadius: "0.5em",
  marginBottom: "0.5em",
  backgroundColor: theme.palette.grey[50],
  textTransform: "none",
}));

function a11yProps(groupId) {
  return {
    id: `vertical-tab-${groupId}`,
    "aria-controls": `vertical-tab-${groupId}`,
  };
}

TabPanel.propTypes = {
  value: PropTypes.string.isRequired,
};

/**
 * Validates if the lowest control provided in an decending list (controlLayers) can be found
 * within the provided groups.
 *
 * @param {*} groups The control groupings
 * @param {*} controlLayers An decending list of groups/controls
 * @param {*} rootLayer The top most layer
 * @returns This returns the lowest found control or null if not
 */
function determineControlExists(groups, controlLayers, rootLayer) {
  // Ensure catalog tab grouping exists
  let upperLayer = groups?.find(
    (group) =>
      group?.id === rootLayer || conformLinkIdText(group?.title) === rootLayer
  );
  if (!upperLayer) {
    return null;
  }
  // Ensure lowest/deepest control exists
  for (let i = 1; i < controlLayers.length && upperLayer; i += 1) {
    upperLayer = upperLayer?.controls?.find(
      (control) => control.id === controlLayers[i]
    );
  }
  return upperLayer;
}

export default function OSCALCatalogGroups(props) {
  const { groups, urlFragment } = props;
  const [openTab, setOpenTab] = React.useState(groups[0]?.id);
  const [isControlListItemOpened, setIsControlListItemOpened] =
    React.useState(false);

  const handleChange = (event, newValue) => {
    setOpenTab(newValue);
  };

  useEffect(() => {
    // Initially set item opened to false for new fragment to be handled
    setIsControlListItemOpened(false);
    // Ensure fragment exists and split by groupings
    if (!urlFragment) {
      return;
    }
    // Break control groupings apart
    const controlLayers = urlFragment.split("/");
    const rootLayer = controlLayers[0];
    if (!determineControlExists(groups, controlLayers, rootLayer)) {
      return;
    }
    // Confirm catalog tab group can be grabbed
    if (document.getElementById(`vertical-tab-${rootLayer}`)) {
      setOpenTab(rootLayer);
    }
  }, [urlFragment, groups]);

  return (
    <OSCALSection>
      <Card>
        <CardContent>
          <Grid container>
            <Grid item sm={9}>
              <OSCALAnchorLinkHeader>
                <OSCALSectionHeader>Control Groups</OSCALSectionHeader>
              </OSCALAnchorLinkHeader>
            </Grid>
            <Grid item sm={3}>
              <Box display="flex" justifyContent="flex-end">
                <OSCALControlParamLegend />
              </Box>
            </Grid>
            <Grid item sm={2.5}>
              <ComponentTabs
                onChange={handleChange}
                orientation="vertical"
                variant="scrollable"
                value={openTab}
              >
                {groups?.map((group) => (
                  <ComponentTab
                    key={group.title}
                    label={group.title}
                    {...a11yProps(group.id ?? conformLinkIdText(group.title))}
                    value={group.id ?? conformLinkIdText(group.title)}
                  />
                ))}
              </ComponentTabs>
            </Grid>
            <TabPanelList item sm={8.5}>
              {groups?.map((group, index) => (
                <TabPanel
                  key={group.title}
                  groupId={group.id ?? conformLinkIdText(group.title)}
                  value={openTab}
                  index={index}
                >
                  <OSCALCatalogGroup
                    group={group}
                    urlFragment={urlFragment}
                    isControlListItemOpened={isControlListItemOpened}
                    setIsControlListItemOpened={setIsControlListItemOpened}
                  />
                </TabPanel>
              ))}
            </TabPanelList>
          </Grid>
        </CardContent>
      </Card>
    </OSCALSection>
  );
}
