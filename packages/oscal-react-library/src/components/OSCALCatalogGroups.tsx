import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import List from "@mui/material/List";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { styled } from "@mui/material/styles";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import PropTypes from "prop-types";
import React, { ReactNode, useEffect } from "react";
import { OSCALSection, OSCALSectionHeader } from "../styles/CommonPageStyles";
import OSCALCatalogGroup from "./OSCALCatalogGroup";
import OSCALControlParamLegend from "./OSCALControlParamLegend";
import { OSCALAnchorLinkHeader } from "./OSCALAnchorLinkHeader";
import { conformLinkIdText } from "./oscal-utils/OSCALLinkUtils";
import { OSCALMarkupLine } from "./OSCALMarkupProse";
import { Control, ControlGroup } from "@easydynamics/oscal-types";

export const OSCALControlList = styled(List)`
  padding-left: 2em;
  padding-right: 2em;
`;

interface TabPanelProps {
  children: ReactNode;
  groupId: string;
  value: string;
}

const TabPanel: React.FC<TabPanelProps> = (props) => {
  const { children, groupId, value } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== groupId}
      id={`vertical-tabpanel-${groupId}`}
      aria-labelledby={`vertical-tabpanel-${groupId}`}
    >
      {value === groupId && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
};

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

function a11yProps(groupId: string) {
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
 * @param groups The control groupings
 * @param controlLayers An decending list of groups/controls
 * @param rootLayer The top most layer
 * @returns This returns the lowest found control or undefined if not
 */
function determineControlExists(
  groups: ControlGroup[] | undefined,
  controlLayers: string[],
  rootLayer: string
): ControlGroup | undefined {
  // Ensure catalog tab grouping exists
  let upperLayer = groups?.find(
    (group) => group?.id === rootLayer || conformLinkIdText(group?.title) === rootLayer
  );

  if (!upperLayer) {
    return undefined;
  }

  // Ensure lowest/deepest control exists within controls/groups
  for (let i = 1; i < controlLayers.length && upperLayer; i += 1) {
    const subControl: Control | undefined = upperLayer?.controls?.find(
      (control) => control.id === controlLayers[i]
    );
    const subGroup: ControlGroup | undefined = upperLayer?.groups?.find(
      (group) =>
        group.id === controlLayers[i] || conformLinkIdText(group.title) === controlLayers[i]
    );
    upperLayer = subControl || subGroup;
  }
  return upperLayer;
}

export interface OSCALCatalogGroupsProps {
  groups: ControlGroup[] | undefined;
  urlFragment?: string;
}

export const OSCALCatalogGroups: React.FC<OSCALCatalogGroupsProps> = (props) => {
  const { groups, urlFragment } = props;
  const [openTab, setOpenTab] = React.useState(
    groups?.[0]?.id ?? conformLinkIdText(groups?.[0]?.title)
  );
  const [isControlListItemOpened, setIsControlListItemOpened] = React.useState(false);
  const [previousHandledFragment, setPreviousHandledFragment] = React.useState(undefined);

  const handleChange = (event: React.SyntheticEvent<Element, Event>, value: string) => {
    setOpenTab(value);
  };

  useEffect(() => {
    // Ensure fragment exists and split by groupings
    if (!urlFragment || previousHandledFragment === urlFragment) {
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
      // Set sub-group/control layer beneath to false for new fragment to be handled
      setIsControlListItemOpened(false);
    }
  }, [urlFragment, groups, previousHandledFragment]);

  return (
    <OSCALSection>
      <Card>
        <CardContent>
          <Grid container>
            <Grid item sm={9}>
              <OSCALAnchorLinkHeader>
                <OSCALSectionHeader>Controls</OSCALSectionHeader>
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
                    label={<OSCALMarkupLine>{group.title}</OSCALMarkupLine>}
                    {...a11yProps(group.id ?? conformLinkIdText(group.title))}
                    value={group.id ?? conformLinkIdText(group.title)}
                  />
                ))}
              </ComponentTabs>
            </Grid>
            <TabPanelList item sm={8.5}>
              {groups?.map((group) => (
                <TabPanel
                  key={group.title}
                  groupId={group.id ?? conformLinkIdText(group.title)}
                  value={openTab}
                >
                  <OSCALCatalogGroup
                    group={group}
                    urlFragment={urlFragment}
                    isControlListItemOpened={isControlListItemOpened}
                    setIsControlListItemOpened={setIsControlListItemOpened}
                    previousHandledFragment={previousHandledFragment}
                    setPreviousHandledFragment={setPreviousHandledFragment}
                  />
                </TabPanel>
              ))}
            </TabPanelList>
          </Grid>
        </CardContent>
      </Card>
    </OSCALSection>
  );
};

export default OSCALCatalogGroups;
