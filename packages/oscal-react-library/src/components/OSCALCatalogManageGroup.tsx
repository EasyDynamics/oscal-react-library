import React, { useState, useEffect } from "react";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import SaveIcon from "@mui/icons-material/Save";
import { useFetchers } from "./Fetchers";
import { ReactComponent as DeleteIcon } from "./images/icons/delete.svg";
import { ReactComponent as FormatIndentDecreaseIcon } from "./images/icons/outdent.svg";
import { ReactComponent as FormatIndentIncreaseIcon } from "./images/icons/indent.svg";
import { ReactComponent as InsertIcon } from "./images/icons/insert.svg";
import { ReactComponent as ErrorIcon } from "./images/icons/iconmonstr-error-lined.svg";
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
import { EditableFieldProps } from "./OSCALEditableTextField";
import {
  OSCALPrimaryDestructiveButton,
  OSCALSecondaryButton,
  OSCALTertiaryButton,
} from "./styles/OSCALButtons";
import { OSCALDialogTitle, OSCALWarningDialog } from "./styles/OSCALDialog";

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
  groupTitle: string;
  groupID: string;
  projectUUID: string;
  controls?: Array<any>;
  subGroups: Array<Group>;
  parentID: string;
  indent: number;
  rightSibling?: Group;
  others: Array<any>;
}

interface OSCALGroup extends EditableFieldProps {
  group: Group;
}

function generateUUID() {
  // Public Domain/MIT
  let d = new Date().getTime(); //Timestamp
  let d2 = (typeof performance !== "undefined" && performance.now && performance.now() * 1000) || 0; //Time in microseconds since page-load or 0 if unsupported
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    let r = Math.random() * 16; //random number between 0 and 16
    if (d > 0) {
      //Use timestamp until depleted
      r = (d + r) % 16 | 0;
      d = Math.floor(d / 16);
    } else {
      //Use microseconds since page-load if supported
      r = (d2 + r) % 16 | 0;
      d2 = Math.floor(d2 / 16);
    }
    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
}

export function GroupDrawer(data: OSCALProject) {
  const [baseGroups, setBaseGroups] = useState<Array<any>>([]);

  const fetchers = useFetchers();
  const fetchTransaction = fetchers["fetchTransaction"];

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
  const [editGroup, setEditGroup] = useState<Group>();
  const [addBelow, setAddBelow] = useState(false);
  const [newGroupParent, setNewGroupParent] = useState<Group>();
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  useEffect(() => {
    getData();
  }, []);

  const groupsAndSubs: Array<Group> = baseGroups.map((x) => ({
    groupTitle: x.title,
    groupID: x.id,
    projectUUID: data.projectUUID,
    parentID: x.parent_id,
    subGroups: [],
    indent: 0,
    others: [],
  }));

  const orderGroups: Array<Group> = [];
  function reorderGroupsAndSetIndent() {
    const parent_ids: Array<string> = [];
    groupsAndSubs.forEach((elt) => {
      if (!orderGroups.includes(elt)) {
        if (elt.parentID === "") {
          elt.indent = 0;
          orderGroups.push(elt);
          parent_ids.push(elt.groupID);
        }
      }
    });

    console.log(" order len ", orderGroups.length, " : all group len ", groupsAndSubs.length);
    let depth = 0;
    while (depth < 5) {
      groupsAndSubs.forEach((elt) => {
        if (!orderGroups.includes(elt)) {
          if (parent_ids.includes(elt.parentID)) {
            const index = orderGroups.findIndex((parent) => parent.groupID === elt.parentID);
            if (index >= 0) {
              elt.indent = orderGroups[index].indent + 10;
              orderGroups[index].subGroups.push(elt);
              if (index + 1 >= orderGroups.length) {
                orderGroups.push(elt);
                parent_ids.push(elt.groupID);
              } else {
                orderGroups.splice(index + 1, 0, elt);
                parent_ids.push(elt.groupID);
              }
            }
          }
        }
      });
      depth = depth + 1;
    }
    console.log(" order len ", orderGroups.length, " : all group len ", groupsAndSubs.length);
  }

  reorderGroupsAndSetIndent();

  orderGroups.forEach((elt) => {
    setSiblings(elt.subGroups);
  });

  const orphans = orderGroups.filter((elt) => elt.parentID === "");
  if (orphans.length > 0) {
    let sibling = orphans[0];
    for (let i = 1; i < orphans.length; i++) {
      orphans[i].rightSibling = sibling;
      sibling = orphans[i];
    }
  }

  console.log("fin groups after parents :", groupsAndSubs);
  console.log("ordered groups  after parents", orderGroups);
  console.log("orphans", orphans);

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
    const id = ID === "" ? selectedItemGroup?.groupID : ID;
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

  function getGroupsAndSubs() {
    const rootFile = "projects/catalog_" + data.projectUUID + "/oscal_data.json";
    const request_json = {
      oscal_file: rootFile,
    };

    fetchTransaction(
      "/list_all_groups",
      request_json,
      getCatalogGroupsSuccess,
      getCatalogGroupsFail
    );
    function getCatalogGroupsSuccess(response: any) {
      console.log("In GroupDrawer: Successfull Transaction Call to get groups");
      setBaseGroups(response.groups);
    }
    function getCatalogGroupsFail(e: any) {
      console.log("In GroupDrawer: Operation fail ", e.statusText);
    }
  }

  function setSiblings(groups: Array<Group>) {
    if (groups.length === 0) return;

    for (let i = 0; i < groups.length - 1; i++) {
      groups[i].rightSibling = groups[i + 1];
    }
  }
  function getData() {
    getGroupsAndSubs();
  }

  function handleAddNewGroup() {
    setAddNewGroup(true);
  }

  const DeleteDialog: React.FC<OSCALGroup> = (data) => {
    function handleClose() {
      setOpenDeleteDialog(false);
    }
    const text = 'Type "delete" to confirm';
    let statement = "";
    function handleDeleteText(event: { target: { value: string | undefined } }) {
      statement = event.target.value ?? "";
    }
    function handleDelete() {
      if (statement.toLocaleLowerCase() === "delete") {
        DeleteGroup(data.group.groupID);
      }
      setOpenDeleteDialog(false);
    }
    return (
      <OSCALWarningDialog
        open={openDeleteDialog}
        onClose={handleClose}
        sx={{ width: 531, height: 500, position: "absolute", left: 500, top: 450 }}
        overflow={false}
      >
        <OSCALDialogTitle title={"Delete this Group?"} onClose={handleClose}>
          <Typography>You cannot undo this action</Typography>
        </OSCALDialogTitle>
        <IconButton sx={{ top: 15, position: "absolute" }}>
          <ErrorIcon />
        </IconButton>
        {/* <Typography
          sx={{
            top: 15,
            left: 50,
            position: "absolute",
            fontFamily: "Source Sans Pro",
            fontWeight: 700,
          }}>
            Delete this Group?
        </Typography> */}

        {/* <OSCALTextField
          label={text}
          id={"delete"}
          onChange={}
          small
          sx={{ width: 180 }}
        ></OSCALTextField> */}
        <Typography>{text}</Typography>
        <TextField
          size="small"
          label={text}
          fullWidth
          id={"address line 1"}
          onChange={handleDeleteText}
          sx={{
            left: 100,
            width: 200,
          }}
        ></TextField>
        <Container sx={{ left: 100, top: 200, position: "absolute" }}>
          <Grid spacing={1}>
            <OSCALTertiaryButton sx={{ width: 57, height: 36 }} onClick={handleClose}>
              {" "}
              <Typography> CANCEL </Typography>{" "}
            </OSCALTertiaryButton>
            <OSCALPrimaryDestructiveButton sx={{ width: 170, height: 36 }} onClick={handleDelete}>
              <Typography> DELETE GROUP</Typography>
            </OSCALPrimaryDestructiveButton>
          </Grid>
        </Container>
      </OSCALWarningDialog>
    );
  };
  const GroupDialog: React.FC<OSCALGroup> = (data) => {
    function handleNewGroupClick() {
      setSelectedItemName("NewGroup");
    }
    const selectedGroup = data.group;
    let ID = "";
    let Name = "";
    let preID = "";
    function handleEditIDChange(event: { target: { value: string | undefined } }) {
      preID = event.target.value ?? "";
      ID = preID + "_" + generateUUID();
    }
    function handleEditgroupTitleChange(event: { target: { value: string } }) {
      Name = event.target.value;
    }
    function handleAddBelow() {
      setAddNewGroup(true);
      setAddBelow(true);
      setNewGroupParent(selectedGroup);
      handleSaveNewGroup();
      setShowCardMenu(false);
    }
    function handleIncreaseIndent() {
      const sibling = selectedGroup.rightSibling;
      if (sibling === undefined) {
        setShowCardMenu(false);
        return;
      }
      MoveGroup(selectedGroup.groupID, selectedGroup.groupTitle, sibling.groupID);
      // Reload the main data
      getData();
      setShowCardMenu(false);
    }
    function handleDecreaseIndent() {
      const parentID = selectedGroup.parentID;
      if (parentID === undefined) {
        setShowCardMenu(false);
        return;
      }

      const parent = orderGroups.find((x) => x.groupID === parentID) ?? defaultGroup;
      const new_parent_id = parent.parentID;

      MoveGroup(selectedGroup.groupID, selectedGroup.groupTitle, new_parent_id);
      // Reload the main data
      getData();
      setShowCardMenu(false);
    }
    function handleSaveNewGroup() {
      if (edit && !addBelow) {
        EditGroupTitle(selectedGroup.groupID, Name);
        setAddNewGroup(false);
        getData();
        setEditGroup(defaultGroup);
        return;
      }
      if (Name.length < 1) return;
      if (preID === "") {
        ID = Name.substring(0, 1) + ID;
      }
      if (addBelow) {
        const parent_id = newGroupParent === undefined ? "" : newGroupParent.groupID;
        SaveNewGroup(ID, Name, parent_id);
        setAddNewGroup(false);
        getData();
        setAddBelow(false);
        return;
      }
      SaveNewGroup(ID, Name, "");
      setAddNewGroup(false);
      getData();
    }
    function handleDeleteGroup() {
      //setOpenDeleteDialog(true);
      DeleteGroup(selectedGroup.groupID);
      getData();
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
                defaultValue={addBelow ? undefined : selectedItemGroup?.groupID.substring(0, 2)}
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
                onChange={handleEditgroupTitleChange}
                defaultValue={addBelow ? undefined : selectedItemGroup?.groupTitle}
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
                  onClick={handleAddBelow}
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
                  onClick={handleDecreaseIndent}
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
                  onClick={handleIncreaseIndent}
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
      setEditGroup(data.group);
      setShowCardMenu(false);
    }
    function handleDelete() {
      //setOpenDeleteDialog(true);
      DeleteGroup(data.group.groupID);
      setAddNewGroup(false);
      getData();
      setShowCardMenu(false);
    }
    function handleAddBelow() {
      setAddNewGroup(true);
      setAddBelow(true);
      setNewGroupParent(data.group);
      setEditGroup(data.group);
      getData();
      setShowCardMenu(false);
    }
    function handleIncreaseIndent() {
      console.log("increasing indent of", data.group.groupTitle);
      if (data.group === undefined) {
        setShowCardMenu(false);
        return;
      }

      const sibling = data.group.rightSibling;
      if (sibling === undefined) {
        setShowCardMenu(false);
        return;
      }
      MoveGroup(data.group.groupID, data.group.groupTitle, sibling.groupID);
      // Reload the main data
      getData();
      setShowCardMenu(false);
    }
    function handleDecreaseIndent() {
      console.log("decreasing indent of", data.group.groupTitle);
      if (data.group === undefined) {
        setShowCardMenu(false);
        return;
      }

      const parentID = data.group.parentID;
      if (parentID === undefined) {
        setShowCardMenu(false);
        return;
      }
      const parent = orderGroups.find((x) => x.groupID === parentID) ?? defaultGroup;
      const new_parent_id = parent.parentID;
      console.log("decreasing indent  with parent", data.group.parentID);
      MoveGroup(data.group.groupID, data.group.groupTitle, new_parent_id);
      // Reload the main data
      getData();
      setShowCardMenu(false);
    }
    return (
      <Card
        variant="outlined"
        sx={{ height: 250, left: 315, top: itemYcoordinate - 200, position: "absolute" }}
        elevation={2}
      >
        <CardContent>
          <MenuList>
            <MenuItem onClick={handleEdit}>
              <ListItemText>Edit Group</ListItemText>
            </MenuItem>
            <MenuItem>
              <IconButton size="small">
                <DeleteIcon></DeleteIcon>
              </IconButton>
              <ListItemText onClick={handleDelete}>Delete Group</ListItemText>
            </MenuItem>
            <MenuItem>
              <IconButton size="small">
                <InsertIcon></InsertIcon>
              </IconButton>
              <ListItemText onClick={handleAddBelow}>Add Group Below</ListItemText>
            </MenuItem>
            <MenuItem>
              <IconButton size="small">
                <FormatIndentIncreaseIcon></FormatIndentIncreaseIcon>
              </IconButton>
              <ListItemText onClick={handleIncreaseIndent}>Increase Indent</ListItemText>
            </MenuItem>
            <MenuItem>
              <IconButton size="small">
                <FormatIndentDecreaseIcon></FormatIndentDecreaseIcon>
              </IconButton>
              <ListItemText onClick={handleDecreaseIndent}>Decrease Indent</ListItemText>
            </MenuItem>
          </MenuList>
        </CardContent>
      </Card>
    );
  };

  const GroupItem: React.FC<OSCALGroup> = (data) => {
    const [isDragged, setIsDragged] = useState(false);
    const [DroppedGroup, setDroppedGroup] = useState<Group>();
    const [doneDropping, setEndDropping] = useState(false);
    const [draggingOver, setDraggingOver] = useState(false);

    const unitHeight = 48;

    const itemHeight = unitHeight;

    const handleCardMenu = (event: any) => {
      setShowCardMenu(true);
      setItemYCoordinate(event.clientY);
    };

    function allowDrop(event: any) {
      event.preventDefault();
      event.target.style.border = "4px dotted green";
      const id = data.group.groupID;
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

      const id = data.group.groupID;
      if (!Ids.includes(id)) {
        Ids.push(id);
        draggedGroups.push(data.group);
      }
      setIsDragged(true);
    };
    const handleDrop = (event: any) => {
      event.preventDefault();
      event.stopPropagation();
      event.target.style.border = "1px solid #D2D2D2";
      setDroppedGroup(data.group);
      setEndDropping(true);
    };

    if (data.group.indent > 40) {
      return null;
    }
    console.log("droppedGroup is", DroppedGroup);
    console.log("Ids", Ids);
    if (doneDropping && draggedGroups?.length > 0) {
      const subGroup = draggedGroups[0];
      MoveGroup(subGroup.groupID, subGroup.groupTitle, data.group.groupID);
      // update groups
      getData();
      subGroup.parentID = data.group.parentID;
      data.group.subGroups?.push(subGroup);
      setSiblings(data.group.subGroups);
    }
    if (isDragged) return null;

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
          <Grid sx={{ height: 48 }} key={data.group.groupID}>
            <Container
              sx={{
                height: 48,
                left: open ? 20 + data.group.indent : 8,
                position: "absolute",
                background: "#F6F6F6",
                border: "1px solid #D2D2D2",
                width: open ? 300 - data.group.indent : 55,
                ":hover": {
                  backgroundColor: "#EAEAEA",
                },
              }}
              key={data.group.groupID.toUpperCase()}
              draggable="true"
              onDrag={startDrag}
              onDragOver={allowDrop}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onDragEnd={endDragNDrop}
              onClick={() => {
                setSelectedItemName(data.group.groupTitle);
                getSelectedGroup(data.group);
              }}
            >
              {draggingOver && (
                <Box
                  sx={{
                    height: 5,
                    left: 0,
                    width: open ? 295 - data.group.indent : 55,
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
                  left: open ? 40 : 9,
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
                  {data.group.groupID.toUpperCase().substring(0, 2)}
                </Typography>
              </Box>
              {open && (
                <GroupTooltip title={data.group.groupTitle}>
                  <Typography
                    sx={{
                      left: 89,
                      top: 10,
                      position: "absolute",
                      fontSize: 14,
                      fontWeight: selectedItemName === data.group.groupTitle ? 700 : 500,
                    }}
                  >
                    {data.group.groupTitle.length < 20
                      ? data.group.groupTitle
                      : data.group.groupTitle.substring(0, 19) + "..."}
                  </Typography>
                </GroupTooltip>
              )}
              {open && (
                <IconButton
                  sx={{ left: 260 - data.group.indent, top: 2, position: "absolute" }}
                  onClick={handleCardMenu}
                >
                  <MoreVertIcon />
                </IconButton>
              )}
              <Box
                sx={{
                  left: open ? 292.5 - data.group.indent : 48,
                  width: 6,
                  height: 48,
                  position: "absolute",
                  background: selectedItemName === data.group.groupTitle ? "#FF6600" : "#F6F6F6",
                }}
              ></Box>{" "}
            </Container>
          </Grid>
        </Container>

        {showCardMenu && <GroupItemMenuBar group={selectedItemGroup ?? defaultGroup} />}
        {open && editGroup?.groupID === data.group.groupID && (edit || addBelow) && (
          <GroupDialog group={selectedItemGroup ?? defaultGroup}></GroupDialog>
        )}
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
    groupID: "",
    groupTitle: "",
    projectUUID: "",
    subGroups: [],
    indent: 0,
    parentID: "",
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
            {orderGroups.map((item) => (
              <GroupItem group={item} key={item.groupTitle}></GroupItem>
            ))}
            {addNewGroup && open && !edit && !addBelow && (
              <GroupDialog group={defaultGroup}></GroupDialog>
            )}
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
                <OSCALSecondaryButton sx={{ position: "absolute", height: 20 }}>
                  NEW CONTROL +
                </OSCALSecondaryButton>{" "}
              </Grid>
            </Grid>
          </Box>
        </Grid>
      </Grid>
      {showCardMenu && <GroupItemMenuBar group={selectedItemGroup ?? defaultGroup} />}
      <DeleteDialog group={selectedItemGroup ?? defaultGroup}></DeleteDialog>
    </>
  );
}

export default GroupDrawer;
