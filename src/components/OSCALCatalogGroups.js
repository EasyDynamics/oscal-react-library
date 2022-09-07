import Box from "@mui/material/Box";
import List from "@mui/material/List";
import Paper from "@mui/material/Paper";
import { styled } from "@mui/material/styles";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import PropTypes from "prop-types";
import React from "react";
import { OSCALSection, OSCALSectionHeader } from "../styles/CommonPageStyles";
import OSCALCatalogGroup from "./OSCALCatalogGroup";

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
  width: 15em;
  min-width: 15em;
`
);

function a11yProps(index) {
  return {
    id: `vertical-tab-${index}`,
    "aria-controls": `vertical-tabpanel-${index}`,
  };
}

const CatalogGroupTabButton = styled(Tab)`
  width: 15em;
  min-width: 15em;
`;

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
      <OSCALSectionHeader>Control Groups</OSCALSectionHeader>
      <Paper sx={{ flexGrow: 1, display: "flex" }}>
        <ComponentTabs
          onChange={handleChange}
          orientation="vertical"
          variant="scrollable"
          value={value}
        >
          {props.groups?.map((group, index) => (
            <CatalogGroupTabButton
              key={group.title}
              label={group.title}
              {...a11yProps(index)}
            />
          ))}
        </ComponentTabs>
        {props.groups?.map((group, index) => (
          <TabPanel key={group.title} value={value} index={index}>
            <OSCALCatalogGroup group={group} />
          </TabPanel>
        ))}
      </Paper>
    </OSCALSection>
  );
}
