import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import List from "@mui/material/List";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { styled } from "@mui/material/styles";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import PropTypes from "prop-types";
import React from "react";
import { OSCALSection, OSCALSectionHeader } from "../styles/CommonPageStyles";
import OSCALCatalogGroup, { getGroupKey } from "./OSCALCatalogGroup";
import OSCALControlParamLegend from "./OSCALControlParamLegend";

export const OSCALControlList = styled(List)`
  padding-left: 2em;
  padding-right: 2em;
`;

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
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const ComponentTabs = styled(Tabs)(
  ({ theme }) => `
  border-right: 1px solid ${theme.palette.divider};
  backgroundColor: ${theme.palette.grey.A700};
`
);

const ComponentTab = styled(Tab)(({ theme }) => ({
  borderRadius: "0.5em",
  marginBottom: "0.5em",
  backgroundColor: theme.palette.grey[50],
  textTransform: "none",
}));

function a11yProps(index, title) {
  return {
    id: `vertical-tab-${index}`,
    "aria-controls": `vertical-tabpanel-${title}`,
  };
}

TabPanel.propTypes = {
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

export default function OSCALCatalogGroups(props) {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <OSCALSection>
      <Card>
        <CardContent>
          <Grid container>
            <Grid item sm={9}>
              <OSCALSectionHeader>Control Groups</OSCALSectionHeader>
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
                {props.groups?.map((group, index) => (
                  <ComponentTab
                    key={getGroupKey(group)}
                    label={group.title}
                    {...a11yProps(index, group.title)}
                  />
                ))}
              </ComponentTabs>
            </Grid>
            <Grid item sm={8.5}>
              {props.groups?.map((group, index) => (
                <TabPanel key={getGroupKey(group)} value={value} index={index}>
                  <OSCALCatalogGroup group={group} />
                </TabPanel>
              ))}
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </OSCALSection>
  );
}
