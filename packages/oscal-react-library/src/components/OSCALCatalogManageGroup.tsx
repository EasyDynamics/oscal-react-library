import React, { useState, useEffect } from "react";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import SaveIcon from "@mui/icons-material/Save";
import DeleteIcon from "@mui/icons-material/Delete";
import FormatIndentDecreaseIcon from "@mui/icons-material/FormatIndentDecrease";
import FormatIndentIncreaseIcon from "@mui/icons-material/FormatIndentIncrease";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useFetchers } from "./Fetchers";
import {
  Accordion,
  Box,
  CSSObject,
  Container,
  Dialog,
  Divider,
  Grid,
  IconButton,
  TextField,
  Theme,
  Tooltip,
  TooltipProps,
  Typography,
  styled,
} from "@mui/material";
import MuiDrawer from "@mui/material/Drawer";

import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import { OSCALSecondaryButtonSmall } from "./styles/OSCALButtons";
import { EditableFieldProps } from "./OSCALEditableTextField";
import { fontWeight } from "@mui/system";

const drawerWidth = 312;

const GroupTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} arrow classes={{ popper: className }} />
))`
  font-size: 20;
  box-shadow: 0px 0px 10px 0px #00000029;
`;

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
  top: 260,
  left: 380,
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  top: 260,
  left: 380,
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

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
  controls?: Array<unknown>;
  subGroups?: Array<Group>;
  parent?: Group;
}

interface OSCALGroup extends EditableFieldProps {
  group: Group;
}

const DrawerMous = styled(MuiDrawer)(({ theme, open }) => ({
  width: drawerWidth,
  ...(open && { ...openedMixin(theme), "& .MuiDrawer-paper": openedMixin(theme) }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));
const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== "open" })(
  ({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: "nowrap",
    boxSizing: "border-box",
    ...(open && {
      ...openedMixin(theme),
      "& .MuiDrawer-paper": openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      "& .MuiDrawer-paper": closedMixin(theme),
    }),
  })
);

export function GroupDrawer(data: OSCALProject) {
  let datum: any[] = [];
  const [items, getItems] = useState<Array<any>>([]);
  const fetchers = useFetchers();
  const fetchTransaction = fetchers["fetchTransaction"];
  const fetchRest = fetchers["fetchRest"];

  const closedDrawerWidth = 50;
  const OpenDrawerWidth = 312;
  const expandedWidth = 957;
  const shrinkedWidth = 696;

  const [open, setOpen] = React.useState(false);
  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };
  const handleDrawerOpenClose = () => {
    if (open) return handleDrawerClose();
    else return handleDrawerOpen();
  };

  const [addNewGroup, setAddNewGroup] = useState(false);
  const [selectedItemName, setSelectedItemName] = useState<string>("");
  useEffect(() => {
    getData();
  }, []);

  function getData() {
    const request_json = {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    };
    const operation = "/catalog/" + data.projectUUID + "/catalog/groups";
    console.log(
      "In GroupDrawer: Starting fetching with operation",
      operation,
      "with request",
      request_json
    );

    fetchRest(operation, request_json, getCatalogGroupsSuccess, getCatalogGroupsFail);

    function getCatalogGroupsSuccess(response: any) {
      console.log("In GroupDrawer: Successfull REST CAll with path", operation);
      datum = response;
      console.log(datum);
      getItems(response);
    }
    function getCatalogGroupsFail(e: any) {
      console.log("In GroupDrawer: Operation fail ", e.statusText);
    }
  }
  console.log("In GroupDrawer: Done fetching...");
  const groups: Array<Group> = items.map((x) => ({
    groupName: x.title,
    groupLabel: x.id,
    controls: x.controls,
  }));

  console.log("group", groups);
  console.log("items", items);
  function handleAddNewGroup() {
    setAddNewGroup(true);
  }

  const Data: Group = {
    groupName: "Account Management",
    groupLabel: "AM",
  };
  const Data2: Group = {
    groupName: "Account Access",
    groupLabel: "AC",
  };
  const Data3: Group = {
    groupName: "Account Removal",
    groupLabel: "AR",
  };
  const All = [Data, Data2, Data3];
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
      SaveNewGroup();
      setAddNewGroup(false);
    }
    function SaveNewGroup() {
      const rootFile = "projects/catalog_" + data.projectUUID + "/oscal_data.json";
      const request_json = {
        oscal_file: rootFile,
        id: ID,
        title: Name,
        parent_id: "",
      };
      function addNewGroupSuccess(response: any) {
        console.log("successful addition of a new group", response);
      }
      function addNewGroupFail(e: any) {
        console.log("Fail to create a new group", e.statusText);
      }
      fetchTransaction("/add_group", request_json, addNewGroupSuccess, addNewGroupFail);
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
            left: 10,
            position: "absolute",
            background: "#F6F6F6",
            width: 306,
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
            <Grid sx={{ height: 23, top: 57, position: "absolute" }} container spacing={2}>
              <Grid xs={5}></Grid>
              <Grid xs={7}>
                <IconButton
                  sx={{
                    ":hover": {
                      backgroundColor: "#023E88",
                      color: "#FFFFFF",
                    },
                  }}
                >
                  <FormatIndentDecreaseIcon sx={{ color: "#BCC6D5" }} />
                </IconButton>
                <IconButton
                  sx={{
                    ":hover": {
                      backgroundColor: "#023E88",
                      color: "#FFFFFF",
                    },
                  }}
                >
                  <FormatIndentIncreaseIcon sx={{ color: "#BCC6D5" }} />
                </IconButton>
                <IconButton sx={{ color: "#B31515" }}>
                  <DeleteIcon />
                </IconButton>
                <IconButton
                  sx={{
                    ":hover": {
                      backgroundColor: "#023E88",
                      color: "#FFFFFF",
                    },
                  }}
                  onClick={handleSaveNewGroup}
                >
                  <SaveIcon sx={{ color: "#BCC6D5" }}></SaveIcon>
                </IconButton>
              </Grid>
            </Grid>
          </Grid>
        </Container>
        <Box
          sx={{
            left: 306,
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
    return (
      <Box
        sx={{
          background: "#F6F6F6",
          border: "1px solid #D2D2D2",
          height: 48,
        }}
        onClick={handleRootLevelClick}
      >
        <Typography sx={{ top: 75, left: 20, position: "absolute" }}>
          {" "}
          Root Level Controls{" "}
        </Typography>

        <Box
          sx={{
            left: 306,
            width: 6,
            height: 48,
            position: "absolute",
            background: rootSelected ? "#FF6600" : "#F6F6F6",
          }}
        ></Box>
      </Box>
    );
  };
  const GroupItem: React.FC<OSCALGroup> = (data) => {
    function handleGroupItem() {
      setSelectedItemName(data.group.groupName);
    }
    const itemSelected = selectedItemName === data.group.groupName ? true : false;
    const trunckatedName =
      data.group.groupName.length < 20
        ? data.group.groupName
        : data.group.groupName.substring(0, 19) + "...";
    return (
      <>
        <Container
          sx={{ height: 48, border: "1px solid #D2D2D2", background: "#EAEAEA", width: 312 }}
          onClick={handleGroupItem}
        >
          <Container
            sx={{
              height: 48,
              left: 10,
              position: "absolute",
              background: "#F6F6F6",
              width: 306,
            }}
          >
            <IconButton sx={{ left: 0, top: 2, position: "absolute" }}>
              <DragIndicatorIcon />
            </IconButton>
            <Box
              sx={{
                left: 40,
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
                {data.group.groupLabel.toUpperCase()}
              </Typography>
            </Box>
            <GroupTooltip title={data.group.groupName}>
              <Typography
                sx={{ left: 89, top: 10, position: "absolute", fontSize: 14, fontWeight: 700 }}
              >
                {trunckatedName}
              </Typography>
            </GroupTooltip>
          </Container>
          <Box
            sx={{
              left: 306,
              width: 6,
              height: 48,
              position: "absolute",
              background: itemSelected ? "#FF6600" : "#F6F6F6",
            }}
          ></Box>
        </Container>
        <Divider />
      </>
    );
  };

  function Groups() {
    if (open)
      return (
        <Typography sx={{ color: "#ffffff", left: 20, position: "absolute" }}>GROUPS</Typography>
      );
    else return null;
  }

  const NewGroupButton: React.FC = () => {
    return (
      <>
        <Box sx={{ height: 4 }}></Box>
        <Grid container direction="row" sx={{ top: 40, height: 20 }}>
          <Grid sx={{ width: 157, height: 20 }}></Grid>
          <Grid sx={{ width: 143, height: 20 }}>
            <OSCALSecondaryButtonSmall disabled={addNewGroup} onClick={handleAddNewGroup}>
              <Typography sx={{ size: 12, fontWeight: 600, font: "Source Sans Pro" }}>
                NEW GROUP +
              </Typography>
            </OSCALSecondaryButtonSmall>
          </Grid>
        </Grid>
      </>
    );
  };
  return (
    <Box sx={{ display: "flex" }}>
      <Drawer variant="permanent" open={open}>
        <DrawerHeader sx={{ background: "#002867" }}>
          <Groups></Groups>
          <IconButton onClick={handleDrawerOpenClose} sx={{ color: "#ffffff" }}>
            <KeyboardDoubleArrowLeftIcon />{" "}
          </IconButton>
        </DrawerHeader>
        <RootLevel></RootLevel>
        <Divider />
        {groups.map((item) => (
          <GroupItem group={item} key={item.groupName}></GroupItem>
        ))}

        {addNewGroup && <NewGroupDialog></NewGroupDialog>}
        <NewGroupButton></NewGroupButton>
      </Drawer>
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
          GROUP A
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
    </Box>
  );
}

export function MyDrawer(data: OSCALProject) {
  const [items, getItems] = useState<Array<any>>([]);
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
  useEffect(() => {
    getData();
  }, []);

  function getData() {
    const request_json = {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    };
    const operation = "/catalog/" + data.projectUUID + "/catalog/groups";
    console.log(
      "In GroupDrawer: Starting fetching with operation",
      operation,
      "with request",
      request_json
    );

    fetchRest(operation, request_json, getCatalogGroupsSuccess, getCatalogGroupsFail);

    function getCatalogGroupsSuccess(response: any) {
      console.log("In GroupDrawer: Successfull REST CAll with path", operation);
      getItems(response);
    }
    function getCatalogGroupsFail(e: any) {
      console.log("In GroupDrawer: Operation fail ", e.statusText);
    }
  }
  console.log("In GroupDrawer: Done fetching...");
  const groups: Array<Group> = items.map((x) => ({
    groupName: x.title,
    groupLabel: x.id,
    controls: x.controls,
  }));

  console.log("group", groups);
  console.log("items", items);
  function handleAddNewGroup() {
    setAddNewGroup(true);
  }

  const Data: Group = {
    groupName: "Account Management",
    groupLabel: "AM",
  };
  const Data2: Group = {
    groupName: "Account Access",
    groupLabel: "AC",
  };
  const Data3: Group = {
    groupName: "Account Removal",
    groupLabel: "AR",
  };
  const All = [Data, Data2, Data3];
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
      SaveNewGroup();
      setAddNewGroup(false);
    }
    function SaveNewGroup() {
      const rootFile = "projects/catalog_" + data.projectUUID + "/oscal_data.json";
      const request_json = {
        oscal_file: rootFile,
        id: ID,
        title: Name,
        parent_id: "",
      };
      function addNewGroupSuccess(response: any) {
        console.log("successful addition of a new group", response);
      }
      function addNewGroupFail(e: any) {
        console.log("Fail to create a new group", e.statusText);
      }
      fetchTransaction("/add_group", request_json, addNewGroupSuccess, addNewGroupFail);
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
            left: 10,
            position: "absolute",
            background: "#F6F6F6",
            width: 306,
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
            <Grid sx={{ height: 23, top: 57, position: "absolute" }} container spacing={2}>
              <Grid xs={5}></Grid>
              <Grid xs={7}>
                <IconButton
                  sx={{
                    ":hover": {
                      backgroundColor: "#023E88",
                      color: "#FFFFFF",
                    },
                  }}
                >
                  <FormatIndentDecreaseIcon sx={{ color: "#BCC6D5" }} />
                </IconButton>
                <IconButton
                  sx={{
                    ":hover": {
                      backgroundColor: "#023E88",
                      color: "#FFFFFF",
                    },
                  }}
                >
                  <FormatIndentIncreaseIcon sx={{ color: "#BCC6D5" }} />
                </IconButton>
                <IconButton sx={{ color: "#B31515" }}>
                  <DeleteIcon />
                </IconButton>
                <IconButton
                  sx={{
                    ":hover": {
                      backgroundColor: "#023E88",
                      color: "#FFFFFF",
                    },
                  }}
                  onClick={handleSaveNewGroup}
                >
                  <SaveIcon sx={{ color: "#BCC6D5" }}></SaveIcon>
                </IconButton>
              </Grid>
            </Grid>
          </Grid>
        </Container>
        <Box
          sx={{
            left: 306,
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
  const GroupItem: React.FC<OSCALGroup> = (data) => {
    function handleGroupItem() {
      setSelectedItemName(data.group.groupName);
    }
    const itemSelected = selectedItemName === data.group.groupName ? true : false;
    const trunckatedName =
      data.group.groupName.length < 20
        ? data.group.groupName
        : data.group.groupName.substring(0, 19) + "...";
    return (
      <>
        <Container
          sx={{
            height: 48,
            border: "1px solid #D2D2D2",
            background: "#EAEAEA",
            width: drawerWidth,
          }}
          onClick={handleGroupItem}
        >
          <Container
            sx={{
              height: 48,
              left: open ? 20 : 8,
              position: "absolute",
              background: "#F6F6F6",
              border: "1px solid #D2D2D2",
              width: open ? 300 : 55,
              ":hover": {
                backgroundColor: "#EAEAEA",
              },
            }}
          >
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
                {data.group.groupLabel.toUpperCase()}
              </Typography>
            </Box>
            {open && (
              <GroupTooltip title={data.group.groupName}>
                <Typography
                  sx={{
                    left: 89,
                    top: 10,
                    position: "absolute",
                    fontSize: 14,
                    fontWeight: itemSelected ? 700 : 500,
                  }}
                >
                  {trunckatedName}
                </Typography>
              </GroupTooltip>
            )}
             {open && (
              <IconButton sx={{ left: 260, top: 2, position: "absolute" }}>
                <MoreVertIcon />
              </IconButton>
            )}
            <Box
              sx={{
                left: open ? 292.5 : 48,
                width: 6,
                height: 48,
                position: "absolute",
                background: itemSelected ? "#FF6600" : "#F6F6F6",
              }}
            ></Box>{" "}
          </Container>
        </Container>
      </>
    );
  };

  function Groups() {
    if (open)
      return (
        <Typography sx={{ color: "#ffffff", left: 20, position: "absolute" }}>GROUPS</Typography>
      );
    else return null;
  }

  const NewGroupButton: React.FC = () => {
    return (
      <>
        <Box sx={{ height: 4 }}></Box>
        <Grid container direction="row" sx={{ top: 40, height: 20 }}>
          <Grid sx={{ width: 157, height: 20 }}></Grid>
          <Grid sx={{ width: 143, height: 20 }}>
            <OSCALSecondaryButtonSmall disabled={addNewGroup} onClick={handleAddNewGroup}>
              <Typography sx={{ size: 12, fontWeight: 600, font: "Source Sans Pro" }}>
                NEW GROUP +
              </Typography>
            </OSCALSecondaryButtonSmall>
          </Grid>
        </Grid>
      </>
    );
  };

  return (
    <Grid container spacing={2} direction={"row"}>
      <Grid
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          whiteSpace: "nowrap",
          boxSizing: "border-box",
        }}
      >
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
        {groups.map((item) => (
          <GroupItem group={item} key={item.groupName}></GroupItem>
        ))}

        {addNewGroup && <NewGroupDialog></NewGroupDialog>}
        <NewGroupButton></NewGroupButton>
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
            GROUP A
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
  );
}

export default GroupDrawer;
