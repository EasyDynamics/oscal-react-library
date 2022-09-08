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
`
);

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
            <Grid item sm={12}>
              <OSCALSectionHeader>Control Groups</OSCALSectionHeader>
            </Grid>
            <Grid item sm={2}>
              <ComponentTabs
                onChange={handleChange}
                orientation="vertical"
                variant="scrollable"
                value={value}
              >
                {props.groups?.map((group, index) => (
                  <Tab
                    key={group.title}
                    label={group.title}
                    {...a11yProps(index, group.title)}
                  />
                ))}
              </ComponentTabs>
            </Grid>
            <Grid item sm={10}>
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
