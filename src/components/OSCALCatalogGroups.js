import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import List from "@mui/material/List";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { styled } from "@mui/material/styles";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import PropTypes from "prop-types";
import React, { useCallback, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { OSCALSection, OSCALSectionHeader } from "../styles/CommonPageStyles";
import OSCALCatalogGroup from "./OSCALCatalogGroup";
import OSCALControlParamLegend from "./OSCALControlParamLegend";
import OSCALAnchorLinkHeader from "./OSCALAnchorLinkHeader";
import { determineControlGroupFromFragment } from "./oscal-utils/OSCALLinkUtils";

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

export default function OSCALCatalogGroups(props) {
  const [openTab, setOpenTab] = React.useState(props?.groups[0]?.id);

  const location = useLocation();

  const handleChange = (event, newValue) => {
    setOpenTab(newValue);
  };

  const handleFragment = useCallback(() => {
    // Grab fragment identifier following hash character if fragment exists in location
    const controlFragment =
      location.hash !== "" ? location.hash.substring(1) : null;
    // Find catalog group fragment
    const controlGroupingFragment =
      determineControlGroupFromFragment(controlFragment);
    // Determine higher-level control or sub-control exists within catalog group
    const catalogControl =
      props?.groups
        ?.find((group) => group.id === controlGroupingFragment)
        ?.controls?.find((control) => control.id === controlFragment) ||
      props?.groups
        ?.find((group) => group.id === controlGroupingFragment)
        ?.controls?.find((control) => controlFragment?.includes(control.id))
        ?.controls?.find((subcontrol) => subcontrol.id === controlFragment);
    if (!catalogControl) {
      return;
    }
    // Confirm catalog tab group can be grabbed
    const elementWithFragment = document.getElementById(
      `vertical-tab-${controlGroupingFragment}`
    );
    if (elementWithFragment) {
      setOpenTab(controlGroupingFragment);
    }
  }, [location.hash, props?.groups]);

  useEffect(() => {
    handleFragment();
  }, [handleFragment]);

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
                {props.groups?.map((group) => (
                  <ComponentTab
                    key={group.title}
                    label={group.title}
                    {...a11yProps(group.id)}
                    value={group.id}
                  />
                ))}
              </ComponentTabs>
            </Grid>
            <TabPanelList item sm={8.5}>
              {props.groups?.map((group, index) => (
                <TabPanel
                  key={group.title}
                  groupId={group.id}
                  value={openTab}
                  index={index}
                >
                  <OSCALCatalogGroup group={group} />
                </TabPanel>
              ))}
            </TabPanelList>
          </Grid>
        </CardContent>
      </Card>
    </OSCALSection>
  );
}
