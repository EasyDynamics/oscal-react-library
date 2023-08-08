import { Divider, Drawer, IconButton, Typography, styled, useTheme } from "@mui/material";
import React, { useEffect, useState } from "react";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import TreeView from "@mui/lab/TreeView";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import TreeItem from "@mui/lab/TreeItem";
import { Link } from "react-router-dom";
import { oscalObjectTypes } from "./oscal-utils/OSCALObjectData";
import { fetchAllResourcesOfType } from "./oscal-utils/OSCALRestUtils";
import { OSCALMarkupLine } from "./OSCALMarkupProse";
import { Oscal } from "@easydynamics/oscal-types";
import { OscalObjectWrapped } from "./oscal-utils/OSCALObjectData";

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

interface DocumentTreeProps {
  backendUrl?: string;
  handleClose: () => void;
}

export type OscalObjectList<T extends keyof Oscal> = Record<T, OscalObjectWrapped<T>[]>;
export type OscalObjects = OscalObjectList<keyof Oscal>;

export const DocumentTree: React.FC<DocumentTreeProps> = (props) => {
  const { backendUrl, handleClose } = props;
  const [oscalObjects, setOscalObjects] = useState({} as OscalObjects);

  useEffect(() => {
    Object.values(oscalObjectTypes).forEach((oscalObjectType) =>
      fetchAllResourcesOfType(backendUrl, oscalObjectType, (result) =>
        setOscalObjects((current) => ({
          ...current,
          [oscalObjectType.jsonRootName]: result,
        }))
      )
    );
  }, [backendUrl]);

  return (
    <StyledTreeView
      aria-label="file system navigator"
      defaultCollapseIcon={<ExpandMoreIcon />}
      defaultExpandIcon={<ChevronRightIcon />}
    >
      {Object.values(oscalObjectTypes).map(({ jsonRootName, name, defaultUuid }, index) => (
        <TreeItem
          nodeId={index.toString()}
          label={<Typography noWrap>{`${name}s`}</Typography>}
          key={defaultUuid}
        >
          {oscalObjects[jsonRootName]
            ?.map((oscalObject) => oscalObject[jsonRootName])
            ?.map((oscalObject) => (
              <TreeItem
                nodeId={oscalObject.uuid}
                key={oscalObject.uuid}
                label={
                  <Link to={`${jsonRootName}/${oscalObject.uuid}`} onClick={handleClose}>
                    <Typography noWrap>
                      <OSCALMarkupLine>{oscalObject.metadata.title}</OSCALMarkupLine>
                    </Typography>
                  </Link>
                }
              />
            ))}
        </TreeItem>
      ))}
    </StyledTreeView>
  );
};

export interface OSCALDrawerSelectorProps {
  backendUrl?: string;
  open: boolean;
  handleClose: () => void;
}

export const OSCALDrawerSelector: React.FC<OSCALDrawerSelectorProps> = (props) => {
  const theme = useTheme();

  return (
    <StyledDrawer variant="persistent" anchor="left" open={props.open}>
      <DrawerHeader>
        <IconButton onClick={props.handleClose}>
          {theme.direction === "ltr" ? <ChevronLeftIcon /> : <ChevronRightIcon />}
        </IconButton>
      </DrawerHeader>
      <Divider />
      <DocumentTree backendUrl={props.backendUrl} handleClose={props.handleClose} />
      <Divider />
    </StyledDrawer>
  );
};
