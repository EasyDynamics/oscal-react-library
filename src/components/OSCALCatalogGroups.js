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
import { determineControlGroupFromHash } from "./oscal-utils/OSCALLinkUtils";

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
  const [value, setValue] = React.useState(props?.groups[0]?.id);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    const { hash } = window.location;

    // Find catalog group hash
    const controlGroupingHash = determineControlGroupFromHash(hash);
    // Determine higher-level control or sub-control exists within catalog group
    const catalogControl =
      props?.groups
        ?.find((group) => group.id === controlGroupingHash)
        ?.controls?.find((control) => control.id === hash?.substring(1)) ||
      props?.groups
        ?.find((group) => group.id === controlGroupingHash)
        ?.controls?.find((control) => hash?.substring(1)?.includes(control.id))
        ?.controls?.find((subcontrol) => subcontrol.id === hash?.substring(1));

    if (catalogControl) {
      // Confirm catalog tab group can be grabbed
      const elementWithHash =
        hash && document.getElementById(`vertical-tab-${controlGroupingHash}`);

      if (elementWithHash) {
        setValue(controlGroupingHash);
      }
    }
  }, [window.location.hash]);

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
                value={value}
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
                  value={value}
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
