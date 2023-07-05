import Box from "@mui/material/Box";
import { Divider, Drawer, Grid } from "@mui/material";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Stack from "@mui/material/Stack";
import TreeItem, { treeItemClasses } from "@mui/lab/TreeItem";
import TreeView from "@mui/lab/TreeView";
import Typography from "@mui/material/Typography";
import { DocumentTree as DrawerSelectorDocumentTree } from "./OSCALDrawerSelector";

import React, { useState } from "react";
import { ReactComponent as CatalogsIcon } from "./images/icons/catalogs.svg";
import { ReactComponent as CatalogsHovIcon } from "./images/icons/catalogs_hov.svg";
import { ReactComponent as ComponentIcon } from "./images/icons/component.svg";
import { ReactComponent as ComponentHovIcon } from "./images/icons/component_hov.svg";
import { ReactComponent as DashboardIcon } from "./images/icons/dashboard.svg";
import { ReactComponent as DashboardHovIcon } from "./images/icons/dashboard_hov.svg";
import { ReactComponent as EnterpriseIcon } from "./images/icons/enterprise.svg";
import { ReactComponent as EnterpriseHovIcon } from "./images/icons/enterprise_hov.svg";
import { ReactComponent as LogoutIcon } from "./images/icons/logout.svg";
import { ReactComponent as LogoutHovIcon } from "./images/icons/logout_hov.svg";
import { ReactComponent as ProjectsIcon } from "./images/icons/projects.svg";
import { ReactComponent as ProjectsHovIcon } from "./images/icons/projects_hov1.svg";
import { ReactComponent as SupportIcon } from "./images/icons/support.svg";
import { ReactComponent as SupportHovIcon } from "./images/icons/support_hov.svg";
import { ReactComponent as UtilitiesIcon } from "./images/icons/tools.svg";
import { ReactComponent as UtilitiesHovIcon } from "./images/icons/tools_hov.svg";
import { ReactComponent as EDC_Reverse_Tagline } from "./images/EDC_Reverse_Tagline.svg";
import { styled } from "@mui/material/styles";

const footerHeight = "11rem";

const StyledDrawer = styled(Drawer)(({ theme }) => ({
  "& .MuiDrawer-paper": {
    backgroundColor: theme.palette.primary.main,
  },
}));

const DrawerHeader = styled("div")(({ theme }) => ({
  color: "white",
  marginTop: "1rem",
  marginBottom: "1rem",
}));

const DrawerFooter = styled("div")(({ theme }) => ({
  position: "sticky",
  height: footerHeight,
  top: `calc(100vh - ${footerHeight})`,
  backgroundColor: theme.palette.primary.main,
}));

const StyledTreeView = styled(TreeView)(({ theme }) => ({
  color: "#BCC6D5",
  overflow: "hidden",
  flexGrow: 1,
  overflowY: "auto",
}));

const TabTreeItemRoot = styled(TreeItem)(({ theme }) => ({
  width: "88%",
  borderTopRightRadius: theme.spacing(2),
  borderBottomRightRadius: theme.spacing(2),
  paddingRight: theme.spacing(1),
  color: "white",
  fill: "#BCC6D5",
  // General styling for tree items
  [`& .${treeItemClasses.content}`]: {
    minHeight: "3.5rem",
    paddingLeft: theme.spacing(4),
    flexDirection: "row-reverse",
    "&.Mui-expanded": {
      fill: theme.palette.primaryAccent.main,
    },
    "&:hover": {
      background: theme.palette.primary.dark,
    },
    "&.Mui-focused, &.Mui-selected, &.Mui-selected.Mui-focused": {
      fill: theme.palette.primaryAccent.main,
      background: `linear-gradient(to right, ${theme.palette.primaryAccent.main} 0%, ${theme.palette.primaryAccent.main} 2%, #023E88 2%)`,
    },
  },
  // Tree item styling underneath a group
  [`& .${treeItemClasses.group}`]: {
    width: "115%",
    marginLeft: 0,
    marginRight: 0,
    [`& .${treeItemClasses.content}`]: {
      paddingLeft: theme.spacing(4),
    },
    "&.Mui-expanded": {
      fontWeight: theme.typography.fontWeightBold,
    },
  },
}));

export interface OSCALMarkupInterface {
  children: string;
}

function TabTreeItem(props: any) {
  const {
    labelIcon: LabelIcon,
    labelIconExpanded: LabelIconExpanded,
    labelInfo,
    labelText,
    selectedNode,
    ...other
  } = props;

  const selectedState =
    selectedNode === props.nodeId || Array.from(selectedNode)[0] === props.nodeId;

  return (
    <TabTreeItemRoot
      label={
        <Stack direction="row" spacing={2} alignItems="center">
          <Box
            component={selectedState ? LabelIconExpanded : LabelIcon}
            height="1.25rem"
            width="1.25rem"
            sx={(theme) => ({
              fill: selectedState ? theme.palette.primaryAccent.main : "#BCC6D5",
              fontSize: "1rem",
              letterSpacing: ".05rem",
            })}
          />
          <Typography
            sx={(theme) => ({
              fontWeight: selectedState
                ? theme.typography.fontWeightBold
                : theme.typography.fontWeightRegular,
            })}
          >
            {labelText}
          </Typography>
        </Stack>
      }
      style={{}}
      {...other}
    />
  );
}

export const DocumentTree: React.FC<OSCALPermanentDrawerProps> = ({
  drawerWidth,
  backendUrl,
  handleClose,
}) => {
  const [selectedNode, setselectedNode] = useState([]);

  const handleSelectToggle = (event: any, nodeIds: any) => {
    setselectedNode(nodeIds);
  };

  // TODO: Swap out TreeView for Stack & Accordians
  return (
    <StyledTreeView
      aria-label="file system navigator"
      defaultCollapseIcon={<ExpandLessIcon sx={(theme) => ({ color: "#BCC6D5" })} />}
      defaultExpandIcon={<ExpandMoreIcon sx={(theme) => ({ color: "#BCC6D5" })} />}
      onNodeSelect={handleSelectToggle}
      sx={{
        width: `${drawerWidth}`,
      }}
      className="RightScrollbar"
    >
      <Divider />
      <Box sx={{ padding: "0.75rem", paddingLeft: "2rem" }}>
        <Typography sx={{ textTransform: "uppercase", fontSize: "0.75rem" }}>Main Menu</Typography>
      </Box>
      <TabTreeItem
        nodeId={"0"}
        selectedNode={selectedNode}
        labelText={"Dashboard"}
        labelIcon={DashboardIcon}
        labelIconExpanded={DashboardHovIcon}
      >
        <TabTreeItem
          nodeId={"0.0"}
          selectedNode={selectedNode}
          labelText={"* Dashboard Example *"}
        />
      </TabTreeItem>
      <TabTreeItem
        nodeId={"1"}
        selectedNode={selectedNode}
        labelText={"Catalogs/Baselines"}
        labelIcon={CatalogsIcon}
        labelIconExpanded={CatalogsHovIcon}
      >
        <TabTreeItem
          nodeId={"1.0"}
          selectedNode={selectedNode}
          labelText={"* Catalogs Example *"}
        />
      </TabTreeItem>
      <TabTreeItem
        nodeId={"2"}
        selectedNode={selectedNode}
        labelText={"Projects"}
        labelIcon={ProjectsIcon}
        labelIconExpanded={ProjectsHovIcon}
      >
        <TabTreeItem
          nodeId={"2.0"}
          selectedNode={selectedNode}
          labelText={"* Projects Example *"}
        />
      </TabTreeItem>
      <TabTreeItem
        nodeId={"3"}
        selectedNode={selectedNode}
        labelText={"Components"}
        labelIcon={ComponentIcon}
        labelIconExpanded={ComponentHovIcon}
      >
        <TabTreeItem
          nodeId={"3.0"}
          selectedNode={selectedNode}
          labelText={"* Components Example *"}
        />
      </TabTreeItem>
      <TabTreeItem
        nodeId={"4"}
        selectedNode={selectedNode}
        labelText={"Enterprise"}
        labelIcon={EnterpriseIcon}
        labelIconExpanded={EnterpriseHovIcon}
      >
        <TabTreeItem
          nodeId={"4.0"}
          selectedNode={selectedNode}
          labelText={"Enterprise Dashboard"}
          // TODO: Include NavLink component around item with a link to route
        />
        <TabTreeItem
          nodeId={"4.1"}
          selectedNode={selectedNode}
          labelText={"Enterprise Initiatives"}
          // TODO: Include NavLink component around item with a link to route
        />
      </TabTreeItem>
      <TabTreeItem
        nodeId={"5"}
        selectedNode={selectedNode}
        labelText={"Utilities"}
        labelIcon={UtilitiesIcon}
        labelIconExpanded={UtilitiesHovIcon}
      >
        <TabTreeItem
          nodeId={"5.0"}
          selectedNode={selectedNode}
          labelText={"* Utilities Example *"}
        />
      </TabTreeItem>
      {/* TODO: Remove this once paths have been determined or dev flag is set, handleClose can also be removed as well */}
      <Grid sx={{ backgroundColor: "white" }}>
        <DrawerSelectorDocumentTree backendUrl={backendUrl} handleClose={handleClose} />
      </Grid>
      <DrawerFooter>
        <Divider sx={{ bgcolor: "#BCC6D5", margin: "2rem" }} />
        <TabTreeItem
          nodeId={"6"}
          selectedNode={selectedNode}
          labelText={"Logout"}
          labelIcon={LogoutIcon}
          labelIconExpanded={LogoutHovIcon}
          // TODO: Include NavLink component around item with a link to route
        />
        <TabTreeItem
          nodeId={"7"}
          selectedNode={selectedNode}
          labelText={"Support"}
          labelIcon={SupportIcon}
          labelIconExpanded={SupportHovIcon}
          // TODO: Include NavLink component around item with a link to route
        />
      </DrawerFooter>
    </StyledTreeView>
  );
};

interface OSCALPermanentDrawerProps {
  drawerWidth: number;
  backendUrl: string;
  handleClose: () => void;
}

export const OSCALPermanentDrawer: React.FC<OSCALPermanentDrawerProps> = ({
  drawerWidth,
  backendUrl,
  handleClose,
}) => {
  return (
    <StyledDrawer variant="permanent" anchor="left">
      <DrawerHeader
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Box component="svg" width={`calc(${drawerWidth} - 4rem)`}>
          <EDC_Reverse_Tagline width="100%" height="50%" />
        </Box>
      </DrawerHeader>
      <DocumentTree drawerWidth={drawerWidth} backendUrl={backendUrl} handleClose={handleClose} />
    </StyledDrawer>
  );
};
