import React, { useState, useEffect, useRef } from "react";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import SaveIcon from "@mui/icons-material/Save";
import EditIcon from "@mui/icons-material/Edit";
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
  DialogContent,
  Divider,
  Grid,
  Stack,
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
import { Group, OSCALGroup, ControlManager } from "./OSCALCatalogManageControl";
import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import { OSCALPrimaryDestructiveButton, OSCALTertiaryButton } from "./styles/OSCALButtons";
import { OSCALDialogActions, OSCALDialogTitle, OSCALWarningDialog } from "./styles/OSCALDialog";
import { OSCALTextField } from "./styles/OSCALInputs";

const GroupTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} arrow classes={{ popper: className }} />
))(({ theme }) => ({
  fontSize: 20,
  boxShadow: `0px 0px 10px 0px ${theme.palette.smokyWhite.main}`,
}));

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
interface RefObject {
  clickMe: () => void;
}

export function GroupDrawer(data: OSCALProject) {
  const [baseGroups, setBaseGroups] = useState<Array<any>>([]);

  const fetchers = useFetchers();
  const fetchTransaction = fetchers["fetchTransaction"];

  const closedDrawerWidth = 55;
  const OpenDrawerWidth = 312;

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

  const defaultGroup: Group = {
    groupID: "",
    groupTitle: "Root",
    projectUUID: data.projectUUID,
    subGroups: [],
    indent: 0,
    parentID: "",
  };
  const drawerWidth = open ? OpenDrawerWidth : closedDrawerWidth;
  const [addNewGroup, setAddNewGroup] = useState(false);
  const [selectedItemName, setSelectedItemName] = useState<string>("");
  const [selectedItemGroup, getSelectedGroup] = useState<Group>(defaultGroup);
  const [showCardMenu, setShowCardMenu] = useState(false);
  const [itemYcoordinate, setItemYCoordinate] = useState(0);
  const [edit, setEdit] = useState(false);
  const [editGroup, setEditGroup] = useState<Group>();
  const [addBelow, setAddBelow] = useState(false);
  const [newGroupParent, setNewGroupParent] = useState<Group>();
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const previousSelectedItemName = useRef<string>("");
  useEffect(() => {
    previousSelectedItemName.current = selectedItemName;
  }, [selectedItemName]);

  useEffect(() => {
    getData();
  }, []);

  const inputElement = useRef<RefObject>();

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

    let depth = 0;
    while (depth < 8) {
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

  function editGroupTitle(ID: string, Name: string) {
    const rootFile = "projects/catalog_" + data.projectUUID + "/oscal_data.json";
    const request_json = {
      oscal_file: rootFile,
      id: ID,
      title: Name,
    };
    function addNewGroupSuccess(response: any) {
      console.log("Successful addition of a new group", response);
    }
    function addNewGroupFailed(e: any) {
      console.log("Failed to create a new group", e.statusText, " with request ", request_json);
    }
    fetchTransaction("/edit_group_title", request_json, addNewGroupSuccess, addNewGroupFailed);
  }
  function deleteGroup(ID: string) {
    const id = ID === "" ? selectedItemGroup?.groupID : ID;
    const rootFile = "projects/catalog_" + data.projectUUID + "/oscal_data.json";
    const request_json = {
      oscal_file: rootFile,
      id: id,
    };
    function deleteGroupSuccess(response: any) {
      console.log("Successful deletion of the group", id, response);
    }
    function deleteGroupFailed(e: any) {
      console.log("Failed to delete the group", id, e.statusText, " with request ", request_json);
    }
    fetchTransaction("/delete_id", request_json, deleteGroupSuccess, deleteGroupFailed);
  }
  function saveNewGroup(ID: string, Name: string, parentID: string) {
    const rootFile = "projects/catalog_" + data.projectUUID + "/oscal_data.json";
    const request_json = {
      oscal_file: rootFile,
      id: ID,
      title: Name,
      parent_id: parentID,
    };
    function addNewGroupSuccess(response: any) {
      console.log("Successful addition of a new group", response);
    }
    function addNewGroupFailed(e: any) {
      console.log("Failed to create a new group", e.statusText, "request ", request_json);
    }
    fetchTransaction("/add_group", request_json, addNewGroupSuccess, addNewGroupFailed);
  }
  function moveGroup(ID: string, Name: string, newParentID: string) {
    const rootFile = "projects/catalog_" + data.projectUUID + "/oscal_data.json";
    const request_json = {
      oscal_file: rootFile,
      id: ID,
      new_parent_id: newParentID,
    };
    function moveGroupSuccess(response: any) {
      console.log("Successful addition of a new group", response);
    }
    function moveGroupFailed(e: any) {
      console.log("Failed to create a new group", e.statusText, "with request ", request_json);
    }
    fetchTransaction("/move_group", request_json, moveGroupSuccess, moveGroupFailed);
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
      getCatalogGroupsFailed
    );
    function getCatalogGroupsSuccess(response: any) {
      console.log("In GroupDrawer: Successfull Transaction Call to get groups");
      setBaseGroups(response.groups);
    }
    function getCatalogGroupsFailed(e: any) {
      console.log(
        "In GroupDrawer: Operation list_all_groups failed ",
        e.statusText,
        " with request ",
        request_json
      );
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
    const [deleteText, setDeleteText] = useState("");
    function handleClose() {
      setOpenDeleteDialog(false);
    }
    function handleDeleteText(event: { target: { value: string | undefined } }) {
      setDeleteText(event.target.value ?? "");
    }
    function handleDelete() {
      if (deleteText.toLowerCase() === "delete") {
        deleteGroup(data.group.groupID);
        //reload Data
        getData();
      }
      setOpenDeleteDialog(false);
    }
    return (
      <OSCALWarningDialog open={openDeleteDialog} onClose={handleClose}>
        <OSCALDialogTitle warning={true} title={"Delete Group?"} onClose={handleClose} />
        <DialogContent>
          <Stack>
            <Typography>
              If deleted, all associated subgroups and controls will be <b>permanently</b> deleted.
              You cannot undo this action.
            </Typography>
            <Box padding={1} />
            <Typography>Please enter {"'delete'"} to confirm.</Typography>
            <Box padding={1} />
            <OSCALTextField
              id="delete-text"
              aria-label="Please type 'delete'"
              noLabel
              placeholder={"delete"}
              onChange={handleDeleteText}
            />
          </Stack>
        </DialogContent>
        <OSCALDialogActions>
          <OSCALTertiaryButton onClick={handleClose}>Cancel</OSCALTertiaryButton>
          <OSCALPrimaryDestructiveButton
            onClick={handleDelete}
            disabled={deleteText.toLowerCase() !== "delete"}
          >
            Delete Group
          </OSCALPrimaryDestructiveButton>
        </OSCALDialogActions>
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
      ID = preID + "_" + window.self.crypto.randomUUID();
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
      moveGroup(selectedGroup.groupID, selectedGroup.groupTitle, sibling.groupID);
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

      moveGroup(selectedGroup.groupID, selectedGroup.groupTitle, new_parent_id);
      // Reload the main data
      getData();
      setShowCardMenu(false);
    }
    function handleSaveNewGroup() {
      if (edit && !addBelow) {
        editGroupTitle(selectedGroup.groupID, Name);
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
        saveNewGroup(ID, Name, parent_id);
        setAddNewGroup(false);
        getData();
        setAddBelow(false);
        return;
      }
      saveNewGroup(ID, Name, "");
      setAddNewGroup(false);
      getData();
    }
    function handleDeleteGroup() {
      setOpenDeleteDialog(true);
      setAddNewGroup(false);
    }

    const isSelected = selectedItemName === "NewGroup" ? true : false;
    return (
      <Container
        onClick={handleNewGroupClick}
        sx={{
          height: 73,
          border: "1px solid",
          borderColor: (theme) => theme.palette.lightGray.main,
          background: (theme) => theme.palette.gray.main,
          width: 312,
        }}
      >
        <Container
          sx={{
            height: 73,
            left: 20,
            position: "absolute",
            background: (theme) => theme.palette.backgroundGray.main,
            border: "1px solid",
            borderColor: (theme) => theme.palette.lightGray.main,
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
                  background: (theme) => theme.palette.white.main,
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
                  background: (theme) => theme.palette.white.main,
                  "& .MuiOutlinedInput-root": {
                    "& > fieldset": {
                      borderColor: (theme) => theme.palette.secondary.main,
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
                      backgroundColor: (theme) => theme.palette.secondary.main,
                      color: (theme) => theme.palette.white.main,
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
                      backgroundColor: (theme) => theme.palette.secondary.main,
                      color: (theme) => theme.palette.white.main,
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
                      backgroundColor: (theme) => theme.palette.secondary.main,
                      color: (theme) => theme.palette.white.main,
                    },
                  }}
                >
                  <FormatIndentIncreaseIcon />
                </IconButton>
                <IconButton
                  size="small"
                  sx={{
                    ":hover": {
                      backgroundColor: (theme) => theme.palette.white.main,
                      color: (theme) => theme.palette.white.main,
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
                    color: (theme) => theme.palette.secondary.main,
                    ":hover": {
                      backgroundColor: (theme) => theme.palette.secondary.main,
                      color: (theme) => theme.palette.white.main,
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
            background: isSelected
              ? (theme) => theme.palette.primaryAccent.main
              : (theme) => theme.palette.backgroundGray.main,
          }}
        ></Box>
      </Container>
    );
  };
  const RootLevel: React.FC = () => {
    function handleRootLevelClick() {
      setSelectedItemName("Root");
      getSelectedGroup(defaultGroup);
    }
    const rootSelected = selectedItemName === "Root";
    const text = open ? "Root Level Controls" : "RC";
    return (
      <Box
        sx={{
          background: (theme) => theme.palette.backgroundGray.main,
          border: "1px solid",
          borderColor: (theme) => theme.palette.lightGray.main,
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
            background: rootSelected
              ? (theme) => theme.palette.primaryAccent.main
              : (theme) => theme.palette.backgroundGray.main,
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
      setOpenDeleteDialog(true);
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
      if (data.group === undefined) {
        setShowCardMenu(false);
        return;
      }

      const sibling = data.group.rightSibling;
      if (sibling === undefined) {
        setShowCardMenu(false);
        return;
      }
      moveGroup(data.group.groupID, data.group.groupTitle, sibling.groupID);
      // Reload the main data
      getData();
      setShowCardMenu(false);
    }
    function handleDecreaseIndent() {
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
      moveGroup(data.group.groupID, data.group.groupTitle, new_parent_id);
      // Reload the main data
      getData();
      setShowCardMenu(false);
    }
    return (
      <Card
        variant="outlined"
        sx={{ height: 240, left: 315, top: itemYcoordinate - 200, position: "absolute" }}
        elevation={2}
        id="menuBar"
      >
        <CardContent>
          <MenuList>
            <MenuItem onClick={handleEdit}>
              <IconButton size="small">
                <EditIcon></EditIcon>
              </IconButton>
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
      const id = data.group.groupID;
      if (!Ids.includes(id)) {
        Ids.push(id);
      }
      setDraggingOver(true);
    }
    function handleDragLeave(event: any) {
      event.preventDefault();
      event.stopPropagation();
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
      setEndDropping(true);
    };

    if (data.group.indent > 90) {
      return null;
    }
    if (doneDropping && draggedGroups?.length > 0) {
      const subGroup = draggedGroups[0];
      moveGroup(subGroup.groupID, subGroup.groupTitle, data.group.groupID);
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
            borderWidth: "1px",
            borderStyle: "solid",
            borderColor: (theme) => theme.palette.lightGray.main,
            background: (theme) => theme.palette.gray.main,
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
                background: (theme) => theme.palette.backgroundGray.main,
                border: "1px solid",
                borderColor: (theme) => theme.palette.lightGray.main,
                width: open ? 300 - data.group.indent : 55,
                ":hover": {
                  backgroundColor: (theme) => theme.palette.gray.main,
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
                    background: (theme) => theme.palette.primaryAccent.main,
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
                  border: "1px solid",
                  position: "absolute",
                  background: (theme) => theme.palette.primary.main,
                }}
              >
                <Typography
                  sx={{
                    fontFamily: "Source Sans Pro",
                    color: (theme) => theme.palette.white.main,
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
                  background:
                    selectedItemName === data.group.groupTitle
                      ? (theme) => theme.palette.primaryAccent.main
                      : (theme) => theme.palette.backgroundGray.main,
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
                  backgroundColor: (theme) => theme.palette.secondary.main,
                  color: (theme) => theme.palette.white.main,
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
  function mainClick() {
    if (showCardMenu) setShowCardMenu(false);
  }

  return (
    <>
      <Grid container spacing={2} direction={"row"} onClick={mainClick}>
        <Grid
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            whiteSpace: "nowrap",
            boxSizing: "border-box",
          }}
        >
          <Box component="main">
            <DrawerHeader
              sx={{
                background: (theme) => theme.palette.primary.main,
                borderRadius: "3.5px 3.5px 0px 0px",
              }}
            >
              {open && (
                <Typography
                  sx={{
                    color: (theme) => theme.palette.white.main,
                    left: 20,
                    position: "absolute",
                  }}
                >
                  GROUPS
                </Typography>
              )}
              <IconButton
                onClick={handleDrawerOpenClose}
                sx={{ color: (theme) => theme.palette.white.main }}
              >
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
        <Grid
          container={true}
          sx={{
            left: open ? 330 : 70,
            position: "absolute",
            width: open ? "67.5%" : "92.5%",
          }}
        >
          <Box component="main" sx={{ left: 10, position: "absolute", top: 0, width: "100%" }}>
            <Typography variant="h2" sx={{ top: 22, position: "absolute" }}>
              {" "}
              {selectedItemName}
            </Typography>
            <Container
              sx={{
                top: 65,
                width: "99%",
                position: "absolute",
              }}
            >
              <ControlManager
                inputRef={inputElement}
                open={open}
                group={selectedItemGroup ?? defaultGroup}
                previousGroupTitle={previousSelectedItemName}
              ></ControlManager>
            </Container>
          </Box>
        </Grid>
      </Grid>
      {showCardMenu && <GroupItemMenuBar group={selectedItemGroup ?? defaultGroup} />}
      <DeleteDialog group={selectedItemGroup ?? defaultGroup}></DeleteDialog>
    </>
  );
}

export default GroupDrawer;
