import {
  Divider,
  Drawer,
  IconButton,
  Typography,
  styled,
  useTheme,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import TreeView from "@mui/lab/TreeView";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import TreeItem from "@mui/lab/TreeItem";
import { Link } from "react-router-dom";
import {
  oscalObjectTypes,
  fetchAllResourcesOfType,
} from "./oscal-utils/OSCALRestUtils";
import OSCALMarkdownProse from "./OSCALMarkdownProse";

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: "flex-end",
}));

const drawerWidth = "300px";

const StyledDrawer = styled(Drawer)`
  flex-shrink: 0;
  & .MuiDrawer-paper {
    width: ${drawerWidth};
    box-sizing: border-box;
    max-width: ${drawerWidth};
  }
`;

const StyledTreeView = styled(TreeView)`
  height: 240px;
  flexgrow: 1;
  overflowy: hidden;
  max-width: ${drawerWidth};
`;

function createTree(backendUrl, handleClose) {
  const [oscalObjects, setOscalObjects] = useState({});

  useEffect(() => {
    Object.values(oscalObjectTypes).forEach((oscalObjectType) =>
      fetchAllResourcesOfType(backendUrl, oscalObjectType, (result) =>
        setOscalObjects((current) => ({
          ...current,
          [oscalObjectType.jsonRootName]: result,
        }))
      )
    );
  }, []);

  return (
    <StyledTreeView
      aria-label="file system navigator"
      defaultCollapseIcon={<ExpandMoreIcon />}
      defaultExpandIcon={<ChevronRightIcon />}
    >
      {Object.values(oscalObjectTypes).map((oscalObjectType, index) => (
        <TreeItem
          nodeId={index.toString()}
          label={<Typography noWrap>{`${oscalObjectType.name}s`}</Typography>}
          key={oscalObjectType.defaultUuid}
        >
          {oscalObjects[oscalObjectType.jsonRootName]
            ?.map((oscalObject) => oscalObject[oscalObjectType.jsonRootName])
            ?.map((oscalObject) => (
              <TreeItem
                nodeId={oscalObject.uuid}
                key={oscalObject.uuid}
                label={
                  <Link
                    to={`${oscalObjectType.jsonRootName}/${oscalObject.uuid}`}
                    onClick={handleClose}
                  >
                    <Typography noWrap><OSCALMarkdownProse text={oscalObject.metadata.title} /></Typography>
                  </Link>
                }
              />
            ))}
        </TreeItem>
      ))}
    </StyledTreeView>
  );
}

export default function OSCALDrawerSelector(props) {
  const theme = useTheme();

  return (
    <StyledDrawer variant="persistent" anchor="left" open={props.open}>
      <DrawerHeader>
        <IconButton onClick={props.handleClose}>
          {theme.direction === "ltr" ? (
            <ChevronLeftIcon />
          ) : (
            <ChevronRightIcon />
          )}
        </IconButton>
      </DrawerHeader>
      <Divider />
      {createTree(props.backendUrl, props.handleClose)}
      <Divider />
    </StyledDrawer>
  );
}
