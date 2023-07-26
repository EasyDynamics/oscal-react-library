import React, { useState, useEffect } from "react";
import { EditableFieldProps } from "./OSCALEditableTextField";
import { ButtonGroup, Link, NativeSelect, Select, TextField } from "@mui/material";
import FormLabel from "@mui/material/FormLabel";
import BreadCrumbs from "@mui/material/Breadcrumbs";
import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import { Divider } from "@mui/material";
import { Stack, styled } from "@mui/system";
import { useFetchers } from "./Fetchers";
import { OSCALDialogTitle, OSCALEditingDialog } from "./styles/OSCALDialog";

import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepConnector from "@mui/material/StepConnector";
import StepLabel from "@mui/material/StepLabel";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";

import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import IconButton from "@mui/material/IconButton";
import { Typography, Container, Grid } from "@mui/material";

import {
  OSCALPrimaryButton,
  OSCALSecondaryButton,
  OSCALTertiaryButton,
  OSCALUnsatisfiedButton,
} from "./styles/OSCALButtons";
import { OSCALTextField, OSCALRadio, OSCALFormLabel } from "./styles/OSCALInputs";

import { FormatBold, FormatItalic, FormatQuote, Subscript, Superscript } from "@mui/icons-material";

import { CodeOffSharp } from "@mui/icons-material";

const Hug = styled(Container)`
  position: absolute;
  width: 348px;
  height: 36px;
  top: 120px;
  left: 950px;
`;

const StackBox = styled(Box)`
  position: absolute;
  top: 186px;
  left: 100px;
  width: 1088px;
  height: 800px;
`;

const ItemBox = styled(Box)`
  height: 187.11px;
  width: 351px;
  border-radius: 0px;
  border: 1px solid #00286726;
  box-shadow: 0px 0px 10px 0px #00000029;
  position: relative;
  background: #ffffff;
`;

const MainContainer = styled(Container)`
  position: absolute;
  width: 1440px;
  height: 900px;
  top: 0px;
  left: 150px;
  border: 1px;
  background: #f6f6f6;
`;

const ItemTitle = styled(Typography)`
  height: 25px;
  width: 340px;
  left: 332px;
  top: 197px;
  border-radius: nullpx;
  position: absolute;
  left: 3.06%;
  right: 69.17%;
  top: 5.89%;
  bottom: 75.33%;
  font-family: "Source Sans Pro";
  font-weight: 700;
  font-size: 20px;
  line-height: 25px;
  color: #002867;
`;
const LastModified = styled(Typography)`
  position: absolute;
  height: 18px;
  width: 350px;
  left: 332 px;
  top: 249 px;
  border-radius: nullpx;
  left: 3.08%;
  right: 62.27%;
  top: 32.69%;
  bottom: 70.31%;
  font-family: "Source Sans Pro";
  font-weight: 400;
  font-size: 14px;
  line-height: 18px;
  color: #2b2b2b;
`;
const ItemResult = styled(Typography)`
  position: absolute;
  height: 18px;
  width: 300px;
  left: 332.375px;
  top: 249px;
  border-radius: nullpx;
  left: 28.08%;
  right: 62.27%;
  top: 32.69%;
  bottom: 70.31%;
  font-family: "Source Sans Pro";
  font-weight: 700;
  font-size: 14px;
  line-height: 18px;
  color: #2b2b2b;
`;
const Version = styled(Typography)`
  height: 18px;
  width: 350px;
  left: 332px;
  top: 275px;
  border-radius: nullpx;
  position: absolute;
  left: 3.06%;
  right: 67.5%;
  top: 47.58%;
  bottom: 67.42%;
  font-family: "Source Sans Pro";
  font-weight: 400;
  font-size: 14px;
  line-height: 18px;
  color: #2b2b2b;
`;
const PublicationDate = styled(Typography)`
  height: 18px;
  width: 350px;
  left: 332.375px;
  top: 299px;
  border-radius: nullpx;
  position: absolute;
  left: 3.08%;
  right: 63.59%;
  top: 62.25%;
  bottom: 64.75%;
  font-family: "Source Sans Pro";
  font-weight: 400;
  font-size: 14px;
  line-height: 18px;
  color: #2b2b2b;
`;
const ItemDivider = styled(Divider)`
  height: 0px;
  width: 351.75px;
  border-radius: 0px;
  position: absolute;
  left: 0%;
  right: 53.35%;
  top: 25.91%;
  bottom: 74.09%;
  border: 1px solid #d9dfe8;
`;
const FormHeaderLabel = styled(FormLabel)`
  position: absolute;
  width: 350px;
  height: 40px;
  top: 116px;
  left: 100px;
  font-family: "Source Sans Pro";
  font-size: 32px;
  font-weight: 700px;
  line-height: 40.22px;
  color: #2b2b2b;
`;
const StepperBar = styled(Stepper)`
  width: 586px;
  height: 80px;
  border: 1px;
  font-family: "Source Sans Pro";
  font-size: 20px;
  font-weight: 700;
  line-height: 25px;
  letter-spacing: 0em;
  text-align: left;
  color: #ffffff;
`;
const StepItemLabel = styled(StepLabel)`
  width: 35px;
  height: 30px;
  top: 40px;
  left: 10px;
  font-family: Source Sans Pro;
  font-size: 20px;
  font-weight: 700;
  line-height: 25px;
  letter-spacing: 0em;
  text-align: left;
  background: #ffffff;
`;

const AddInformationLabel = styled(Typography)`
  width: 500px;
  height: 26px;
  top: 30px;
  left: 20px;
  font-family: "Source Sans Pro";
  font-weight: 700;
  line-height: 20px;
  letter-spacing: 0em;
  text-align: "left";
  color: #002867;
`;

const SecondLabel = styled(Typography)`
  font-family: "Source Sans Pro";
  font-weight: 400;
  line-height: 20px;
  letter-spacing: 0em;
  text-align: "left";
`;
const CTab = styled(Tab)`
  background: #d2d2d2;
  border: 1px solid #d2d2d2;
  font-family: Source Sans Pro;
  font-weight: 400;
  line-height: 20px;
  letter-spacing: 0em;
  text-align: left;
`;
const OSCALBreadCrumbs = styled(BreadCrumbs)`
  position: absolute;
  width: 800px;
  height: 100px;
  top: 96px;
  left: 100px;
  font-family: "Source Sans Pro";
  line-height: 20px;
`;
const OSCALLink = styled(Link)`
  color: "#002867";
  font-weight: 400;
  font-family: "Source Sans Pro";
  line-height: 20px;
`;
export interface ContactInfo extends EditableFieldProps {
  name?: string;
  phone?: string;
  email?: string;
  address?: Address;
}
export interface Address extends EditableFieldProps {
  line1?: string;
  line2?: string;
  city?: string;
  state?: string;
  zip?: string;
}
interface CatalogBaseline extends EditableFieldProps {
  isVisible: boolean;
  isCatalog?: boolean;
  title?: string;
  lastModified?: string;
  publicationDate?: string;
  projectUUID?: string;
  documentVersion?: string;
  description?: string;
  orgContactInfo?: ContactInfo;
  authorContactInfo?: ContactInfo;
}
export interface OSCALModel extends EditableFieldProps {
  model: CatalogBaseline;
  startCollectingOrgDetails?: boolean;
  startCollectingAuthorDetails?: boolean;
}

interface OSCALModelMetadataInfo extends EditableFieldProps {
  readonly title?: string;
  readonly lastModified?: string;
  readonly version?: string;
  readonly publicationDate?: string;
  projectUUID?: string;
  isCatalog?: boolean;
}

export interface ItemList {
  readonly Items: Array<OSCALModelMetadataInfo>;
}
export interface Project {
  readonly ProjectUUID: string;
  readonly model: string;
}
export interface ProjectUUIDs {
  readonly CatalogUUIDS: Array<string>;
  readonly ProfileUUIDS: Array<string>;
}

export const CatalogBreadCrumbsMenu: React.FC<OSCALModel | undefined> = (item) => {
  if (item !== undefined && item.model.title !== undefined && item.model.title.length > 0)
    return (
      <OSCALBreadCrumbs
        aria-label="breadcrumb"
        sx={{
          ":hover": {
            color: "#FF6600",
          },
        }}
      >
        <OSCALLink
          href="/"
          sx={{
            ":hover": {
              color: "#FF6600",
            },
          }}
        >
          HOME
        </OSCALLink>
        <OSCALLink
          href="/"
          sx={{
            fontWeight: "700",
            ":hover": {
              color: "#FF6600",
            },
          }}
        >
          CATALOGS & BASELINES
        </OSCALLink>
        <OSCALLink
          href="/"
          sx={{
            color: "#002867",
            fontWeight: "700",
            ":hover": {
              color: "#FF6600",
            },
          }}
        >
          {" "}
          {item.model.title.toUpperCase()}
        </OSCALLink>
      </OSCALBreadCrumbs>
    );
  else
    return (
      <OSCALBreadCrumbs
        aria-label="breadcrumb"
        sx={{
          ":hover": {
            color: "#FF6600",
          },
        }}
      >
        <OSCALLink
          href="/"
          sx={{
            ":hover": {
              color: "#FF6600",
            },
          }}
        >
          HOME
        </OSCALLink>
        <OSCALLink
          href="/"
          sx={{
            color: "#002867",
            fontWeight: "700",
            ":hover": {
              color: "#FF6600",
            },
          }}
        >
          CATALOGS & BASELINES
        </OSCALLink>
      </OSCALBreadCrumbs>
    );
};

export function CatalogBaselineTabs() {
  const [value, setValue] = React.useState("1");

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  return (
    <Box
      sx={{
        width: 1070,
        height: 900,
        typography: "body1",
        top: 200,
        left: 100,
        position: "absolute",
        background: "linear-gradient(0deg, #FFFFFF, #FFFFFF)",
      }}
    >
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <TabList
            onChange={handleChange}
            aria-label="lab API tabs example"
            sx={{ background: "#F6F6F6" }}
          >
            <CTab
              label="Controls"
              value="1"
              sx={{
                ":focus": {
                  background: "#FFffff",
                  weight: 600,
                },
              }}
            />
            <CTab
              label="Catalog Details"
              value="2"
              sx={{
                ":focus": {
                  background: "#FFffff",
                  weight: 600,
                },
              }}
            />
            <CTab
              label="Directory"
              value="3"
              sx={{
                ":focus": {
                  background: "#FFffff",
                  weight: 600,
                },
              }}
            />
            <CTab
              label="Resources"
              value="4"
              sx={{
                ":focus": {
                  background: "#FFffff",
                  weight: 600,
                },
              }}
            />
          </TabList>
        </Box>
        <TabPanel value="1">Controls</TabPanel>
        <TabPanel value="2">Catalog Details</TabPanel>
        <TabPanel value="3">Directory</TabPanel>
        <TabPanel value="4">Back Matter</TabPanel>
      </TabContext>
    </Box>
  );
}
export function OSCALDateTimeConversion(oscalTime: string): string {
  let regularTime = oscalTime;
  if (oscalTime.includes("-") && oscalTime.includes("T") && oscalTime.includes(":")) {
    const vector = oscalTime.split("-");
    const year = vector[0];
    const month = vector[1];
    const nextStep = vector[2].split("T");
    const day = nextStep[0];
    const time = nextStep[1];
    const lastStep = time.split(":");
    const hourString = lastStep[0];
    const min = lastStep[1];
    const hourInt = parseInt(hourString);
    const meridian = hourInt < 12 ? "AM" : "PM";
    const realHour = hourInt % 12;
    regularTime =
      month + "/" + day + "/" + year + ", " + realHour.toString() + ":" + min + " " + meridian;
  }
  return regularTime;
}
export default function OSCALCatalogBaseline() {
  const fetchers = useFetchers();
  const fetchTransaction = fetchers["fetchTransaction"];
  const fetchRest = fetchers["fetchRest"];

  let Model = "Catalog";
  const [AddNewCatalogBaseline, setAddNewCatalogBaseline] = useState(false);
  const [AddOrgDetails, setAddOrgDetails] = useState(false);
  const [createdNewCatalogBaseline, setCreatedNewCatalogBaseline] = useState(false);
  const [AddAuthorDetails, setAddAuthorDetails] = useState(false);
  const [catalogIds, setCatalogIds] = useState<string[]>([]);
  const [baselineIds, setBaselineIds] = useState<string[]>([]);
  const Data: CatalogBaseline = {
    isCatalog: true,
    isVisible: true,
  };
  const [mainData, setMainData] = useState<CatalogBaseline>(Data);
  const [orgAddress, setOrgAddress] = useState<Address>({});
  const [orgContact, setOrgContact] = useState<ContactInfo>({});
  const [authorAddress, setAuthorAddress] = useState<Address>({});
  const [authorContact, setAuthorContact] = useState<ContactInfo>({});
  const [openCatalogBaseline, setOpenCatalogBaseline] = useState(false);
  const [newOSCALModel, setNewOSCALModel] = useState<CatalogBaseline | undefined>(undefined);
  let newModelCreationDone = false;
  let address: Address = orgAddress;
  let contact: ContactInfo = {};
  address = authorAddress;
  const createdModel = newOSCALModel === undefined ? Data : newOSCALModel;
  const LabelText = openCatalogBaseline ? createdModel.title : " Catalogs & Baselines";

  useEffect(() => {
    getCatalogIds();
    getBaselineIds();
  }, []);

  function getCatalogIds() {
    const request_json = {
      method: "GET",
    };
    fetchRest(
      "/catalog",
      request_json,
      getCatalogProjectsStatusSuccess,
      getCatalogProjectsStatusFail
    );

    function getCatalogProjectsStatusSuccess(response: {
      [x: string]: React.SetStateAction<string[]>;
    }) {
      setCatalogIds(response["projects"]);
    }
    function getCatalogProjectsStatusFail(e: any) {
      console.log("Operation fail " + e.statusText);
    }
  }

  function renderTabs() {
    if (openCatalogBaseline) return <CatalogBaselineTabs></CatalogBaselineTabs>;
    else return null;
  }

  function getBaselineIds() {
    const request_json = {
      method: "GET",
    };
    fetchRest(
      "/profile",
      request_json,
      getProfileProjectsStatusSuccess,
      getProfileProjectsStatusFail
    );

    function getProfileProjectsStatusSuccess(response: {
      [x: string]: React.SetStateAction<string[]>;
    }) {
      setBaselineIds(response["projects"]);
    }
    function getProfileProjectsStatusFail(e: any) {
      console.log("Operation fail " + e.statusText);
    }
  }
  class DeleteCatalogBaseline extends React.Component {
    render() {
      return (
        <Hug>
          <Grid spacing={1}>
            <OSCALUnsatisfiedButton sx={{ width: 57, height: 20, color: "#FFD9D9" }}>
              DELETE
            </OSCALUnsatisfiedButton>
            <OSCALSecondaryButton
              sx={{ width: 88, height: 20 }}
              onClick={handleAddNewCatalogBaseline}
            >
              PUBLISH
            </OSCALSecondaryButton>
          </Grid>
        </Hug>
      );
    }
  }
  class HugHug extends React.Component {
    render() {
      return (
        <Hug>
          <Grid spacing={1}>
            <OSCALTertiaryButton sx={{ width: 57, height: 20 }}>UPLOAD</OSCALTertiaryButton>
            <OSCALSecondaryButton
              sx={{ width: 88, height: 20 }}
              onClick={handleAddNewCatalogBaseline}
            >
              CREATE NEW +
            </OSCALSecondaryButton>
          </Grid>
        </Hug>
      );
    }
  }

  const handleAddNewCatalogBaseline = () => {
    setAddNewCatalogBaseline(true);
  };

  const HeaderRow: React.FC<OSCALModel> = (item) => {
    if (!openCatalogBaseline) return null;
    return (
      <>
        <Grid container direction="row">
          <Grid>
            <Typography
              sx={{
                left: 100,
                top: 162,
                fontSize: 14,
                fontFamily: "Source Sans Pro",
                fontStyle: "normal",
                fontWeight: 400,
                position: "absolute",
              }}
            >
              Document Version:
            </Typography>
          </Grid>
          <Grid>
            <Typography
              sx={{
                left: 215,
                top: 160,
                fontSize: 16,
                fontFamily: "Source Sans Pro",
                fontStyle: "normal",
                fontWeight: 700,
                position: "absolute",
              }}
            >
              {" "}
              {item.model.documentVersion}{" "}
            </Typography>
          </Grid>
        </Grid>
        <Grid container direction="row">
          <Grid>
            <Typography
              sx={{
                left: 295,
                top: 162,
                fontSize: 14,
                fontFamily: "Source Sans Pro",
                fontStyle: "normal",
                fontWeight: 400,
                position: "absolute",
              }}
            >
              Last Modified:
            </Typography>
          </Grid>
          <Grid>
            <Typography
              sx={{
                left: 385,
                top: 160,
                fontSize: 16,
                fontFamily: "Source Sans Pro",
                fontStyle: "normal",
                fontWeight: 700,
                position: "absolute",
              }}
            >
              {OSCALDateTimeConversion(item.model.lastModified ?? "")}{" "}
            </Typography>
          </Grid>
        </Grid>
        <Grid container direction="row">
          <Grid>
            <Typography
              sx={{
                left: 560,
                top: 162,
                fontSize: 14,
                fontFamily: "Source Sans Pro",
                fontStyle: "normal",
                fontWeight: 400,
                position: "absolute",
              }}
            >
              Publication Date:
            </Typography>
          </Grid>
          <Grid>
            <Typography
              sx={{
                left: 663,
                top: 161,
                fontSize: 14,
                fontFamily: "Source Sans Pro",
                fontStyle: "normal",
                fontWeight: 700,
                position: "absolute",
              }}
            >
              {" "}
              {OSCALDateTimeConversion(item.model.publicationDate ?? "Not published")}
            </Typography>
          </Grid>
        </Grid>
      </>
    );
  };

  const CatalogBaselineItem: React.FC<OSCALModelMetadataInfo> = (item) => {
    function fontSizeCorrection(title: string): number {
      if (title.length < 40) return 14;
      else if (title.length >= 40 && title.length < 60) return 13;
      else if (title.length >= 60 && title.length < 80) return 12;
      return 10;
    }
    function fontSizeCorrectionTitle(title: string): number {
      if (title.length < 40) return 20;
      else if (title.length >= 40 && title.length < 60) return 15;
      else if (title.length >= 60 && title.length < 100) return 10;
      return 8;
    }
    function topAdjusted(title: string): string {
      if (title.length < 25) return " 5.89%";
      else return "3.00%";
    }
    const type = item.isCatalog ? "Catalog" : "Baseline";
    function handleOpenCatalogBaseline() {
      const model: CatalogBaseline = {
        title: item.title,
        lastModified: item.lastModified,
        documentVersion: item.version,
        publicationDate: item.publicationDate,
        projectUUID: item.projectUUID,
        isVisible: true,
        isCatalog: item.isCatalog,
      };
      setNewOSCALModel(model);
      setOpenCatalogBaseline(true);
    }
    const published = item.publicationDate ?? "Not published";
    return (
      <ItemBox component="span">
        <ItemTitle
          sx={{
            fontSize: fontSizeCorrectionTitle(item.title ?? ""),
            top: topAdjusted(item.title ?? ""),
          }}
        >
          {item.title}
        </ItemTitle>
        <ItemDivider />
        <Grid container direction="row">
          <Grid>
            <LastModified> Last Modified: </LastModified>
            <ItemResult sx={{ fontSize: fontSizeCorrection(item.lastModified ?? "") }}>
              {" "}
              {OSCALDateTimeConversion(item.lastModified ?? "")}
            </ItemResult>
          </Grid>
        </Grid>
        <Grid container direction="row">
          <Grid>
            <Version>Document Version:</Version>
          </Grid>
          <Grid>
            <ItemResult
              sx={{ left: "35%", top: "47.58%", fontSize: fontSizeCorrection(item.version ?? "") }}
            >
              {" "}
              {item.version}{" "}
            </ItemResult>
          </Grid>
        </Grid>
        <Grid container direction="row">
          <Grid>
            <PublicationDate> Publication Date:</PublicationDate>
          </Grid>
          <Grid>
            <ItemResult
              sx={{
                left: "32%",
                top: "62.25%",
                fontSize: fontSizeCorrection(published),
              }}
            >
              {OSCALDateTimeConversion(published)}{" "}
            </ItemResult>{" "}
          </Grid>
        </Grid>
        <Container
          sx={{
            height: 39,
            width: 352,
          }}
        >
          <OSCALPrimaryButton
            sx={{
              height: 39,
              width: 352,
              left: 0,
              borderRadius: 0,
              position: "absolute",
              right: "53.33%",
              top: "78.89%",
              bottom: "35.78%",
            }}
            onClick={handleOpenCatalogBaseline}
          >
            OPEN {type}
          </OSCALPrimaryButton>
        </Container>
      </ItemBox>
    );
  };

  function ButtonBar() {
    return (
      <Grid
        sx={{
          flexGrow: 1,
          top: 15,
          background: "#ffffff",
          height: 20,
        }}
        container
        spacing={0}
      >
        <ButtonGroup size="small" aria-label="small button group">
          <IconButton edge="start" aria-label="menu">
            <FormatBold sx={{ border: "1px solid #CCCCCC" }} />
          </IconButton>
          <IconButton edge="start" aria-label="menu">
            <FormatItalic sx={{ border: "1px solid #CCCCCC" }} />
          </IconButton>
          <IconButton edge="start" aria-label="menu">
            <CodeOffSharp sx={{ border: "1px solid #CCCCCC" }} />
          </IconButton>
          <IconButton edge="start" aria-label="menu">
            <FormatQuote sx={{ border: "1px solid #CCCCCC" }} />
          </IconButton>
          <IconButton edge="start" aria-label="menu">
            <Subscript sx={{ border: "1px solid #CCCCCC" }} />
          </IconButton>
          <IconButton edge="start" aria-label="menu">
            <Superscript sx={{ border: "1px solid #CCCCCC" }} />
          </IconButton>
        </ButtonGroup>
      </Grid>
    );
  }
  const ToolBarMenu: React.FC<{ hasDropdown: boolean | null }> = (item) => {
    if (item.hasDropdown != null && item.hasDropdown) {
      return (
        <Box
          justifyContent="center"
          sx={{
            height: 12,
          }}
        >
          <Grid container spacing={0}>
            <Grid xs={5}>
              <Container></Container>
            </Grid>
            <Grid xs={3}>
              <Container>
                <NativeSelect
                  defaultValue={30}
                  inputProps={{
                    name: "font",
                    id: "uncontrolled-native",
                  }}
                  sx={{ width: 100, border: "1px" }}
                >
                  <option value={10}>Times New Roman</option>
                  <option value={20}>Sans Pro</option>
                  <option value={30}>Normal</option>
                </NativeSelect>
              </Container>
            </Grid>
            <Grid xs={4}>
              <Box>
                <ButtonBar></ButtonBar>
              </Box>
            </Grid>
          </Grid>
        </Box>
      );
    } else {
      return (
        <Box
          justifyContent="center"
          sx={{
            height: 12,
          }}
        >
          <Grid container spacing={1}>
            <Grid xs={8}>
              <Container></Container>
            </Grid>
            <Grid xs={4}>
              <Box>
                <ButtonBar></ButtonBar>
              </Box>
            </Grid>
          </Grid>
        </Box>
      );
    }
  };

  const AddOrgAuthorDetailsDialog: React.FC<OSCALModel> = (data) => {
    Model = data.model.isCatalog ? "Catalog" : "Baseline";
    const [newOSCALFilePath, setNewOSCALFilePath] = useState("");
    if (data.startCollectingOrgDetails) contact = data.model.orgContactInfo ?? {};
    if (data.startCollectingAuthorDetails) contact = data.model.authorContactInfo ?? {};
    address = contact.address ?? {};
    const title = "Add a New " + Model;
    function handleEditOrgNameChange(event: { target: { value: string | undefined } }) {
      contact.name = event.target.value;
    }
    function handleEditAddressLine1Change(event: { target: { value: string | undefined } }) {
      address.line1 = event.target.value;
    }
    function handleEditAddressLine2Change(event: { target: { value: string | undefined } }) {
      address.line2 = event.target.value;
    }
    function handleEditOrgPhoneChange(event: { target: { value: string | undefined } }) {
      contact.phone = event.target.value;
    }
    function handleEditOrgEmailChange(event: { target: { value: string | undefined } }) {
      contact.email = event.target.value;
    }
    function handleEditCityChange(event: { target: { value: string | undefined } }) {
      address.city = event.target.value;
    }

    function handleEditStateChange(event: { target: { value: string | undefined } }) {
      address.state = event.target.value;
    }
    function handleEditZipChange(event: { target: { value: string | undefined } }) {
      address.zip = event.target.value;
    }

    const handleCloseOrgDetails = () => {
      contact.address = address;
      setAddOrgDetails(false);
      setAddNewCatalogBaseline(true);
      setOrgAddress(address);
      setOrgContact(contact);
      data.model.orgContactInfo = orgContact;
      setMainData(data.model);
      console.log("In Handle CloseOrg ", data);
    };
    const handleAddAuthorDetails = () => {
      setAddOrgDetails(false);
      setAddNewCatalogBaseline(false);
      setAddAuthorDetails(true);
      data.model.orgContactInfo = orgContact;
      setMainData(data.model);
      contact = authorContact;
      newModelCreationDone = false;
    };

    const handleCloseAuthorDetails = () => {
      contact.address = address;
      setAddOrgDetails(true);
      setAddNewCatalogBaseline(false);
      setAddAuthorDetails(false);
      setAuthorAddress(address);
      setAuthorContact(contact);
      data.model.authorContactInfo = authorContact;
      setMainData(data.model);
    };
    const handleCreateNewCatalogBaseline = () => {
      setCreatedNewCatalogBaseline(true);
      createNewProject();
      wrapper();
      setAddOrgDetails(false);
      setAddNewCatalogBaseline(false);
      setAddAuthorDetails(false);
      setOpenCatalogBaseline(true);
      setNewOSCALModel(data.model);
      setOpenCatalogBaseline(true);
    };

    useEffect(() => {
      createNewProject();
      wrapper();
    });
    function wrapper() {
      if (newOSCALFilePath.length > 0) {
        updateMetadata();
      }
    }
    function createNewProject() {
      // if (AddAuthorDetails) return;
      if (createdNewCatalogBaseline) return;
      const rootFile = data.model.isCatalog ? "empty-catalog.json" : "empty-profile.json";
      const request_json = {
        file: rootFile,
      };
      function createNewModelSuccess(response: any) {
        console.log("successful creation of a new catalog/baseline", response["new_oscal_file"]);
        setNewOSCALFilePath(response["new_oscal_file"]);
      }
      function createNewModelFail(e: any) {
        console.log("Fail to create a new Catalog/Baseline", e.statusText);
      }
      if (!newModelCreationDone) {
        console.log("starting the creation of a new catalog/baseline");
        fetchTransaction(
          "/create_oscal_project",
          request_json,
          createNewModelSuccess,
          createNewModelFail
        );
        newModelCreationDone = true;
      }
    }

    function updateMetadata() {
      const date = new Date();
      const nowDate = date.toLocaleDateString();
      const nowTime = date.toLocaleTimeString();
      console.log("Start updating the metadata of this project ", newOSCALFilePath);
      data.model.lastModified = nowDate + ", " + nowTime; // "2023-07-19T13:57:28.91745-04:00"
      data.model.projectUUID = getProjectUUID(newOSCALFilePath);
      const inputs = {
        oscal_file: newOSCALFilePath,
        title: data.model.title ?? "",
        last_modified: data.model.lastModified,
        version: data.model.documentVersion,
        oscal_version: "1.0.6",
        description: data.model.description ?? " ",
      };
      const operation = "/add_metadata_entries";
      console.log(JSON.stringify(inputs));
      fetchTransaction(operation, inputs, updateMetadataSuccess, updateMetadataFail);

      function updateMetadataSuccess(response: any) {
        console.log("Successful update of metadata of project ", newOSCALFilePath + " ", response);
      }
      function updateMetadataFail(e: any) {
        console.log("Fail updating metadata of ", newOSCALFilePath, e.statusText);
      }
      setCreatedNewCatalogBaseline(true);
    }
    let previousStep = "Previous";
    let nextStep = "Next";
    let handleClose: () => void = () => {};
    let handleNextStep: () => void = () => {};
    let contactInfo: ContactInfo | undefined = {};
    let agent = "";
    let step = 1;
    if (AddOrgDetails && data.startCollectingOrgDetails) {
      contactInfo = data.model.orgContactInfo;
      agent = "Organization";
      handleClose = handleCloseOrgDetails;
      handleNextStep = handleAddAuthorDetails;
      previousStep = "Previous";
      nextStep = "Next";
      step = 1;
    }
    if (AddAuthorDetails && data.startCollectingAuthorDetails) {
      contactInfo = data.model.authorContactInfo;
      agent = "Author";
      previousStep = "Previous";
      const type = data.model.isCatalog ? "Catalog" : "Baseline";
      nextStep = "Create " + type;
      handleClose = handleCloseAuthorDetails;
      handleNextStep = handleCreateNewCatalogBaseline;

      step = 2;
    }

    return (
      <Dialog
        open={data.model.isVisible}
        onClose={handleClose}
        fullWidth={true}
        sx={{ top: -30, left: 530, width: 560, height: 950 }}
      >
        <OSCALDialogTitle title={title} onClose={handleClose} />
        <DialogContent sx={{ overflow: "hidden" }}>
          <Grid container rowSpacing={2} justifyContent="center">
            <Grid item xs={12} sx={{ height: 100 }}>
              <StepperBar
                alternativeLabel
                activeStep={step}
                connector={
                  <StepConnector sx={{ left: -155, width: 165, border: "1px solid #023E88" }} />
                }
              >
                <Step key="catalog" sx={{ width: 40, height: 40 }}>
                  <StepItemLabel>{Model} Details</StepItemLabel>
                </Step>
                <Step key="org" sx={{ width: 40, height: 40 }}>
                  <StepItemLabel>Org Details</StepItemLabel>
                </Step>
                <Step key="author" sx={{ width: 40, height: 40 }}>
                  <StepItemLabel>Author Details</StepItemLabel>
                </Step>
              </StepperBar>
            </Grid>
            <Grid item xs={12}>
              <AddInformationLabel>
                Add information about the organization that owns this {Model.toLowerCase()}:
              </AddInformationLabel>
            </Grid>
            <Grid item xs={12}>
              <OSCALTextField
                label={agent + " Name"}
                required={true}
                fullWidth
                id={agent + "Name"}
                onChange={handleEditOrgNameChange}
                defaultValue={contactInfo?.name}
                margin="none"
              />
              <OSCALTextField
                fullWidth
                label={agent + " Phone"}
                required={false}
                id={agent + "Phone"}
                onChange={handleEditOrgPhoneChange}
                defaultValue={contactInfo?.phone}
                margin="none"
              />
            </Grid>
            <Grid item xs={12}>
              <OSCALTextField
                fullWidth
                label={agent + " Email"}
                required={false}
                id={agent + "Email"}
                onChange={handleEditOrgEmailChange}
                defaultValue={contactInfo?.email}
              />
            </Grid>
            <Grid item xs={12}>
              <OSCALFormLabel label={agent + " Address"} required={false} />
              <SecondLabel>Address Line 1</SecondLabel>
              <TextField
                size="small"
                label=""
                fullWidth
                id={"address line 1"}
                onChange={handleEditAddressLine1Change}
                defaultValue={contactInfo?.address?.line1}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& > fieldset": {
                      borderColor: (theme) => theme.palette.secondary.main,
                    },
                  },
                }}
              ></TextField>
              <SecondLabel>Address Line 2</SecondLabel>
              <TextField
                fullWidth
                size="small"
                id={"address line 2"}
                onChange={handleEditAddressLine2Change}
                defaultValue={contactInfo?.address?.line2}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& > fieldset": {
                      borderColor: (theme) => theme.palette.secondary.main,
                    },
                  },
                }}
              />
              <SecondLabel>City</SecondLabel>
              <TextField
                defaultValue={contactInfo?.address?.city}
                fullWidth
                size="small"
                id={"city"}
                onChange={handleEditCityChange}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& > fieldset": {
                      borderColor: (theme) => theme.palette.secondary.main,
                    },
                  },
                }}
              />
              <SecondLabel>State</SecondLabel>
              <Select
                defaultValue={contactInfo?.address?.state}
                fullWidth
                id={"state"}
                size="small"
                onChange={handleEditStateChange}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& > fieldset": {
                      borderColor: (theme) => theme.palette.secondary.main,
                    },
                  },
                }}
              >
                <option value={"AL"}>AL</option>
                <option value={"AR"}>AR</option>
                <option value={"MD"}>MD</option>
              </Select>
              <SecondLabel>ZIP</SecondLabel>
              <TextField
                defaultValue={contactInfo?.address?.zip}
                id={"zip"}
                size="small"
                onChange={handleEditZipChange}
                sx={{
                  width: 100,
                  "& .MuiOutlinedInput-root": {
                    "& > fieldset": {
                      borderColor: (theme) => theme.palette.secondary.main,
                    },
                  },
                }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <OSCALSecondaryButton onClick={handleClose}> {previousStep} </OSCALSecondaryButton>
          <OSCALPrimaryButton onClick={handleNextStep}> {nextStep} </OSCALPrimaryButton>
        </DialogActions>
      </Dialog>
    );
  };

  function getProjectUUID(path: string): string {
    if (path.length > 0 && path.includes("/")) {
      const parts = path.split("/");
      const term = parts[1];
      if (term.length > 0 && term.includes("_")) {
        const subparts = term.split("_");
        return subparts[1];
      }
      return "";
    }
    return "";
  }

  const AddCatalogDetailsDialog: React.FC<OSCALModel> = (data) => {
    if (data.model.isCatalog !== undefined) Model = data.model.isCatalog ? "Catalog" : "Baseline";
    const [selectedCatalogBaseline, setSelectedCatalogBaseline] = useState<string>(Model);
    function handleCatalogBaselineRadioChange(event: React.ChangeEvent<HTMLInputElement>) {
      setSelectedCatalogBaseline(event.target.value);
    }

    data.model.isCatalog = selectedCatalogBaseline === "Catalog" ? true : false;
    Model = selectedCatalogBaseline;
    const handleCloseAddNewCatalogBaseline = () => {
      setAddNewCatalogBaseline(false);
      data.model.orgContactInfo = orgContact;
      setMainData(data.model);
    };
    const handleAddOrgDetails = () => {
      setAddOrgDetails(true);
      setAddNewCatalogBaseline(false);
      setAddAuthorDetails(false);
      data.model.orgContactInfo = orgContact;
      setMainData(data.model);
    };
    const title = "Add a New " + Model;
    function handleEditTitleChange(event: { target: { value: string | undefined } }) {
      data.model.title = event.target.value;
    }
    function handleEditDocumentVersionChange(event: React.ChangeEvent<HTMLInputElement>) {
      data.model.documentVersion = event.target.value;
    }
    function handleEditDescriptionChange(event: React.ChangeEvent<HTMLInputElement>) {
      data.model.description = event.target.value;
    }
    if (AddNewCatalogBaseline)
      return (
        <OSCALEditingDialog
          open={data.model.isVisible}
          onClose={handleCloseAddNewCatalogBaseline}
          fullWidth={true}
          sx={{ top: 80, left: 490, width: 600, position: "absolute" }}
        >
          <OSCALDialogTitle title={title} onClose={handleCloseAddNewCatalogBaseline} />
          <DialogContent sx={{ width: "100%", height: 600, overflow: "hidden" }}>
            <Grid container rowSpacing={2} justifyContent="center" sx={{ width: "100%" }}>
              <Grid item xs={12} sx={{ height: 100 }}>
                <StepperBar
                  alternativeLabel
                  sx={{ width: "100%", border: "1px solid #023E88" }}
                  connector={
                    <StepConnector sx={{ left: -165, width: 175, border: "1px solid #023E88" }} />
                  }
                >
                  <Step key="catalog" sx={{ width: 40, height: 40 }}>
                    <StepItemLabel>{Model} Details</StepItemLabel>
                  </Step>
                  <Step key="org" sx={{ width: 40, height: 40, left: 50 }}>
                    <StepItemLabel>Org Details</StepItemLabel>
                  </Step>
                  <Step key="author" sx={{ width: 40, height: 40, left: 90 }}>
                    <StepItemLabel>Author Details</StepItemLabel>
                  </Step>
                </StepperBar>
              </Grid>
              <Grid item xs={12}>
                <AddInformationLabel>
                  Add information about the {Model.toLowerCase()}:
                </AddInformationLabel>
              </Grid>
              <Grid item xs={12}>
                <OSCALFormLabel
                  label={"Would you like to create a catalog or baseline?"}
                  required={true}
                />
                <RadioGroup
                  name="subject-radio-buttons-group"
                  value={selectedCatalogBaseline}
                  onChange={(event) => handleCatalogBaselineRadioChange(event)}
                >
                  <FormControlLabel
                    key={"subject-radio_0"}
                    value={"Catalog"}
                    control={<OSCALRadio />}
                    label={"Catalog"}
                  />
                  <FormControlLabel
                    key={"subject-radio_1"}
                    value={"Baseline"}
                    control={<OSCALRadio />}
                    label={"Baseline"}
                  />
                </RadioGroup>
              </Grid>
              <Grid item xs={12}>
                <OSCALTextField
                  label={Model + " Title"}
                  required={true}
                  id={"title"}
                  onChange={handleEditTitleChange}
                  defaultValue={data.model.title}
                  fullWidth
                />
                <ToolBarMenu hasDropdown={false}></ToolBarMenu>
              </Grid>
              <Grid item xs={12}>
                <OSCALTextField
                  label={"Document Version"}
                  required={true}
                  id={"document-version"}
                  onChange={handleEditDocumentVersionChange}
                  defaultValue={data.model.documentVersion}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sx={{ height: 90 }}>
                <OSCALTextField
                  label={Model + " Description "}
                  required={false}
                  multiline={true}
                  id={"Catalog-new-description"}
                  onChange={handleEditDescriptionChange}
                  defaultValue={data.model.description}
                  fullWidth
                  rows={3}
                  SelectProps={{
                    MenuProps: {
                      anchorOrigin: {
                        vertical: "bottom",
                        horizontal: "left",
                      },
                    },
                  }}
                />
                <ToolBarMenu hasDropdown={true}></ToolBarMenu>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <OSCALSecondaryButton onClick={handleCloseAddNewCatalogBaseline}>
              Cancel
            </OSCALSecondaryButton>
            <OSCALPrimaryButton onClick={handleAddOrgDetails}>Next</OSCALPrimaryButton>
          </DialogActions>
        </OSCALEditingDialog>
      );
    else return null;
  };

  function renderHugHug() {
    if (!openCatalogBaseline) return <HugHug></HugHug>;
    else return <DeleteCatalogBaseline></DeleteCatalogBaseline>;
  }
  function renderAuthorDetailDialog() {
    if (!AddAuthorDetails) return null;

    return (
      <AddOrgAuthorDetailsDialog
        startCollectingAuthorDetails={true}
        startCollectingOrgDetails={false}
        model={mainData}
      />
    );
  }
  function renderOrgDetailsDialog() {
    if (!AddOrgDetails) return null;

    return (
      <AddOrgAuthorDetailsDialog
        startCollectingAuthorDetails={false}
        startCollectingOrgDetails={true}
        model={mainData}
      />
    );
  }
  function renderAddNewCatalogBaselineDialog() {
    if (!AddNewCatalogBaseline) return null;

    return (
      <AddCatalogDetailsDialog
        startCollectingAuthorDetails={false}
        startCollectingOrgDetails={false}
        model={mainData}
      />
    );
  }
  function renderFilledItemBox() {
    if (openCatalogBaseline) return null;
    return (
      <RenderCatalogItems CatalogUUIDS={catalogIds} ProfileUUIDS={baselineIds}></RenderCatalogItems>
    );
  }
  const FilledBoxItem: React.FC<Project> = (project) => {
    const [metadataObject, setMetadataObject] = useState<any>({});
    console.log("In FilledBoxItem Id= ", project.ProjectUUID);
    console.log("In FilledBoxItem model=", project.model);
    useEffect(() => {
      getData();
    }, []);

    const isCatalog = project.model === "catalog" ? true : false;
    function getData() {
      const request_json = {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      };
      const operation =
        "/" + project.model + "/" + project.ProjectUUID + "/" + project.model + "/metadata";

      console.log(
        "In FilledItemBox: Starting fetching with operation",
        operation,
        "with request",
        request_json
      );

      fetchRest(operation, request_json, getCatalogMetadataSuccess, getCatalogMetadataFail);

      function getCatalogMetadataSuccess(response: any) {
        console.log("In FilledBoxItem: Successfull REST CAll with path", operation);
        setMetadataObject(response);
      }
      function getCatalogMetadataFail(e: any) {
        console.log("In FilledBoxItem: Operation fail ", e.statusText);
      }
    }
    console.log("In FilledItemBox: Done fetching...");

    return (
      <CatalogBaselineItem
        key={metadataObject.title}
        title={metadataObject.title}
        version={metadataObject["version"]}
        lastModified={metadataObject["last-modified"]}
        publicationDate={metadataObject["publication-date"]}
        projectUUID={project.ProjectUUID}
        isCatalog={isCatalog}
      ></CatalogBaselineItem>
    );
  };
  const RenderCatalogItems: React.FC<ProjectUUIDs> = (entries) => {
    console.log("In RenderCatalogItems:");
    console.log("entries", entries);
    return (
      <StackBox>
        <Stack spacing={{ xs: 10, sm: 2 }} direction="row" useFlexGap flexWrap="wrap">
          {entries.CatalogUUIDS.map((catalog) => (
            <FilledBoxItem key={catalog} ProjectUUID={catalog} model={"catalog"}></FilledBoxItem>
          ))}

          {entries.ProfileUUIDS.map((profile) => (
            <FilledBoxItem key={profile} ProjectUUID={profile} model={"profile"}></FilledBoxItem>
          ))}
        </Stack>
      </StackBox>
    );
  };

  return (
    <MainContainer>
      {renderTabs()}
      <HeaderRow model={createdModel}></HeaderRow>
      <CatalogBreadCrumbsMenu model={createdModel}></CatalogBreadCrumbsMenu>
      <FormHeaderLabel> {LabelText}</FormHeaderLabel>
      {renderHugHug()}
      {renderFilledItemBox()}
      {renderAddNewCatalogBaselineDialog()}
      {renderOrgDetailsDialog()}
      {renderAuthorDetailDialog()}
    </MainContainer>
  );
}
