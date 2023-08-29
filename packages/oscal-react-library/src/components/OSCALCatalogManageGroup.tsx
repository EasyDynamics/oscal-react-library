import React, { useState, useEffect } from "react";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import SaveIcon from "@mui/icons-material/Save";
import { useFetchers } from "./Fetchers";
import { ReactComponent as DeleteIcon } from "./images/icons/delete.svg";
import { ReactComponent as FormatIndentDecreaseIcon } from "./images/icons/outdent.svg";
import { ReactComponent as FormatIndentIncreaseIcon } from "./images/icons/indent.svg";
import { ReactComponent as InsertIcon } from "./images/icons/insert.svg";
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Divider,
  Grid,
  IconButton,
  ListItemText,
  MenuItem,
  MenuList,
  TextField,
  Tooltip,
  TooltipProps,
  Typography,
  styled,
} from "@mui/material";

import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import { OSCALSecondaryButtonSmall } from "./styles/OSCALButtons";
import { EditableFieldProps } from "./OSCALEditableTextField";

const GroupTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} arrow classes={{ popper: className }} />
))`
  font-size: 20;
  box-shadow: 0px 0px 10px 0px #00000029;
`;

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

export interface OSCALProject {
  projectUUID: string;
}

interface Group extends EditableFieldProps {
  groupName: string;
  groupLabel: string;
  projectUUID: string;
  controls?: Array<any>;
  subGroups: Array<Group>;
  parent?: Group;
  indent: number;
  rightSibling?: Group;
  others: Array<any>;
}

interface OSCALGroup extends EditableFieldProps {
  group: Group;
}

export function GroupDrawer(data: OSCALProject) {
  const [items, setItems] = useState<Array<any>>([]);
  const [baseGroupObjects, setBaseGroupObjects] = useState<any[]>([]);

  const fetchers = useFetchers();
  const fetchTransaction = fetchers["fetchTransaction"];
  const fetchRest = fetchers["fetchRest"];

  const closedDrawerWidth = 55;
  const OpenDrawerWidth = 312;
  const expandedWidth = 952;
  const shrinkedWidth = 696;

  const [open, setOpen] = React.useState(false);
  const handleDrawerOpen = () => {
    setOpen(true);
  };
  let draggedGroups: Array<Group> = [];
  let Ids: string[] = [];
  const handleDrawerClose = () => {
    setOpen(false);
  };
  const handleDrawerOpenClose = () => {
    if (open) return handleDrawerClose();
    else return handleDrawerOpen();
  };

  const drawerWidth = open ? OpenDrawerWidth : closedDrawerWidth;
  const [addNewGroup, setAddNewGroup] = useState(false);
  const [selectedItemName, setSelectedItemName] = useState<string>("");
  const [selectedItemGroup, getSelectedGroup] = useState<Group>();
  const [showCardMenu, setShowCardMenu] = useState(false);
  const [itemYcoordinate, setItemYCoordinate] = useState(0);
  const [edit, setEdit] = useState(false);
  const [addBelow, setAddBelow] = useState(false);
  const [newGroupParent, setNewGroupParent] = useState<Group>();

  useEffect(() => {
    getData();
    RestGetGroups();
  }, []);

  function EditGroupTitle(ID: string, Name: string) {
    const rootFile = "projects/catalog_" + data.projectUUID + "/oscal_data.json";
    const request_json = {
      oscal_file: rootFile,
      id: ID,
      title: Name,
    };
    function addNewGroupSuccess(response: any) {
      console.log("successful addition of a new group", response);
    }
    function addNewGroupFail(e: any) {
      console.log("Fail to create a new group", e.statusText);
    }
    fetchTransaction("/edit_group_title", request_json, addNewGroupSuccess, addNewGroupFail);
  }
  function DeleteGroup(ID: string) {
    const id = ID === "" ? selectedItemGroup?.groupLabel : ID;
    const rootFile = "projects/catalog_" + data.projectUUID + "/oscal_data.json";
    const request_json = {
      oscal_file: rootFile,
      id: id,
    };
    function deleteGroupSuccess(response: any) {
      console.log("successful deletion of the group", id, response);
    }
    function deleteGroupFail(e: any) {
      console.log("Fail to delete the group", id, e.statusText);
    }
    fetchTransaction("/delete_id", request_json, deleteGroupSuccess, deleteGroupFail);
  }
  function SaveNewGroup(ID: string, Name: string, parentID: string) {
    const rootFile = "projects/catalog_" + data.projectUUID + "/oscal_data.json";
    const request_json = {
      oscal_file: rootFile,
      id: ID,
      title: Name,
      parent_id: parentID,
    };
    function addNewGroupSuccess(response: any) {
      console.log("successful addition of a new group", response);
    }
    function addNewGroupFail(e: any) {
      console.log("Fail to create a new group", e.statusText);
    }
    fetchTransaction("/add_group", request_json, addNewGroupSuccess, addNewGroupFail);
  }
  function RestGetGroups() {
    const request_json = {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    };
    const operation = "/catalog/" + data.projectUUID + "/catalog/groups";
    fetchRest(operation, request_json, getCatalogGroupsSuccess, getCatalogGroupsFail);

    function getCatalogGroupsSuccess(response: any) {
      console.log("In FilledBoxItem: Successfull REST CAll with path", operation);
      setBaseGroupObjects(response);
    }
    function getCatalogGroupsFail(e: any) {
      console.log("In FilledBoxItem: Operation fail ", e.statusText);
    }
  }
  console.log("All groups by REST", baseGroupObjects);
  const AllGroups: Array<Group> = baseGroupObjects.map((x) => ({
    groupName: x.title,
    groupLabel: x.id,
    projectUUID: data.projectUUID,
    subGroups: [],
    indent: 0,
    others: x.groups ?? [],
  }));
  const realGroups: Array<Group> = [];

  function listAllGroups() {
    for (let i = 0; i < AllGroups.length; i++) {
      listAllSubGroups(AllGroups[i]);
    }
  }
  function listAllSubGroups(group: Group) {
    const subs0: Array<Group> = group.others.map((x) => ({
      groupName: x.title,
      groupLabel: x.id,
      projectUUID: data.projectUUID,
      subGroups: [],
      parent: group,
      indent: group.indent + 10,
      others: x.groups ?? [],
    }));
    group.subGroups = subs0;
    for (let i = 0; i < subs0.length; i++) {
      realGroups.push(subs0[i]);
    }
  }
  console.log("New Groups", AllGroups);
  listAllGroups();
  console.log("all groups", realGroups);
  function MoveGroup(ID: string, Name: string, newParentID: string) {
    const rootFile = "projects/catalog_" + data.projectUUID + "/oscal_data.json";
    const request_json = {
      oscal_file: rootFile,
      id: ID,
      new_parent_id: newParentID,
    };
    function moveGroupSuccess(response: any) {
      console.log("successful addition of a new group", response);
    }
    function moveGroupFail(e: any) {
      console.log("Fail to create a new group", e.statusText);
    }
    fetchTransaction("/move_group", request_json, moveGroupSuccess, moveGroupFail);
  }
  function getGroups() {
    const rootFile = "projects/catalog_" + data.projectUUID + "/oscal_data.json";
    const request_json = {
      oscal_file: rootFile,
      parent_id: "",
    };

    fetchTransaction("/list_groups", request_json, getCatalogGroupsSuccess, getCatalogGroupsFail);
    function getCatalogGroupsSuccess(response: any) {
      console.log("In GroupDrawer: Successfull Transaction Call to get groups");
      setItems(response.groups);
      // console.log("results", items);
    }
    function getCatalogGroupsFail(e: any) {
      console.log("In GroupDrawer: Operation fail ", e.statusText);
    }
  }

  const groups: Array<Group> = items.map((x) => ({
    groupName: x.title,
    groupLabel: x.id,
    projectUUID: data.projectUUID,
    subGroups: [],
    indent: 0,
    others: [],
  }));
  function setSiblings(groups: Array<Group>) {
    let sibling: Group;
    if (groups.length === 0) return;

    sibling = groups[0];
    for (let i = 1; i < groups.length; i++) {
      groups[i].rightSibling = sibling;
      sibling = groups[i];
    }
  }
  setSiblings(groups);
  function getData() {
    getGroups();
  }

  function handleAddNewGroup() {
    setAddNewGroup(true);
  }

  const NewGroupDialog: React.FC = () => {
    function handleNewGroupClick() {
      setSelectedItemName("NewGroup");
    }
    // useEffect(() => {
    //   SaveNewGroup();
    // }, []);
    let ID = "";
    let Name = "";
    function handleEditIDChange(event: { target: { value: string | undefined } }) {
      ID = event.target.value ?? "";
    }
    function handleEditGroupNameChange(event: { target: { value: string } }) {
      Name = event.target.value;
    }
    function handleSaveNewGroup() {
      if (edit) {
        EditGroupTitle(ID, Name);
        setAddNewGroup(false);
        getData();
        return;
      }
      if (addBelow) {
        const parent_id = newGroupParent === undefined ? "" : newGroupParent.groupLabel;
        SaveNewGroup(ID, Name, parent_id);
        setAddNewGroup(false);
        getData();
      }
      SaveNewGroup(ID, Name, "");
      setAddNewGroup(false);
      getData();
    }
    function handleDeleteGroup() {
      DeleteGroup(ID);
      setAddNewGroup(false);
    }

    const isSelected = selectedItemName === "NewGroup" ? true : false;
    return (
      <Container
        onClick={handleNewGroupClick}
        sx={{ height: 73, border: "1px solid #D2D2D2", background: "#EAEAEA", width: 312 }}
      >
        <Container
          sx={{
            height: 73,
            left: 20,
            position: "absolute",
            background: "#F6F6F6",
            border: "1px solid #D2D2D2",
            width: 300,
          }}
        >
          <Grid sx={{ height: 73 }}>
            <Grid sx={{ height: 40 }}>
              <IconButton sx={{ left: 0, top: 2, position: "absolute" }}>
                <DragIndicatorIcon />
              </IconButton>
              <TextField
                size="small"
                label="ID"
                defaultValue={selectedItemGroup?.groupLabel}
                onChange={handleEditIDChange}
                sx={{
                  left: 32,
                  height: 35,
                  width: 52,
                  top: 5,
                  position: "absolute",
                  fontSize: 10,
                  fontWeight: 200,
                  background: "#ffffff",
                  "& .MuiOutlinedInput-root": {
                    "& > fieldset": {
                      borderColor: (theme: { palette: { secondary: { main: any } } }) =>
                        theme.palette.secondary.main,
                    },
                  },
                }}
              ></TextField>
              <TextField
                size="small"
                label="Group Name"
                onChange={handleEditGroupNameChange}
                defaultValue={selectedItemGroup?.groupName}
                sx={{
                  left: 88,
                  top: 5,
                  position: "absolute",
                  height: 32,
                  width: 198,
                  background: "#ffffff",
                  "& .MuiOutlinedInput-root": {
                    "& > fieldset": {
                      borderColor: (theme: { palette: { secondary: { main: any } } }) =>
                        theme.palette.secondary.main,
                    },
                  },
                }}
              ></TextField>
            </Grid>
            <Grid sx={{ height: 23, top: 58, position: "absolute" }} container spacing={2}>
              <Grid xs={5}></Grid>
              <Grid xs={7}>
                <IconButton
                  size="small"
                  sx={{
                    ":hover": {
                      backgroundColor: "#023E88",
                      color: "#FFFFFF",
                    },
                  }}
                >
                  <InsertIcon />
                </IconButton>
                <IconButton
                  size="small"
                  sx={{
                    ":hover": {
                      backgroundColor: "#023E88",
                      color: "#FFFFFF",
                    },
                  }}
                >
                  <FormatIndentDecreaseIcon />
                </IconButton>
                <IconButton
                  size="small"
                  sx={{
                    ":hover": {
                      backgroundColor: "#023E88",
                      color: "#FFFFFF",
                    },
                  }}
                >
                  <FormatIndentIncreaseIcon />
                </IconButton>
                <IconButton
                  size="small"
                  sx={{
                    ":hover": {
                      backgroundColor: "#ffffff",
                      color: "#FFFFFF",
                    },
                  }}
                  onClick={handleDeleteGroup}
                >
                  <DeleteIcon />
                </IconButton>
                <IconButton
                  size="small"
                  color="primary"
                  sx={{
                    color: "#023E88",
                    ":hover": {
                      backgroundColor: "#023E88",
                      color: "#FFFFFF",
                    },
                  }}
                  onClick={handleSaveNewGroup}
                >
                  <SaveIcon></SaveIcon>
                </IconButton>
              </Grid>
            </Grid>
          </Grid>
        </Container>
        <Box
          sx={{
            left: 313,
            width: 6,
            height: 73,
            position: "absolute",
            background: isSelected ? "#FF6600" : "#F6F6F6",
          }}
        ></Box>
      </Container>
    );
  };
  const RootLevel: React.FC = () => {
    function handleRootLevelClick() {
      setSelectedItemName("Root");
    }
    const rootSelected = selectedItemName === "Root" ? true : false;
    const text = open ? "Root Level Controls" : "RC";
    return (
      <Box
        sx={{
          background: "#F6F6F6",
          border: "1px solid #D2D2D2",
          height: 48,
        }}
        onClick={handleRootLevelClick}
      >
        <Typography
          sx={{ top: 135, left: 20, position: "absolute", fontWeight: rootSelected ? 700 : 500 }}
        >
          {text}
        </Typography>

        <Box
          sx={{
            left: open ? 312.5 : 56.5,
            width: 6,
            height: 48,
            position: "absolute",
            background: rootSelected ? "#FF6600" : "#F6F6F6",
          }}
        ></Box>
      </Box>
    );
  };
  const GroupItemMenuBar: React.FC<OSCALGroup> = (data) => {
    function handleEdit() {
      setEdit(true);
      setAddNewGroup(true);
      setShowCardMenu(false);
    }
    function handleDelete() {
      DeleteGroup(data.group.groupLabel);
      setShowCardMenu(false);
    }
    function handleAddBelow() {
      setAddNewGroup(true);
      setAddBelow(true);
      setNewGroupParent(data.group);
      setShowCardMenu(false);
    }
    function handleIncreaseIndent() {
      console.log("increasing indent of", data.group.groupName);
      if (data.group === undefined) {
        setShowCardMenu(false);
        return;
      }

      const sibling = data.group.rightSibling;
      if (sibling === undefined) {
        setShowCardMenu(false);
        return;
      }
      MoveGroup(data.group.groupLabel, data.group.groupName, sibling.groupLabel);
      // Reload the main data
      getData();
      setShowCardMenu(false);
    }
    function handleDecreaseIndent() {
      console.log("decreasing indent of", data.group.groupName);
      if (data.group === undefined) {
        setShowCardMenu(false);
        return;
      }

      const parent = data.group.parent;
      if (parent === undefined) {
        setShowCardMenu(false);
        return;
      }
      console.log("decreasing indent  with parent", data.group.parent);
      const real_parent = parent.parent ?? { groupLabel: "", groupName: "", subGroups: [] };
      MoveGroup(data.group.groupLabel, data.group.groupName, real_parent.groupLabel);
      // Reload the main data
      getData();
      setShowCardMenu(false);
    }
    return (
      <Card
        variant="outlined"
        sx={{ height: 200, left: 255, top: itemYcoordinate - 200, position: "absolute" }}
        elevation={2}
      >
        <CardContent>
          <MenuList>
            <MenuItem onClick={handleEdit}>
              <ListItemText>Edit Group</ListItemText>
            </MenuItem>
            <MenuItem>
              <ListItemText onClick={handleDelete}>Delete Group</ListItemText>
            </MenuItem>
            <MenuItem>
              <ListItemText onClick={handleAddBelow}>Add Group Below</ListItemText>
            </MenuItem>
            <MenuItem>
              <ListItemText onClick={handleIncreaseIndent}>Increase Indent</ListItemText>
            </MenuItem>
            <MenuItem>
              <ListItemText onClick={handleDecreaseIndent}>Decrease Indent</ListItemText>
            </MenuItem>
          </MenuList>
        </CardContent>
      </Card>
    );
  };
 

  const RecurentGroupItem: React.FC<OSCALGroup> = (data) => {
   // const [isDragged, setIsDragged] = useState(false);

    const handleDrop = (event: any) => {
      event.preventDefault();
      event.stopPropagation();
      event.target.style.border = "1px solid #D2D2D2";
    };

    const startDrag = (event: any) => {
      event.preventDefault();
      //setIsDragged(true);
    };
    const unitHeight = 48;

    const itemHeight = unitHeight;

    const CoreSubGroupItem: React.FC<OSCALGroup> = (datum) => {
      const [subItems, setSubItems] = useState<Array<any>>([]);
      const [startDraggedGroup, setStartDraggedGroup] = useState<Group>();
      const [DroppedGroup, setDroppedGroup] = useState<Group>();
      const [isDragged, setIsDragged] = useState(false);
      const [doneDropping, setEndDropping] = useState(false);
      const [draggingOver, setDraggingOver] = useState(false);

      function getSubGroups(parent_id: string, projectUUID: string) {
        const rootFile = "projects/catalog_" + projectUUID + "/oscal_data.json";
        const request_json = {
          oscal_file: rootFile,
          parent_id: parent_id,
        };

        fetchTransaction(
          "/list_groups",
          request_json,
          getCatalogGroupsSuccess,
          getCatalogGroupsFail
        );
        function getCatalogGroupsSuccess(response: any) {
          console.log("In GroupDrawer: Successfull Transaction Call to get groups");
          setSubItems(response.groups);
        }
        function getCatalogGroupsFail(e: any) {
          console.log("In GroupDrawer: Operation fail ", e.statusText);
        }
      }

      useEffect(() => {
        getSubGroups(datum.group.groupLabel, datum.group.projectUUID);
      }, [datum.group.groupLabel, datum.group.projectUUID]);

      const subGroups: Array<Group> = subItems.map((x) => ({
        groupName: x.title,
        groupLabel: x.id,
        projectUUID: datum.group.projectUUID,
        parent: datum.group,
        subGroups: [],
        indent: datum.group.indent + 10,
        others: [],
      }));
      setSiblings(subGroups);
      datum.group.subGroups = subGroups;
      console.log("group datum: ", datum, "subGroups:", datum.group.subGroups);
      const handleCardMenu = (event: any) => {
        setShowCardMenu(true);
        setItemYCoordinate(event.clientY);
      };

      function allowDrop(event: any) {
        event.preventDefault();
        event.target.style.border = "4px dotted green";
        const id = datum.group.groupLabel;
        if (!Ids.includes(id)) {
          Ids.push(id);
        }
        setDraggingOver(true);
      }
      function handleDragLeave(event: any) {
        event.preventDefault();
        event.stopPropagation();
        event.target.style.border = "1px solid #D2D2D2";
        setDraggingOver(false);
      }
      const endDragNDrop: React.DragEventHandler<HTMLDivElement> | undefined = (event: any) => {
        event.preventDefault();
        draggedGroups = [];
      };
      const startDrag = (event: any) => {
        draggedGroups = [];
        Ids = [];
        event.preventDefault();
        setStartDraggedGroup(datum.group);
        // console.log("start dragged id", startDraggedGroup?.groupLabel);
        // console.log("dragged data", event.dataTransfer);
        const id = datum.group.groupLabel;
        if (!Ids.includes(id)) {
          Ids.push(id);
          draggedGroups.push(datum.group);
        }
        setIsDragged(true);
      };
      const handleDrop = (event: any) => {
        event.preventDefault();
        event.stopPropagation();
        event.target.style.border = "1px solid #D2D2D2";
        setDroppedGroup(datum.group);
        setEndDropping(true);
      };

      if (datum.group.indent > 40) {
        //(isDragged ||
        return null;
      }
      console.log("droppedGroup is", DroppedGroup);
      console.log("Ids", Ids);
      if (doneDropping && draggedGroups?.length > 0) {
        const subGroup = draggedGroups[0];
        MoveGroup(subGroup.groupLabel, subGroup.groupName, datum.group.groupLabel);
        // update groups
        getData();
        subGroup.parent = datum.group;
        datum.group.subGroups?.push(subGroup);
        setSiblings(datum.group.subGroups);
      }
      if (datum.group.subGroups.length > 0) {
        return (
          <>
            {showCardMenu && <GroupItemMenuBar group={selectedItemGroup ?? defaultGroup} />}
            {datum.group.parent === undefined && (
              <Grid sx={{ height: 48 }} key={datum.group.groupLabel}>
                <Container
                  sx={{
                    height: 48,
                    left: open ? 20 + datum.group.indent : 8,
                    position: "absolute",
                    background: "#F6F6F6",
                    border: "1px solid #D2D2D2",
                    width: open ? 300 - datum.group.indent : 55,
                    ":hover": {
                      backgroundColor: "#EAEAEA",
                    },
                  }}
                  key={datum.group.groupLabel.toUpperCase()}
                  draggable="true"
                  onDrag={startDrag}
                  onDragOver={allowDrop}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onDragEnd={endDragNDrop}
                  onClick={() => {
                    setSelectedItemName(datum.group.groupName);
                    getSelectedGroup(datum.group);
                  }}
                >
                  {draggingOver && (
                    <Box
                      sx={{
                        height: 5,
                        left: 0,
                        width: open ? 295 - datum.group.indent : 55,
                        position: "absolute",
                        background: "#FF6600",
                      }}
                    ></Box>
                  )}
                  {open && (
                    <IconButton sx={{ left: 0, top: 2, position: "absolute" }}>
                      <DragIndicatorIcon />
                    </IconButton>
                  )}
                  <Box
                    sx={{
                      left: open ? 40 + datum.group.indent : 9,
                      height: 35,
                      width: 35,
                      top: 5,
                      border: "1px solid #000000",
                      position: "absolute",
                      background: "#002867",
                    }}
                  >
                    <Typography
                      sx={{
                        fontFamily: "Source Sans Pro",
                        color: "#ffffff",
                        left: 5,
                        top: 5,
                        position: "absolute",
                      }}
                    >
                      {datum.group.groupLabel.toUpperCase().substring(0, 2)}
                    </Typography>
                  </Box>
                  {open && (
                    <GroupTooltip title={datum.group.groupName}>
                      <Typography
                        sx={{
                          left: 89 + datum.group.indent,
                          top: 10,
                          position: "absolute",
                          fontSize: 14,
                          fontWeight: selectedItemName === datum.group.groupName ? 700 : 500,
                        }}
                      >
                        {datum.group.groupName.length < 20
                          ? datum.group.groupName
                          : datum.group.groupName.substring(0, 19) + "..."}
                      </Typography>
                    </GroupTooltip>
                  )}
                  {open && (
                    <IconButton
                      sx={{ left: 260 - datum.group.indent, top: 2, position: "absolute" }}
                      onClick={handleCardMenu}
                    >
                      <MoreVertIcon />
                    </IconButton>
                  )}
                  <Box
                    sx={{
                      left: open ? 292.5 - datum.group.indent : 48,
                      width: 6,
                      height: 48,
                      position: "absolute",
                      background:
                        selectedItemName === datum.group.groupName ? "#FF6600" : "#F6F6F6",
                    }}
                  ></Box>{" "}
                </Container>
                {/* <CoreGroupItem group={subGroup}></CoreGroupItem> */}
              </Grid>
            )}
            {datum.group.subGroups.map((subGroup) => (
              <>
                <Grid sx={{ height: 48 }} key={subGroup.groupLabel}>
                  <Container
                    sx={{
                      height: 48,
                      left: open ? 20 + subGroup.indent : 8,
                      position: "absolute",
                      background: "#F6F6F6",
                      border: "1px solid #D2D2D2",
                      width: open ? 300 - subGroup.indent : 55,
                      ":hover": {
                        backgroundColor: "#EAEAEA",
                      },
                    }}
                    key={subGroup.groupLabel.toUpperCase()}
                    draggable="true"
                    onDrag={startDrag}
                    onDragOver={allowDrop}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onDragEnd={endDragNDrop}
                    onClick={() => {
                      setSelectedItemName(subGroup.groupName);
                      getSelectedGroup(subGroup);
                    }}
                  >
                    {draggingOver && (
                      <Box
                        sx={{
                          height: 5,
                          left: 0,
                          width: open ? 295 - subGroup.indent : 55,
                          position: "absolute",
                          background: "#FF6600",
                        }}
                      ></Box>
                    )}
                    {open && (
                      <IconButton sx={{ left: 0, top: 2, position: "absolute" }}>
                        <DragIndicatorIcon />
                      </IconButton>
                    )}
                    <Box
                      sx={{
                        left: open ? 40 + subGroup.indent : 9,
                        height: 35,
                        width: 35,
                        top: 5,
                        border: "1px solid #000000",
                        position: "absolute",
                        background: "#002867",
                      }}
                    >
                      <Typography
                        sx={{
                          fontFamily: "Source Sans Pro",
                          color: "#ffffff",
                          left: 5,
                          top: 5,
                          position: "absolute",
                        }}
                      >
                        {subGroup.groupLabel.toUpperCase().substring(0, 2)}
                      </Typography>
                    </Box>
                    {open && (
                      <GroupTooltip title={subGroup.groupName}>
                        <Typography
                          sx={{
                            left: 89 + subGroup.indent,
                            top: 10,
                            position: "absolute",
                            fontSize: 14,
                            fontWeight: selectedItemName === subGroup.groupName ? 700 : 500,
                          }}
                        >
                          {subGroup.groupName.length < 20
                            ? subGroup.groupName
                            : subGroup.groupName.substring(0, 19) + "..."}
                        </Typography>
                      </GroupTooltip>
                    )}
                    {open && (
                      <IconButton
                        sx={{ left: 260 - subGroup.indent, top: 2, position: "absolute" }}
                        onClick={handleCardMenu}
                      >
                        <MoreVertIcon />
                      </IconButton>
                    )}
                    <Box
                      sx={{
                        left: open ? 292.5 - subGroup.indent : 48,
                        width: 6,
                        height: 48,
                        position: "absolute",
                        background: selectedItemName === subGroup.groupName ? "#FF6600" : "#F6F6F6",
                      }}
                    ></Box>{" "}
                  </Container>
                  {/* <CoreGroupItem group={subGroup}></CoreGroupItem> */}
                </Grid>
                <CoreSubGroupItem group={subGroup} key={subGroup.groupLabel}></CoreSubGroupItem>
                {showCardMenu && <GroupItemMenuBar group={selectedItemGroup ?? defaultGroup} />}
              </>
            ))}
          </>
        );
      } else
        return (
          <>
            {datum.group.parent === undefined && (
              <Grid sx={{ height: 48 }} key={datum.group.groupLabel}>
                <Container
                  sx={{
                    height: 48,
                    left: open ? 20 + datum.group.indent : 8,
                    position: "absolute",
                    background: "#F6F6F6",
                    border: "1px solid #D2D2D2",
                    width: open ? 300 - datum.group.indent : 55,
                    ":hover": {
                      backgroundColor: "#EAEAEA",
                    },
                  }}
                  key={datum.group.groupLabel.toUpperCase()}
                  draggable="true"
                  onDrag={startDrag}
                  onDragOver={allowDrop}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onDragEnd={endDragNDrop}
                  onClick={() => {
                    setSelectedItemName(datum.group.groupName);
                    getSelectedGroup(datum.group);
                  }}
                >
                  {draggingOver && (
                    <Box
                      sx={{
                        height: 5,
                        left: 0,
                        width: open ? 295 - datum.group.indent : 55,
                        position: "absolute",
                        background: "#FF6600",
                      }}
                    ></Box>
                  )}
                  {open && (
                    <IconButton sx={{ left: 0, top: 2, position: "absolute" }}>
                      <DragIndicatorIcon />
                    </IconButton>
                  )}
                  <Box
                    sx={{
                      left: open ? 40 + datum.group.indent : 9,
                      height: 35,
                      width: 35,
                      top: 5,
                      border: "1px solid #000000",
                      position: "absolute",
                      background: "#002867",
                    }}
                  >
                    <Typography
                      sx={{
                        fontFamily: "Source Sans Pro",
                        color: "#ffffff",
                        left: 5,
                        top: 5,
                        position: "absolute",
                      }}
                    >
                      {datum.group.groupLabel.toUpperCase().substring(0, 2)}
                    </Typography>
                  </Box>
                  {open && (
                    <GroupTooltip title={datum.group.groupName}>
                      <Typography
                        sx={{
                          left: 89 + datum.group.indent,
                          top: 10,
                          position: "absolute",
                          fontSize: 14,
                          fontWeight: selectedItemName === datum.group.groupName ? 700 : 500,
                        }}
                      >
                        {datum.group.groupName.length < 20
                          ? datum.group.groupName
                          : datum.group.groupName.substring(0, 19) + "..."}
                      </Typography>
                    </GroupTooltip>
                  )}
                  {open && (
                    <IconButton
                      sx={{ left: 260 - datum.group.indent, top: 2, position: "absolute" }}
                      onClick={handleCardMenu}
                    >
                      <MoreVertIcon />
                    </IconButton>
                  )}
                  <Box
                    sx={{
                      left: open ? 292.5 - datum.group.indent : 48,
                      width: 6,
                      height: 48,
                      position: "absolute",
                      background:
                        selectedItemName === datum.group.groupName ? "#FF6600" : "#F6F6F6",
                    }}
                  ></Box>{" "}
                </Container>
                {/* <CoreGroupItem group={subGroup}></CoreGroupItem> */}
                {showCardMenu && <GroupItemMenuBar group={selectedItemGroup ?? defaultGroup} />}
              </Grid>
            )}
          </>
        );
    };

    // if (isDragged) return null;

    return (
      <>
        <Container
          sx={{
            minHeight: itemHeight,
            border: "1px solid #D2D2D2",
            background: "#EAEAEA",
            width: drawerWidth,
          }}
          draggable={true}
          onDrag={startDrag}
          onDrop={handleDrop}
        >
          <CoreSubGroupItem group={data.group}></CoreSubGroupItem>
        </Container>
        {showCardMenu && <GroupItemMenuBar group={selectedItemGroup ?? defaultGroup} />}
      </>
    );
  };

  const NewGroupButton: React.FC = () => {
    const text = open ? " NEW GROUP +" : "+";
    return (
      <>
        <Box sx={{ height: 2 }}></Box>
        <Grid container direction="row" sx={{ height: 20, width: open ? 312 : 15 }}>
          <Grid sx={{ width: open ? 161 : 35 }}></Grid>
          <Grid sx={{ width: open ? 143 : 15 }}>
            <Button
              variant="outlined"
              color="primary"
              disableElevation
              sx={{
                height: 20,
                width: open ? 150 : 10,
                ":hover": {
                  backgroundColor: "#023E88",
                  color: "#FFFFFF",
                },
              }}
              disabled={addNewGroup}
              onClick={handleAddNewGroup}
            >
              <Typography sx={{ size: 12, fontWeight: 600, font: "Source Sans Pro" }}>
                {text}
              </Typography>
            </Button>
          </Grid>
        </Grid>
      </>
    );
  };
  const defaultGroup: Group = {
    groupLabel: "",
    groupName: "",
    projectUUID: "",
    subGroups: [],
    indent: 0,
    others: [],
  };
  return (
    <>
      <Grid container spacing={2} direction={"row"}>
        <Grid
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            whiteSpace: "nowrap",
            boxSizing: "border-box",
          }}
        >
          <Box component="main">
            <DrawerHeader sx={{ background: "#002867" }}>
              {open && (
                <Typography sx={{ color: "#ffffff", left: 20, position: "absolute" }}>
                  GROUPS
                </Typography>
              )}
              <IconButton onClick={handleDrawerOpenClose} sx={{ color: "#ffffff" }}>
                <KeyboardDoubleArrowLeftIcon />{" "}
              </IconButton>
            </DrawerHeader>
            <RootLevel></RootLevel>
            <Divider />
            {/* {groups.map((item) => (
              <GroupItem group={item} key={item.groupName}></GroupItem>
            ))} */}
            {groups.map((item) => (
              <RecurentGroupItem group={item} key={item.groupName}></RecurentGroupItem>
            ))}
            {addNewGroup && open && <NewGroupDialog></NewGroupDialog>}
            <NewGroupButton></NewGroupButton>
          </Box>
        </Grid>
        <Grid container={true} sx={{ width: open ? shrinkedWidth : expandedWidth }}>
          <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
            <Typography
              sx={{
                top: 78,
                position: "absolute",
                fontFamily: "Source Sans Pro",
                fontSize: "20px",
                fontWeight: 700,
                lineHeight: "25px",
                letterSpacing: "0em",
                color: "#002867",
              }}
            >
              {" "}
              {selectedItemName}
            </Typography>
            <Container
              sx={{
                height: 48,
                border: "1px solid #D2D2D266",
                top: 125,
                width: open ? 670 : 910,
                position: "absolute",
              }}
            ></Container>
            <Grid
              container
              direction="row"
              sx={{
                height: 30,
                top: 180,
                position: "absolute",
              }}
            >
              <Grid sx={{ width: open ? 505 : 745 }}></Grid>
              <Grid>
                {" "}
                <OSCALSecondaryButtonSmall sx={{ position: "absolute", height: 20 }}>
                  NEW CONTROL +
                </OSCALSecondaryButtonSmall>{" "}
              </Grid>
            </Grid>
          </Box>
        </Grid>
      </Grid>
      {showCardMenu && <GroupItemMenuBar group={selectedItemGroup ?? defaultGroup} />}
    </>
  );
}

export default GroupDrawer;
