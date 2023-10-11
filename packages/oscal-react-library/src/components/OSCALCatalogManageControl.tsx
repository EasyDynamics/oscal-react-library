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
  DialogContent,
} from "@mui/material";

import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import { EditableFieldProps } from "./OSCALEditableTextField";
import {
  OSCALPrimaryDestructiveButton,
  OSCALSecondaryButton,
  OSCALTertiaryButton,
} from "./styles/OSCALButtons";
import { OSCALDialogActions, OSCALDialogTitle, OSCALWarningDialog } from "./styles/OSCALDialog";
import { OSCALTextField } from "./styles/OSCALInputs";

const ControlTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} arrow classes={{ popper: className }} />
))(({ theme }) => ({
  fontSize: 20,
  boxShadow: `0px 0px 10px 0px ${theme.palette.smokyWhite.main}`,
}));

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
  index: number;
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
  let draggedInsertBetween: Array<boolean> = [];
  let draggedInsertBottom: Array<boolean> = [];
  let Ids: string[] = [];
  const Data: OSCALGroup = data;
  let loadControls = false;
  const previous = data.previousGroupTitle?.current;
  if (previous && previous.length > 0) {
    loadControls = previous !== data.group.groupTitle;
  }
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
    index: 0,
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
    while (depth < 10) {
      controlsAndSubs.forEach((elt) => {
        if (!orderControls.includes(elt)) {
          if (parent_ids.includes(elt.parentID)) {
            const index = orderControls.findIndex((parent) => parent.controlID === elt.parentID);
            if (index >= 0) {
              let siblingIndex = 0;
              elt.indent = orderControls[index].indent + 20;
              //Find last sibling
              const orderedSiblings = orderControls.filter(
                (control) => control.parentID === elt.parentID
              );
              if (orderedSiblings.length > 0) {
                const lastSibling = orderedSiblings[orderedSiblings.length - 1];
                siblingIndex = orderControls.findIndex(
                  (control) => control.controlID === lastSibling.controlID
                );
              }
              const mainIndex = siblingIndex > 0 ? siblingIndex : index;
              orderControls[index].subControls.push(elt);
              if (index + 1 >= orderControls.length) {
                orderControls.push(elt);
                parent_ids.push(elt.controlID);
              } else {
                orderControls.splice(mainIndex + 1, 0, elt);
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
      controls[i].index = i;
    }
    controls[controls.length - 1].index = controls.length - 1;
  }
  const defaultControl: Control = {
    controlID: "",
    controlTitle: "",
    projectUUID: data.group.projectUUID,
    subControls: [],
    indent: 0,
    parentID: data.group.groupID,
    index: 0,
  };
  function getControlsAndSubs() {
    if (!data.group.projectUUID) return;
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
      console.log("In ControlManager: Operation fail ", e.statusText, " request: ", request_json);
    }
  }
  //TODO This code will be used to implement Control editing
  // function editControlTitle(ID: string, Name: string) {
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
  function deleteControl(ID: string) {
    const id = ID === "" ? selectedControl?.controlID : ID;
    const rootFile = "projects/catalog_" + data.group.projectUUID + "/oscal_data.json";
    const request_json = {
      oscal_file: rootFile,
      id: id,
    };
    function deleteControlSuccess(response: any) {
      console.log("successful deletion of the Control", id, response);
    }
    function deleteControlFail(e: any) {
      console.log("Fail to delete the Control", id, e.statusText);
    }
    fetchTransaction("/delete_id", request_json, deleteControlSuccess, deleteControlFail);
  }
  function moveControl(ID: string, newParentID: string) {
    const rootFile = "projects/catalog_" + data.group.projectUUID + "/oscal_data.json";
    const request_json = {
      oscal_file: rootFile,
      id: ID,
      new_parent_id: newParentID,
    };
    function moveControlSuccess(response: any) {
      console.log("Successful addition of a  sub-control", response);
      getData();
    }
    function moveControlFail(e: any) {
      console.log("Fail to create a new control", e.statusText, "with request ", request_json);
    }
    fetchTransaction("/move_control", request_json, moveControlSuccess, moveControlFail);
  }
  function moveControlSibling(ID: string, newSiblingID: string) {
    const rootFile = "projects/catalog_" + data.group.projectUUID + "/oscal_data.json";
    const request_json = {
      oscal_file: rootFile,
      id: ID,
      new_sibling_id: newSiblingID,
    };
    function moveControlSuccess(response: any) {
      console.log("Successful addition of a  sub-control", response);
    }
    function moveControlFail(e: any) {
      console.log("Fail to create a new control", e.statusText, "with request ", request_json);
    }
    fetchTransaction("/move_control_sibling", request_json, moveControlSuccess, moveControlFail);
  }
  function insertControlAt(
    ID: string,
    parentID: string,
    insert_index: number,
    delete_index: number
  ) {
    const rootFile = "projects/catalog_" + data.group.projectUUID + "/oscal_data.json";
    const request_json = {
      oscal_file: rootFile,
      id: ID,
      parent_id: parentID,
      insert_index: insert_index.toString(),
      delete_index: delete_index.toString(),
    };
    function insertControlSuccess(response: any) {
      console.log("Successful insertion  of a sub-control", response);
    }
    function insertControlFail(e: any) {
      console.log("Fail to insert a control", e.statusText, " with request ", request_json);
    }
    fetchTransaction("/insert_control_at", request_json, insertControlSuccess, insertControlFail);
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
          left: 0,
          border: input.noControls && !addNewControl ? "1px solid" : "0px",
          borderColor: (theme) => theme.palette.lightGray.main,
          width: "99%",
        }}
      >
        {!input.noControls && (
          <>
            <Grid xs={2}></Grid>
            <Grid xs={10}>
              <OSCALSecondaryButton
                sx={{ position: "absolute", height: 20, width: 145, right: 1 }}
                disabled={addNewControl}
                onClick={handleClick}
              >
                NEW CONTROL +
              </OSCALSecondaryButton>
            </Grid>
          </>
        )}
        {input.noControls && !addNewControl && (
          <>
            <Grid xs={data.open ? 5.2 : 5.1}></Grid>
            <Grid xs={data.open ? 6.8 : 6.9}>
              <OSCALSecondaryButton
                sx={{ position: "relative", top: 13, height: 20, width: 145 }}
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
    const [title, setTitle] = useState("");
    const index = data.control.controlID.indexOf("_");
    const idValue = index > 0 ? data.control.controlID.substring(0, index) : data.control.controlID;

    const ID = "";
    function SaveNewControl(ID: string, Name: string, parentID: string) {
      if (!data.control.projectUUID) {
        console.log(
          "Fail to create a new Control",
          ID,
          " title ",
          title,
          " because the project uuid is undefined"
        );
        return;
      }
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
        console.log("Successful addition of a new Control", response);
      }
      function addNewControlFail(e: any) {
        console.log("Fail to create a new Control", e.statusText, "request_json: ", request_json);
      }
      fetchTransaction("/add_control", request_json, addNewControlSuccess, addNewControlFail);
    }
    const Item = styled(Box)(({ theme }) => ({
      backgroundColor: theme.palette.white.main,
      ...theme.typography.body2,
      padding: theme.spacing(1),
      textAlign: "center",
      color: theme.palette.text.secondary,
      alignContent: "center",
      justifyItems: "center",
      height: 9,
      width: 20,
      justifyContent: "center",
      border: "1px solid",
    }));

    function handleEditIDChange(event: { target: { value: string | undefined } }) {
      setPreID(event.target.value ?? "");
    }
    function handleEditControlTitleChange(event: { target: { value: string } }) {
      let cTitle = event.target.value;
      cTitle = cTitle.trim();
      if (cTitle.length >= 2) {
        setHasTitle(true);
        setTitle(cTitle);
      }
    }
    function handleCancel() {
      setAddNewControl(false);
    }
    function handleSaveControl() {
      if (addBelow) {
        SaveNewControl(ID, title, newControlParent?.controlID ?? data.control.parentID);
      }

      SaveNewControl(ID, title, data.control.parentID);
      //Reload all Data after saving new control
      getData();
      setAddBelow(false);
      setAddBelow(false);

      ///TODO these lines below are only to fix the linting issue
      setInit(true);
    }
    if (Data.previousGroupTitle?.current !== Data.group.groupTitle) {
      setAddNewControl(false);
      setAddBelow(false);
      return null;
    }
    return (
      <Grid
        direction={"row"}
        container
        sx={{
          width: "100%",
          height: 78,
          left: 0,
          background: (theme) => theme.palette.primary.main,
        }}
      >
        <Grid container sx={{ height: 40, left: 0, width: "100%" }}>
          <IconButton
            sx={{
              left: 0,
              top: 5,
              width: 20,
              position: "relative",
              color: (theme) => theme.palette.white.main,
            }}
          >
            {!init && <DragIndicatorIcon />}
          </IconButton>
          <TextField
            size="small"
            label="ID"
            defaultValue={idValue}
            sx={{
              left: 24,
              position: "relative",
              height: 35,
              width: 90,
              top: 5,
              fontSize: 14,
              fontWeight: 200,
              background: (theme) => theme.palette.primary.main,
              "& .MuiOutlinedInput-root": {
                "& > fieldset": {
                  borderColor: (theme) => theme.palette.white.main,
                },
              },
              "&:hover .MuiOutlinedInput-root": {
                "& > fieldset": {
                  borderColor: (theme) => theme.palette.white.main,
                },
              },
              input: { color: (theme) => theme.palette.white.main },
              defaultValue: { color: (theme) => theme.palette.white.main },
              label: { color: (theme) => theme.palette.white.main },
            }}
            onChange={handleEditIDChange}
          ></TextField>

          <TextField
            size="small"
            label="Control Title"
            defaultValue={data.control.controlTitle}
            sx={{
              top: 5,
              left: 150,
              position: "absolute",
              height: 32,
              right: 90,
              background: (theme) => theme.palette.primary.main,
              "& .MuiOutlinedInput-root": {
                "& > fieldset": {
                  borderColor: (theme) => theme.palette.white.main,
                },
              },
              "&:hover .MuiOutlinedInput-root": {
                "& > fieldset": {
                  borderColor: (theme) => theme.palette.white.main,
                },
              },
              input: { color: (theme) => theme.palette.white.main },
              defaultValue: { color: (theme) => theme.palette.white.main },
              label: { color: (theme) => theme.palette.white.main },
            }}
            onChange={handleEditControlTitleChange}
          ></TextField>
          <IconButton
            sx={{ top: 17, height: 20, right: 35, position: "absolute" }}
            onClick={handleCancel}
          >
            <CancelIcon />
          </IconButton>
          <IconButton
            sx={{ top: 17, height: 20, right: 3, position: "absolute" }}
            disabled={!hasTitle}
            onClick={handleSaveControl}
          >
            <OrangeCheckedIcon />
          </IconButton>
        </Grid>
        <Grid sx={{ height: 23 }} container spacing={2}>
          <Grid xs={2}></Grid>
          <Grid xs={10} sx={{ height: 23, top: 9, position: "relative" }}>
            <Container
              component={"span"}
              sx={{
                top: 0,
                right: 190, // left: data.open ? 30 : 122
                height: 25,
                width: 150,
                position: "absolute",
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
  const DeleteDialog: React.FC<OSCALControl> = (data) => {
    const [deleteText, setDeleteText] = useState("");
    function handleClose() {
      setOpenDeleteDialog(false);
    }
    function handleDeleteText(event: { target: { value: string | undefined } }) {
      setDeleteText(event.target.value ?? "");
    }
    function handleDelete() {
      if (deleteText.toLowerCase() === "delete") {
        deleteControl(data.control.controlID);
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
              If deleted, all associated controls will be <b>permanently</b> deleted.
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
            Delete Control
          </OSCALPrimaryDestructiveButton>
        </OSCALDialogActions>
      </OSCALWarningDialog>
    );
  };
  function itemWidth(indent: any): string {
    const percent = 100 - (1 * indent) / 5;
    const result = percent.toString() + "%";
    return result;
  }
  function handleDragInsertLeave(event: any) {
    event.preventDefault();
    event.stopPropagation();
    event.target.style.height = 0;
    event.target.style.background = "#FFFFFF"; //TODO for some reason, theme.palette.white.main does not work here
  }

  function handleDragInsertEnd(event: any) {
    event.preventDefault();
    event.stopPropagation();
    draggedControls = [];
    draggedInsertBetween = [];
  }
  function handleInsert(event: any) {
    event.preventDefault();
    event.stopPropagation();
    event.target.style.height = 10;
    event.target.style.background = "#FF6600"; //TODO for some reason, theme.palette.primaryAccent.main does not work here
  }

  function changeFirstOrLastControl(newControl: Control, control: Control, first: boolean) {
    if (draggedInsertBetween.length > 0) {
      if (first) {
        console.log("Start Moving control ", newControl.controlID, " to the top of the list ");
        if (newControl.parentID === data.group.groupID)
          insertControlAt(newControl.controlID, newControl.parentID, 0, newControl.index + 1);
        else moveControl(newControl.controlID, control.controlID);
      } else {
        console.log("Start Moving control ", newControl.controlID, " to the bottom of the list ");
        if (newControl.parentID === control.parentID)
          insertControlAt(
            newControl.controlID,
            newControl.parentID,
            orderControls.length,
            newControl.index
          );
        else
          insertControlAt(
            newControl.controlID,
            data.group.groupID,
            orderControls.length,
            newControl.index
          );
      }
    }
  }
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
      const id = data.control.controlID;
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
      draggedControls = [];
      draggedInsertBetween = [];
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

    if (data.control.indent > 240) {
      /// TODO These lines are just to fix linting issues. These parameters will be used when implementing Edit control and delete control
      if (selectedItemName === "" && openDeleteDialog && draggingOver) setInit(true);
      ///End TODO
      return null;
    }
    let between = false;
    between = draggedInsertBetween.length > 0 ? draggedInsertBetween[0] : false;
    if (between && draggedControls?.length > 0) {
      const newControl = draggedControls[0];
      console.log("Start Moving control ", newControl.controlID, "before ", data.control.controlID);
      if (
        data.control.controlID === firstControlID ||
        (data.control.controlID === lastControlID && draggedInsertBottom.length > 0)
      ) {
        changeFirstOrLastControl(
          newControl,
          data.control,
          data.control.controlID === firstControlID
        );
      } else {
        if (newControl.parentID !== data.control.parentID) {
          moveControlSibling(newControl.controlID, data.control.controlID);
        } else {
          if (newControl.index < data.control.index)
            moveControlSibling(newControl.controlID, data.control.controlID);
          else {
            insertControlAt(
              newControl.controlID,
              newControl.parentID,
              data.control.index,
              newControl.index + 1
            );
          }
        }
      }
      draggedInsertBottom = [];
      draggedInsertBetween = [];
      draggedControls = [];
      getData();
    } else {
      if (doneDropping && draggedControls?.length > 0) {
        const subControl = draggedControls[0];
        console.log("Start Moving control ", subControl.controlID, "into ", data.control.controlID);
        moveControl(subControl.controlID, data.control.controlID);
        subControl.parentID = data.control.parentID;
        data.control.subControls?.push(subControl);
        setSiblings(data.control.subControls);
        draggedInsertBetween = [];
        draggedControls = [];
        getData();
      }
    }
    function handleDropInsert(event: any) {
      event.preventDefault();
      event.stopPropagation();
      draggedInsertBetween.push(true);
      setEndDropping(true);
    }
    function handleBottomDropInsert(event: any) {
      event.preventDefault();
      event.stopPropagation();
      draggedInsertBetween.push(true);
      draggedInsertBottom.push(true);
      setEndDropping(true);
    }
    if (isDragged) return null;
    const sepIndex = data.control.controlID.indexOf("_");
    const shownControlID =
      sepIndex === -1
        ? data.control.controlID.toUpperCase()
        : data.control.controlID.substring(0, sepIndex).toUpperCase();
    const barWidth = itemWidth(data.control.indent);
    const leftPoint = (data.control.indent / 5).toString() + "%";
    const cardID = "card" + data.control.controlID;
    return (
      <>
        <Box
          sx={{
            height: draggedControls?.length > 0 ? 20 : 0,
            width: barWidth,
            left: leftPoint,
            position: "relative",
          }}
          onDragOver={handleInsert}
          onDrop={handleDropInsert}
          onDrag={handleInsert}
          draggable={true}
          onDragLeave={handleDragInsertLeave}
          onDragEnd={handleDragInsertEnd}
        ></Box>

        <Box
          sx={{
            height: 5,
            width: barWidth,
            left: leftPoint,
            position: "relative",
          }}
        ></Box>

        <Card
          elevation={1}
          id={cardID}
          sx={{
            height: 48,
            left: leftPoint,
            width: barWidth,
            position: "relative",
            border: "1px",
            borderColor: (theme) => theme.palette.white.main,
            background: (theme) => theme.palette.white.main,
            boxShadow: `0px 0px 6px 0px #00000040`, //TODO (theme) => theme.palette.darkWhite.main
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
              {draggingOver && (
                <Box
                  sx={{
                    top: 20,
                    height: 5,
                    width: barWidth,
                    left: leftPoint,
                    position: "relative",
                    background: (theme) => theme.palette.primaryAccent.main,
                  }}
                ></Box>
              )}
              <IconButton
                sx={{
                  left: 1,
                  top: 4,
                  width: 40,
                  position: "relative",
                  color: (theme) => theme.palette.primary.main,
                }}
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
                  border: "1px solid",
                  borderColor: (theme) => theme.palette.simpleBlue.main,
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
                    color: (theme) => theme.palette.black.main,
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
                    color: (theme) => theme.palette.black.main,
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
                sx={{
                  top: 15,
                  right: 25,
                  height: 20,
                  color: (theme) => theme.palette.primary.main,
                  position: "absolute",
                }}
                onClick={handleCardMenu}
              >
                <MoreVertIcon />
              </IconButton>
              <IconButton
                sx={{
                  top: 18,
                  right: 10,
                  height: 5,
                  width: 10,
                  background: (theme) => theme.palette.white.main,
                  color: (theme) => theme.palette.primary.main,
                  position: "absolute",
                }}
              >
                <ExpandMoreIcon />
              </IconButton>
            </Grid>
          </Grid>
        </Card>
        {data.control.controlID === lastControlID && (
          <Box
            sx={{
              height: draggedControls?.length > 0 ? 20 : 0,
              width: barWidth,
              left: leftPoint,
              position: "relative",
            }}
            onDragOver={handleInsert}
            onDrop={handleBottomDropInsert}
            onDrag={handleInsert}
            draggable={true}
            onDragLeave={handleDragInsertLeave}
            onDragEnd={handleDragInsertEnd}
          ></Box>
        )}

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
      moveControl(data.control.controlID, sibling.controlID);
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
      moveControl(data.control.controlID, new_parent_id);
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

  orderControls.forEach((elt) => {
    setSiblings(elt.subControls);
  });
  reorderControlsAndSetIndent();

  const orphans = orderControls.filter((elt) => elt.parentID === data.group.groupID);
  if (orphans.length > 0) {
    let sibling = orphans[0];
    for (let i = 1; i < orphans.length; i++) {
      orphans[i].rightSibling = sibling;
      sibling = orphans[i];
      orphans[i].index = i;
    }
  }
  const noControl = orderControls.length === 0;
  const lastControlID =
    orderControls.length > 0 ? orderControls[orderControls.length - 1].controlID : "";
  const firstControlID = orderControls.length > 0 ? orderControls[0].controlID : "";
  return (
    <Box component={"main"} sx={{ left: 0, width: "100%", position: "absolute" }}>
      <Paper
        ref={data.inputRef}
        onClick={() => {
          getData();
        }}
      ></Paper>
      {addNewControl && <ControlDialog open={data.open} control={defaultControl}></ControlDialog>}
      {orderControls.map((item) => (
        <ControlItem open={data.open} control={item} key={item.controlID}></ControlItem>
      ))}
      {<NewControlButton noControls={noControl}></NewControlButton>}
      {showCardMenu && <ControlItemMenuBar control={selectedControl ?? defaultControl} />}
      <DeleteDialog control={selectedControl ?? defaultControl}></DeleteDialog>
    </Box>
  );
}

export default ControlManager;
