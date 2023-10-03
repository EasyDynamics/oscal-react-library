import React, { useState, MutableRefObject } from "react";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditIcon from "@mui/icons-material/Edit";
import { useFetchers } from "./Fetchers";
import { ReactComponent as DeleteIcon } from "./images/icons/delete.svg";
import { ReactComponent as FormatIndentDecreaseIcon } from "./images/icons/outdent.svg";
import { ReactComponent as FormatIndentIncreaseIcon } from "./images/icons/indent.svg";
import { ReactComponent as InsertIcon } from "./images/icons/insert.svg";
import { ReactComponent as QuoteIcon } from "./images/icons/quote.svg";
import { ReactComponent as CodeIcon } from "./images/icons/code.svg";
import { ReactComponent as OrangeCheckedIcon } from "./images/icons/orangeCircleChecked.svg";
import { ReactComponent as CancelIcon } from "./images/icons/XinCircle.svg";
import { FormatBold, FormatItalic, Subscript, Superscript } from "@mui/icons-material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Box,
  Card,
  CardContent,
  Container,
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
  Paper,
} from "@mui/material";

import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import { EditableFieldProps } from "./OSCALEditableTextField";
import { OSCALSecondaryButton } from "./styles/OSCALButtons";

const ControlTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} arrow classes={{ popper: className }} />
))`
  font-size: 20;
  box-shadow: 0px 0px 10px 0px #00000029;
`;

export interface Group extends EditableFieldProps {
  groupTitle: string;
  groupID: string;
  projectUUID: string;
  controls?: Array<any>;
  subGroups: Array<Group>;
  parentID: string;
  indent: number;
  rightSibling?: Group;
}

export interface Control extends EditableFieldProps {
  controlTitle: string;
  controlID: string;
  projectUUID: string;
  subControls: Array<Control>;
  parentID: string;
  indent: number;
  rightSibling?: Control;
}
export interface OSCALGroup extends EditableFieldProps {
  previousGroupTitle?: MutableRefObject<string>;
  group: Group;
  open?: boolean;
  inputRef?: React.MutableRefObject<any>;
}

interface OSCALControl extends EditableFieldProps {
  control: Control;
  open?: boolean;
}

export function ControlManager(data: OSCALGroup) {
  const [init, setInit] = useState(true);
  const [selectedControl, setSelectedControl] = useState<Control>();
  const [baseControls, setBaseControls] = useState<Array<any>>([]);
  const [selectedItemName, setSelectedItemName] = useState<string>("");
  const [showCardMenu, setShowCardMenu] = useState(false);
  const [itemYcoordinate, setItemYCoordinate] = useState(0);
  const [edit, setEdit] = useState(false);
  const [editControl, seteditControl] = useState<Control>();
  const [addBelow, setAddBelow] = useState(false);
  const [newControlParent, setNewControlParent] = useState<Control>();
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [addNewControl, setAddNewControl] = useState(false);

  const fetchers = useFetchers();
  const fetchTransaction = fetchers["fetchTransaction"];

  let draggedControls: Array<Control> = [];
  let Ids: string[] = [];

  const loadControls = data.previousGroupTitle?.current !== data.group.groupTitle;
  if (loadControls) {
    getData();
  }

  const orderControls: Array<Control> = [];
  const controlsAndSubs: Array<Control> = baseControls.map((x) => ({
    controlTitle: x.title,
    controlID: x.id,
    projectUUID: data.group.projectUUID,
    parentID: x.parent_id,
    subControls: [],
    indent: 0,
  }));

  function reorderControlsAndSetIndent() {
    const parent_ids: Array<string> = [];
    controlsAndSubs.forEach((elt) => {
      if (!orderControls.includes(elt)) {
        if (elt.parentID === data.group.groupID) {
          elt.indent = 0;
          orderControls.push(elt);
          parent_ids.push(elt.controlID);
        }
      }
    });

    let depth = 0;
    while (depth < 7) {
      controlsAndSubs.forEach((elt) => {
        if (!orderControls.includes(elt)) {
          if (parent_ids.includes(elt.parentID)) {
            const index = orderControls.findIndex((parent) => parent.controlID === elt.parentID);
            if (index >= 0) {
              elt.indent = orderControls[index].indent + 20;
              orderControls[index].subControls.push(elt);
              if (index + 1 >= orderControls.length) {
                orderControls.push(elt);
                parent_ids.push(elt.controlID);
              } else {
                orderControls.splice(index + 1, 0, elt);
                parent_ids.push(elt.controlID);
              }
            }
          }
        }
      });
      depth = depth + 1;
    }
  }
  function setSiblings(controls: Array<Control>) {
    if (controls.length === 0) return;

    for (let i = 0; i < controls.length - 1; i++) {
      controls[i].rightSibling = controls[i + 1];
    }
  }
  const defaultControl: Control = {
    controlID: "",
    controlTitle: "",
    projectUUID: data.group.projectUUID,
    subControls: [],
    indent: 0,
    parentID: data.group.groupID,
  };
  function getControlsAndSubs() {
    const rootFile = "projects/catalog_" + data.group.projectUUID + "/oscal_data.json";
    const request_json = {
      oscal_file: rootFile,
      parent_id: data.group.groupID,
    };

    fetchTransaction(
      "/list_all_controls",
      request_json,
      getCatalogControlsSuccess,
      getCatalogControlsFail
    );
    function getCatalogControlsSuccess(response: any) {
      console.log(
        "In ControlManager: Successfull Transaction Call to get controls for Group ",
        data.group.groupID
      );
      setBaseControls(response.controls);
    }
    function getCatalogControlsFail(e: any) {
      console.log("In ControlManager: Operation fail ", e.statusText, " resquest: ", request_json);
    }
  }
  // TODO This code will be used to implement Control editing
  // function EditControlTitle(ID: string, Name: string) {
  //   const rootFile = "projects/catalog_" + data.group.projectUUID + "/oscal_data.json";
  //   const request_json = {
  //     oscal_file: rootFile,
  //     id: ID,
  //     title: Name,
  //   };
  //   function addNewControlSuccess(response: any) {
  //     console.log("successful addition of a new Control", response);
  //   }
  //   function addNewControlFail(e: any) {
  //     console.log("Fail to create a new Control", e.statusText);
  //   }
  //   fetchTransaction("/edit_Control_title", request_json, addNewControlSuccess, addNewControlFail);
  // }
  //TODO this code will be use to implement control deletion
  // function DeleteControl(ID: string) {
  //   const id = ID === "" ? selectedControl?.controlID : ID;
  //   const rootFile = "projects/catalog_" + data.group.projectUUID + "/oscal_data.json";
  //   const request_json = {
  //     oscal_file: rootFile,
  //     id: id,
  //   };
  //   function deleteControlSuccess(response: any) {
  //     console.log("successful deletion of the Control", id, response);
  //   }
  //   function deleteControlFail(e: any) {
  //     console.log("Fail to delete the Control", id, e.statusText);
  //   }
  //   fetchTransaction("/delete_id", request_json, deleteControlSuccess, deleteControlFail);
  // }
  function MoveControl(ID: string, Name: string, newParentID: string) {
    const rootFile = "projects/catalog_" + data.group.projectUUID + "/oscal_data.json";
    const request_json = {
      oscal_file: rootFile,
      id: ID,
      new_parent_id: newParentID,
    };
    function moveControlSuccess(response: any) {
      console.log("successful addition of a new control", response);
    }
    function moveControlFail(e: any) {
      console.log("Fail to create a new control", e.statusText, "with request ", request_json);
    }
    fetchTransaction("/move_control", request_json, moveControlSuccess, moveControlFail);
  }
  const NewControlButton: React.FC<{ disabled?: boolean; noControls?: boolean }> = (input) => {
    function handleClick() {
      setAddNewControl(true);
    }
    return (
      <Grid
        container
        direction="row"
        sx={{
          height: 48,
          width: data.open ? "65.5%" : "89.5%",
          position: "absolute",
          border: input.noControls ? "1px solid #D2D2D2" : "0px",
        }}
      >
        {!input.noControls && (
          <>
            <Grid xs={data.open ? 9.47 : 10.14}></Grid>
            <Grid xs={data.open ? 2.53 : 1.86}>
              <OSCALSecondaryButton
                sx={{ position: "absolute", height: 20 }}
                disabled={addNewControl}
                onClick={handleClick}
              >
                NEW CONTROL +
              </OSCALSecondaryButton>
            </Grid>
          </>
        )}
        {input.noControls && (
          <>
            <Grid xs={data.open ? 5.2 : 5.1}></Grid>
            <Grid xs={data.open ? 6.8 : 6.9}>
              <OSCALSecondaryButton
                sx={{ position: "absolute", top: 13, height: 20 }}
                disabled={addNewControl}
                onClick={handleClick}
              >
                NEW CONTROL +
              </OSCALSecondaryButton>{" "}
            </Grid>
          </>
        )}
      </Grid>
    );
  };
  const ControlDialog: React.FC<OSCALControl> = (data) => {
    const [hasTitle, setHasTitle] = useState(false);
    const [preID, setPreID] = useState("");
    const index = data.control.controlID.indexOf("_");
    const idValue = index > 0 ? data.control.controlID.substring(0, index) : data.control.controlID;

    let title = "";
    const ID = "";
    function SaveNewControl(ID: string, Name: string, parentID: string) {
      const rootFile = "projects/catalog_" + data.control.projectUUID + "/oscal_data.json";
      let tempID = preID;
      if (preID === "") {
        tempID = Name.substring(0, 2);
      }
      ID = tempID + "_" + window.self.crypto.randomUUID();
      const request_json = {
        oscal_file: rootFile,
        id: ID,
        title: Name,
        parent_id: parentID,
      };
      function addNewControlSuccess(response: any) {
        console.log("successful addition of a new Control", response);
      }
      function addNewControlFail(e: any) {
        console.log("Fail to create a new Control", e.statusText);
      }
      fetchTransaction("/add_control", request_json, addNewControlSuccess, addNewControlFail);
    }
    const Item = styled(Box)(({ theme }) => ({
      backgroundColor: "#ffffff",
      ...theme.typography.body2,
      padding: theme.spacing(1),
      textAlign: "center",
      color: theme.palette.text.secondary,
      height: 9,
      width: 20,
      justifyContent: "center",
      border: "1px solid",
    }));

    function handleEditIDChange(event: { target: { value: string | undefined } }) {
      setPreID(event.target.value ?? "");
    }
    function handleEditControlTitleChange(event: { target: { value: string } }) {
      title = event.target.value;
      title = title.trim();
      if (title.length >= 2) setHasTitle(true);
    }
    function handleSaveControl() {
      if (addBelow) {
        SaveNewControl(ID, title, newControlParent?.controlID ?? data.control.parentID);
      }
      SaveNewControl(ID, title, data.control.parentID);
      //Reload all Data after saving new control
      getData();

      ///TODO these lines below are only to fix the linting issue
      setInit(true);
    }
    if ((!addNewControl && !addBelow) || (loadControls && addNewControl)) {
      setAddNewControl(false);
      return null;
    }
    return (
      <Grid
        direction={"row"}
        container
        sx={{
          width: data.open ? 680 : 930,
          height: 78,
          left: 0,
          background: (theme) => theme.palette.primary.main,
        }}
      >
        <Grid container sx={{ height: 40, left: 0, width: data.open ? 680 : 930 }}>
          <IconButton sx={{ left: 0, top: 5, width: 20, position: "relative", color: "#ffffff" }}>
            {!init && <DragIndicatorIcon />}
          </IconButton>
          <TextField
            size="small"
            label="ID"
            defaultValue={idValue}
            sx={{
              left: 10,
              position: "relative",
              height: 35,
              width: 90,
              top: 5,
              fontSize: 14,
              fontWeight: 200,
              background: "#002867",
              "& .MuiOutlinedInput-root": {
                "& > fieldset": {
                  borderColor: "#ffffff",
                },
              },
              "&:hover .MuiOutlinedInput-root": {
                "& > fieldset": {
                  borderColor: "#ffffff",
                },
              },
              input: { color: "#ffffff" },
              defaultValue: { color: "#ffffff" },
              label: { color: "#ffffff" },
            }}
            onChange={handleEditIDChange}
          ></TextField>

          <TextField
            size="small"
            label="Control Title"
            defaultValue={data.control.controlTitle}
            sx={{
              top: 5,
              left: 25,
              position: "relative",
              height: 32,
              width: data.open ? 458 : 695,
              background: "#002867",
              "& .MuiOutlinedInput-root": {
                "& > fieldset": {
                  borderColor: "#ffffff",
                },
              },
              "&:hover .MuiOutlinedInput-root": {
                "& > fieldset": {
                  borderColor: "#ffffff",
                },
              },
              input: { color: "#ffffff" },
              defaultValue: { color: "#ffffff" },
              label: { color: "#ffffff" },
            }}
            onChange={handleEditControlTitleChange}
          ></TextField>
          <IconButton sx={{ top: 17, height: 20, left: data.open ? 27 : 35, position: "relative" }}>
            <CancelIcon />
          </IconButton>
          <IconButton
            sx={{ top: 17, height: 20, left: data.open ? 27 : 35, position: "relative" }}
            disabled={!hasTitle}
            onClick={handleSaveControl}
          >
            <OrangeCheckedIcon />
          </IconButton>
        </Grid>
        <Grid sx={{ height: 23 }} container spacing={2}>
          <Grid xs={4}></Grid>
          <Grid xs={6} sx={{ height: 23, top: 9, position: "relative" }}>
            <Container
              component={"span"}
              sx={{
                top: 0,
                left: data.open ? 30 : 122,
                height: 25,
                width: 150,
                position: "relative",
                backgroundColor: "##002867",
              }}
            >
              <Stack spacing={0} direction="row">
                <Item>
                  <IconButton size="small" sx={{ left: -5, top: -10, position: "relative" }}>
                    <FormatBold />
                  </IconButton>
                </Item>
                <Item>
                  <IconButton size="small" sx={{ left: -5, top: -10, position: "relative" }}>
                    <FormatItalic />
                  </IconButton>
                </Item>
                <Item>
                  <IconButton size="small" sx={{ left: -5, top: -10, position: "relative" }}>
                    <CodeIcon />
                  </IconButton>
                </Item>
                <Item>
                  <IconButton
                    size="small"
                    color="primary"
                    sx={{ left: -5, top: -10, position: "relative" }}
                  >
                    <QuoteIcon />
                  </IconButton>
                </Item>
                <Item>
                  <IconButton size="small" sx={{ left: -5, top: -10, position: "relative" }}>
                    <Superscript />
                  </IconButton>
                </Item>
                <Item>
                  <IconButton size="small" sx={{ left: -5, top: -10, position: "relative" }}>
                    <Subscript />
                  </IconButton>
                </Item>
              </Stack>
            </Container>
          </Grid>
        </Grid>
      </Grid>
    );
  };
  const ControlItem: React.FC<OSCALControl> = (data) => {
    const [isDragged, setIsDragged] = useState(false);
    const [doneDropping, setEndDropping] = useState(false);
    const [draggingOver, setDraggingOver] = useState(false);

    const handleCardMenu = (event: any) => {
      setShowCardMenu(true);
      setItemYCoordinate(event.clientY);
    };

    function allowDrop(event: any) {
      event.preventDefault();
      event.target.style.border = "4px dotted green";
      const id = data.control.controlID;
      if (!Ids.includes(id)) {
        Ids.push(id);
        console.log("pushed id", id);
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
      draggedControls = [];
    };
    const startDrag = (event: any) => {
      draggedControls = [];
      Ids = [];
      event.preventDefault();

      const id = data.control.controlID;
      if (!Ids.includes(id)) {
        Ids.push(id);
        draggedControls.push(data.control);
      }
      setIsDragged(true);
    };
    const handleDrop = (event: any) => {
      event.preventDefault();
      event.stopPropagation();
      event.target.style.border = "1px solid #D2D2D2";
      setEndDropping(true);
    };

    if (data.control.indent > 140) {
      /// TODO These lines are just to fix linting issues. These parameters will be used when implementing Edit control and delete control
      if (selectedItemName === "" && openDeleteDialog && draggingOver) setInit(true);
      ///End TODO
      return null;
    }

    if (doneDropping && draggedControls?.length > 0) {
      const subControl = draggedControls[0];
      console.log("Start Moving control ", subControl.controlID, "into ", data.control.controlID);
      MoveControl(subControl.controlID, subControl.controlTitle, data.control.controlID);
      getData();
      subControl.parentID = data.control.parentID;
      data.control.subControls?.push(subControl);
      setSiblings(data.control.subControls);
    }
    if (isDragged) return null;
    const sepIndex = data.control.controlID.indexOf("_");
    const shownControlID =
      sepIndex === -1
        ? data.control.controlID.toUpperCase()
        : data.control.controlID.substring(0, sepIndex).toUpperCase();
    return (
      <>
        <Card
          elevation={1}
          sx={{
            height: 48,
            left: 0 + data.control.indent,
            width: data.open ? 680 - data.control.indent : 930 - data.control.indent,
            position: "relative",
            border: "1px #ffffff",
            background: "#ffffff",
            boxShadow: "0px 0px 6px 0px #00000040",
          }}
          key={data.control.controlID.toUpperCase()}
          draggable={true}
          onDrag={startDrag}
          onDragOver={allowDrop}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onDragEnd={endDragNDrop}
          onClick={() => {
            setSelectedItemName(data.control.controlTitle);
            setSelectedControl(data.control);
          }}
        >
          <Grid direction={"row"} container component={"main"}>
            <Grid container>
              <IconButton
                sx={{ left: 1, top: 4, width: 40, position: "relative", color: " #002867" }}
              >
                <DragIndicatorIcon />
              </IconButton>
              <Box
                sx={{
                  height: 35,
                  width: 90,
                  top: 5,
                  left: 5,
                  position: "relative",
                  border: "1px solid #00286754",
                  padding: "7px, 31px, 7px, 31px",
                  borderRadius: "2px",
                  gap: "8px",
                }}
              >
                <Typography
                  sx={{
                    fontFamily: ["Source Sans Pro"],
                    fontWeight: (theme) => theme.typography.fontWeightBold,
                    fontSize: "1.25rem",
                    color: "#2b2b2b",
                    top: 5,
                    left: 10,
                    position: "relative",
                  }}
                >
                  {shownControlID}
                </Typography>
              </Box>
              <ControlTooltip title={data.control.controlTitle}>
                <Typography
                  variant="h2"
                  sx={{
                    fontFamily: ["Source Sans Pro"],
                    top: 12,
                    left: 20,
                    height: 32,
                    color: "#2b2b2b",
                    fontWeight: (theme) => theme.typography.fontWeightRegular,
                    position: "relative",
                    width: data.open ? 460 - data.control.indent : 710 - data.control.indent,
                    fontSize: 16,
                  }}
                >
                  {data.control.controlTitle.length < 100
                    ? data.control.controlTitle
                    : data.control.controlTitle.substring(0, 99) + "..."}
                </Typography>
              </ControlTooltip>
              <IconButton
                sx={{ top: 15, left: 5, height: 20, color: "#002867", position: "relative" }}
                onClick={handleCardMenu}
              >
                <MoreVertIcon />
              </IconButton>
              <IconButton
                sx={{
                  top: 18,
                  left: 8,
                  height: 5,
                  width: 10,
                  background: "#ffffff",
                  color: "#002867",
                  position: "relative",
                }}
              >
                <ExpandMoreIcon />
              </IconButton>
            </Grid>
          </Grid>
        </Card>
        <Box sx={{ height: 5, width: data.open ? 680 : 925 }}></Box>

        {showCardMenu && <ControlItemMenuBar control={selectedControl ?? defaultControl} />}
        {editControl?.controlID === data.control.controlID && (edit || addBelow) && (
          <ControlDialog control={selectedControl ?? defaultControl}></ControlDialog>
        )}
      </>
    );
  };
  const ControlItemMenuBar: React.FC<OSCALControl> = (data) => {
    function handleEdit() {
      setEdit(true);
      setAddNewControl(true);
      seteditControl(data.control);
      setShowCardMenu(false);
    }
    function handleDelete() {
      setOpenDeleteDialog(true);
      setAddNewControl(false);
      getData();
      setShowCardMenu(false);
    }
    function handleAddBelow() {
      setAddNewControl(false);
      setAddBelow(true);
      setNewControlParent(data.control);
      seteditControl(data.control);
      getData();
      setShowCardMenu(false);
    }
    function handleIncreaseIndent() {
      if (data.control === undefined) {
        setShowCardMenu(false);
        return;
      }

      const sibling = data.control.rightSibling;
      if (sibling === undefined) {
        setShowCardMenu(false);
        return;
      }
      MoveControl(data.control.controlID, data.control.controlTitle, sibling.controlID);
      // Reload the main data
      getData();
      setShowCardMenu(false);
    }
    function handleDecreaseIndent() {
      if (data.control === undefined) {
        setShowCardMenu(false);
        return;
      }

      const parentID = data.control.parentID;
      if (parentID === undefined) {
        setShowCardMenu(false);
        return;
      }
      const parent = orderControls.find((x) => x.controlID === parentID) ?? defaultControl;
      const new_parent_id = parent.parentID;
      MoveControl(data.control.controlID, data.control.controlTitle, new_parent_id);
      // Reload the main data
      getData();
      setShowCardMenu(false);
    }
    return (
      <Card
        variant="outlined"
        sx={{ height: 240, left: "85%", top: itemYcoordinate - 200, position: "absolute" }}
        elevation={2}
        id="menuBar"
      >
        <CardContent>
          <MenuList>
            <MenuItem onClick={handleEdit}>
              <IconButton size="small">
                <EditIcon></EditIcon>
              </IconButton>
              <ListItemText>Edit Control</ListItemText>
            </MenuItem>
            <MenuItem>
              <IconButton size="small">
                <DeleteIcon></DeleteIcon>
              </IconButton>
              <ListItemText onClick={handleDelete}>Delete Control</ListItemText>
            </MenuItem>
            <MenuItem>
              <IconButton size="small">
                <InsertIcon></InsertIcon>
              </IconButton>
              <ListItemText onClick={handleAddBelow}>Add Control Below</ListItemText>
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
  function getData() {
    getControlsAndSubs();
  }

  //Now let us process the data collected before rendering the component.
  reorderControlsAndSetIndent();
  orderControls.forEach((elt) => {
    setSiblings(elt.subControls);
  });

  const orphans = orderControls.filter((elt) => elt.parentID === data.group.groupID);
  if (orphans.length > 0) {
    let sibling = orphans[0];
    for (let i = 1; i < orphans.length; i++) {
      orphans[i].rightSibling = sibling;
      sibling = orphans[i];
    }
  }
  const noControl = orderControls.length === 0;
  return (
    <Box component={"main"} sx={{ width: data.open ? 680 : 932, height: 800 }}>
      <Paper
        ref={data.inputRef}
        onClick={() => {
          getData();
        }}
      ></Paper>
      <ControlDialog open={data.open} control={defaultControl}></ControlDialog>
      {orderControls.map((item) => (
        <ControlItem open={data.open} control={item} key={item.controlID}></ControlItem>
      ))}
      <NewControlButton noControls={noControl}></NewControlButton>
      {showCardMenu && <ControlItemMenuBar control={selectedControl ?? defaultControl} />}
    </Box>
  );
}

export default ControlManager;
