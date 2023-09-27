import React, { useState, useEffect } from "react";
import { EditableFieldProps } from "./OSCALEditableTextField";
import { Alert, Button, ButtonGroup, NativeSelect, TextField, Tooltip } from "@mui/material";
import BreadCrumbs from "@mui/material/Breadcrumbs";
import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import { Divider, TooltipProps } from "@mui/material";
import { Stack, styled } from "@mui/system";
import { useFetchers } from "./Fetchers";
import { OSCALDialogTitle, OSCALEditingDialog, OSCALWarningDialog } from "./styles/OSCALDialog";

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
import FileIcon from "./images/icons/filebucket.svg";
import UploadIcon from "./images/icons/fileUpload.svg";
import Uploading from "./images/icons/uploading.svg";
import GreenCircle from "./images/icons/greenCircle.svg";
import GreenCheck from "./images/icons/greenCheck.svg";
import RedCircle from "./images/icons/redCircle.svg";
import RedCheck from "./images/icons/redX.svg";
import BlueCircle from "./images/icons/blueCircle.svg";
import SemiCircle from "./images/icons/semiCircleOrange.svg";
import { Typography, Container, Grid } from "@mui/material";

import {
  OSCALPrimaryButton,
  OSCALSecondaryButton,
  OSCALTertiaryButton,
  OSCALTertiaryGrayscaleButton,
} from "./styles/OSCALButtons";
import { OSCALTextField, OSCALRadio, OSCALFormLabel } from "./styles/OSCALInputs";

import { FormatBold, FormatItalic, FormatQuote, Subscript, Superscript } from "@mui/icons-material";

import { CodeOffSharp } from "@mui/icons-material";
import { OSCALAlertError, OSCALAlertWarning } from "./styles/OSCALAlerts";
import GroupDrawer from "./OSCALCatalogManageGroup";

const MainImage = styled("img")`
  margin-right: 1em;
`;

const Hug = styled(Container)`
  position: absolute;
  width: 348px;
  height: 36px;
  top: 120px;
  left: 80%;
`;
const HugPublish = styled(Container)`
  position: absolute;
  width: 448px;
  height: 36px;
  top: 120px;
  left: 700px;
`;
const StackBox = styled(Box)`
  position: absolute;
  top: 186px;
  left: 40px;
  width: 100%;
  height: 100%;
`;

const ItemBox = styled(Box)`
  height: 187.11px;
  width: 331px;
  border-radius: 0px;
  border: 1px solid #00286726;
  box-shadow: 0px 0px 10px 0px #00000029;
  position: relative;
  background: #ffffff;
`;

const MainContainer = styled(Container)`
  position: absolute;
  width: 1120px;
  height: 900px;
  top: 0px;
  left: 320px;
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
  width: 331px;
  border-radius: 0px;
  position: absolute;
  left: 0%;
  right: 53.35%;
  top: 25.91%;
  bottom: 74.09%;
  border: 1px solid #d9dfe8;
`;
const FormHeaderLabel = styled(Typography)`
  position: absolute;
  width: 700px;
  height: 40px;
  top: 116px;
  left: 40px;
  font-family: "Source Sans Pro";
  font-size: 32px;
  font-weight: 700px;
  line-height: 40.22px;
  color: #2b2b2b;
`;
const StepperBar = styled(Stepper)`
  width: 506px;
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
  :focus {
    background: #ffffff;
    weight: 600;
  }
`;
const OSCALBreadCrumbs = styled(BreadCrumbs)`
  position: absolute;
  width: 800px;
  height: 100px;
  top: 96px;
  left: 40px;
  font-family: "Source Sans Pro";
  line-height: 20px;
  :hover {
    color: #ff6600;
  }
`;
const CatalogTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} arrow classes={{ popper: className }} />
))`
  font-size: 20;
  box-shadow: 0px 0px 10px 0px #00000029;
`;
const ButtonTypography = styled(Typography)`
  font-family: Source Sans Pro;
  font-size: 16px;
  font-weight: 600;
  line-height: 20px;
  letter-spacing: 0em;
  text-align: left;
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

export function CatalogBaselineTabs(data: OSCALModel) {
  const [value, setValue] = React.useState("1");

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  return (
    <Box
      sx={{
        minWidth: 1040,
        minHeight: 900,
        height: "90%",
        width: "90%",
        typography: "body1",
        top: 200,
        left: 40,
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
            <CTab label="Controls" value="1" />
            <CTab label="Catalog Details" value="2" />
            <CTab label="Directory" value="3" />
            <CTab label="Resources" value="4" />
          </TabList>
        </Box>
        <TabPanel value="1">
          <GroupDrawer projectUUID={data.model.projectUUID ?? ""}></GroupDrawer>
        </TabPanel>
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
  const fetchUploadFile = fetchers["fetchUploadFile"];

  let Model = "Catalog";
  const [AddNewCatalogBaseline, setAddNewCatalogBaseline] = useState(false);
  const [uploadNewCatalogBaseline, setUploadNewCatalogBaseline] = useState(false);
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
  const [noUploadCreateHug, setNoUploadCreatedHug] = useState(false);
  let newModelCreationDone = false;
  let address: Address = orgAddress;
  let contact: ContactInfo = {};
  address = authorAddress;
  const createdModel = newOSCALModel === undefined ? Data : newOSCALModel;
  const catalogBaselineTitle = openCatalogBaseline ? createdModel.title : " Catalogs & Baselines";
  const LabelText = uploadNewCatalogBaseline
    ? " Upload a Catalog or Baseline "
    : catalogBaselineTitle;

  Model = createdModel.isCatalog ? "Catalog" : "Baseline";

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

  function renderTabs(data: OSCALModel) {
    if (openCatalogBaseline) return <CatalogBaselineTabs model={data.model}></CatalogBaselineTabs>;
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
  function loadPage() {
    setCreatedNewCatalogBaseline(false);
    setOpenCatalogBaseline(false);
    setNewOSCALModel(undefined);
    setUploadNewCatalogBaseline(false);
    getCatalogIds();
    getBaselineIds();
    return { renderFilledItemBox };
  }
  const CatalogBreadCrumbsMenu: React.FC<OSCALModel | undefined> = (item) => {
    const usedTitle = item?.model.title ?? "";
    const trunckatedTitle = usedTitle.length > 30 ? usedTitle.substring(0, 29) + "..." : usedTitle;
    if (item !== undefined && item.model.title !== undefined && item.model.title.length > 0)
      return (
        <BreadCrumbs
          maxItems={3}
          itemsBeforeCollapse={1}
          itemsAfterCollapse={2}
          aria-label="breadcrumb"
          sx={{
            position: "absolute",
            width: 800,
            height: 100,
            top: 96,
            left: 40,
            ":hover": {
              color: "#ff6600",
            },
          }}
        >
          <Typography
            variant="h3"
            sx={{
              color: "#2b2b2b",
              ":hover": {
                color: "#ff6600",
              },
            }}
            onClick={loadPage}
          >
            Home
          </Typography>

          <Typography
            variant="h3"
            sx={{
              color: "#1d1d1d",
              ":hover": {
                color: "#ff6600",
              },
            }}
            onClick={loadPage}
          >
            CATALOGS & BASELINES
          </Typography>
          <CatalogTooltip title={usedTitle.toUpperCase()}>
            <Typography
              color="primary"
              variant={"h2"}
              sx={{
                width: 400,
                ":hover": {
                  color: "#ff6600",
                },
              }}
            >
              {trunckatedTitle.toUpperCase()}
            </Typography>
          </CatalogTooltip>
        </BreadCrumbs>
      );
    else if (uploadNewCatalogBaseline) {
      return (
        <OSCALBreadCrumbs
          aria-label="breadcrumb"
          maxItems={3}
          itemsBeforeCollapse={1}
          itemsAfterCollapse={2}
        >
          <Typography
            variant="h3"
            sx={{
              color: "#2b2b2b",
              ":hover": {
                color: "#ff6600",
              },
            }}
            onClick={loadPage}
          >
            Home
          </Typography>
          <OSCALTertiaryGrayscaleButton>
            <Typography
              variant="h3"
              sx={{
                color: "#1d1d1d",
                ":hover": {
                  color: "#ff6600",
                },
              }}
              onClick={loadPage}
            >
              CATALOGS & BASELINES
            </Typography>
          </OSCALTertiaryGrayscaleButton>
          <Typography
            color="primary"
            variant={"h2"}
            sx={{
              fontWeight: (theme) => theme.typography.fontWeightBold,
              textTransform: "uppercase",
              ":hover": {
                color: "#ff6600",
              },
              fontFamily: "Source Sans Pro",
            }}
          >
            UPLOAD
          </Typography>
        </OSCALBreadCrumbs>
      );
    }
    return (
      <OSCALBreadCrumbs
        aria-label="breadcrumb"
        maxItems={3}
        itemsBeforeCollapse={1}
        itemsAfterCollapse={2}
      >
        <Typography
          variant="h3"
          sx={{
            ":hover": {
              color: "#ff6600",
            },
          }}
          onClick={loadPage}
        >
          Home
        </Typography>

        <Typography
          color="primary"
          variant={"h2"}
          sx={{
            textTransform: "uppercase",
            ":hover": {
              color: "#ff6600",
            },
          }}
        >
          CATALOGS & BASELINES
        </Typography>
      </OSCALBreadCrumbs>
    );
  };
  function RenderUpload() {
    const [upload, setUpload] = useState(false);
    const [uploadSuccessful, setUploadSuccessfulStatus] = useState(false);
    const [startDropping, setStartDropping] = useState(false);
    const [fileName, setFileName] = useState("");
    const [newOSCALFilePath, setNewOSCALFilePath] = useState("");
    const [endUploading, setEndUploading] = useState(false);
    const [openWarningDialog, setOpenWarningDialog] = useState(true);
    function handleUpload() {
      setUpload(true);
      setNoUploadCreatedHug(true);
    }
    function handleClose() {
      setOpenWarningDialog(false);
    }
    const UploadTypo = styled(Typography)`
      font-family: Source Sans Pro;
      font-size: 20px;
      font-weight: 700;
      line-height: 25px;
      letter-spacing: 0em;
      text-align: left;
      color: #002867;
    `;
    const onUpload = (event: any) => {
      if (!event.target.files || event.target.files.length === 0) {
        console.log("Issues handling file import. Browser may not support file system upload.");
        return;
      }
      //const file = event.target.files[0];
      //  const fileUrl = URL.createObjectURL(file);  TODO Keeping this line of code if later we need to upload a file from a url.
      const files = event.target.files;
      setUploadSuccessfulStatus(true);
      doSubmitUploadFile(files[0]);
    };
    const handleDrag = (event: any) => {
      event.target.style.border = "2px dotted #0028675E";
      setStartDropping(true);
      setEndUploading(false);
      event.preventDefault();
      event.stopPropagation();
    };
    const handleDrop = (event: any) => {
      // Avoid opening document in new tab
      event.preventDefault();
      event.stopPropagation();
      event.target.style.border = "1px solid #0028675E";
      // Handle file import
      console.log("file dropped");
      console.log(event);
      // Handle successful file drop
      if (event.dataTransfer && event.dataTransfer.files.length !== 0) {
        const files = event.dataTransfer.files;
        console.log(files[0]);

        doSubmitUploadFile(files[0]);
      } else {
        console.log("Issues handling file import. Browser may not support drag and drop.");
      }
    };

    function doSubmitUploadFile(filename: File) {
      if (filename === null) {
        return;
      }
      setFileName(filename.name);
      console.log("Main File", filename.name);
      fetchUploadFile(filename, uploadFileSuccess, uploadFileFail);
    }
    function uploadFileSuccess(response: any) {
      const filename = response["filename"];
      console.log(
        "File " + filename + " uploaded successfully. Response was " + JSON.stringify(response)
      );

      const request_json = {
        file: filename,
      };
      fetchTransaction(
        "/create_oscal_project",
        request_json,
        createOscalProjectSuccess,
        createOscalProjectFail
      );
    }

    function uploadFileFail(e: any) {
      console.log("upload failed", e);
      setUploadSuccessfulStatus(false);
      setStartDropping(false);
    }

    function createOscalProjectSuccess(response: any) {
      console.log("upload successful", response);
      setNewOSCALFilePath(response["new_oscal_file"]);
      setUploadSuccessfulStatus(true);
      setStartDropping(false);
      setEndUploading(true);
    }

    function createOscalProjectFail(e: any) {
      console.log("upload failed", e);
      setUploadSuccessfulStatus(false);
      setStartDropping(false);
      setEndUploading(true);
    }
    function handleGoBack() {
      setStartDropping(false);
      setEndUploading(false);
      setUploadSuccessfulStatus(false);
    }
    function handleOpenFile() {
      const request_json = {
        oscal_file: newOSCALFilePath,
      };
      setUploadSuccessfulStatus(true);
      setUpload(true);
      setUploadNewCatalogBaseline(false);
      fetchTransaction("/get_metadata", request_json, getMetadataSuccess, getMetadataFail);
      function getMetadataSuccess(response: any) {
        console.log("newly response", response);
        const model: CatalogBaseline = {
          title: response.title,
          lastModified: response.lastModified,
          documentVersion: response.version,
          publicationDate: response.publicationDate,
          projectUUID: response.projectUUID,
          isVisible: true,
        };
        setNewOSCALModel(model);
        setOpenCatalogBaseline(true);
      }
      function getMetadataFail(e: any) {
        console.log("In FilledBoxItem: Operation fail ", e.statusText);
      }
    }
    const zeroCatalogBaseline = catalogIds.length === 0 && baselineIds.length === 0;
    return (
      <>
        {!uploadSuccessful && zeroCatalogBaseline && (
          <Box sx={{ width: 300, height: 400 }} overflow={"hidden"}>
            <MainImage
              sx={{ top: 330, left: 470, width: 150, position: "absolute" }}
              src={FileIcon}
            />
            <UploadTypo
              variant="h1"
              sx={{
                top: 510,
                left: 400,
                width: 400,
                height: 30,
                position: "absolute",
              }}
            >
              No catalogs or baselines defined!
            </UploadTypo>
            <OSCALPrimaryButton
              sx={{ top: 550, left: 450, width: 91, height: 36, position: "absolute" }}
              onClick={handleUpload}
            >
              <Typography>UPLOAD</Typography>
            </OSCALPrimaryButton>
            <OSCALTertiaryButton
              sx={{ top: 550, left: 540, width: 140, height: 36, position: "absolute" }}
              onClick={handleAddNewCatalogBaseline}
            >
              <Typography
                sx={{
                  fontFamily: "Source Sans Pro",
                  fontSize: 16,
                  fontWeight: 600,
                  lineHeight: 20,
                  letterSpacing: 0,
                  textAlign: "left",
                  color: "#023E88",
                }}
                onClick={handleAddNewCatalogBaseline}
              >
                CREATE NEW +
              </Typography>
            </OSCALTertiaryButton>
          </Box>
        )}
        {(upload || uploadNewCatalogBaseline) && (
          <Container
            sx={{
              top: 180,
              left: 40,
              height: 990,
              width: 1030,
              position: "absolute",
            }}
          >
            <Box
              sx={{
                top: 0,
                left: 0,
                height: 550,
                width: 1030,
                position: "absolute",
              }}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <Box
                sx={{
                  top: 20,
                  left: 0,
                  height: 400,
                  width: 1030,
                  background: "#ffffff",
                  position: "absolute",
                  border: "1xp dotted #0028675E",
                }}
              >
                {!startDropping && !endUploading && !uploadSuccessful && (
                  <Container>
                    <MainImage
                      sx={{ top: 100, left: 470, width: 72, position: "absolute" }}
                      src={UploadIcon}
                    />
                    <UploadTypo
                      variant="h2"
                      sx={{
                        top: 200,
                        left: 400,
                        width: 400,
                        position: "absolute",
                      }}
                    >
                      Drag and Drop Your File Here
                    </UploadTypo>
                    <UploadTypo
                      variant="h6"
                      sx={{
                        top: 250,
                        left: 490,
                        width: 100,
                        position: "absolute",
                      }}
                    >
                      OR
                    </UploadTypo>
                    <Button
                      component="label"
                      sx={{
                        top: 285,
                        left: 435,
                        width: 150,
                        position: "absolute",
                      }}
                    >
                      Choose a File
                      <input
                        type="file"
                        hidden
                        accept="application/json"
                        onChange={onUpload}
                      ></input>
                    </Button>
                  </Container>
                )}
                {startDropping && (
                  <Container>
                    <MainImage
                      sx={{
                        top: 100,
                        left: 505,
                        width: 70,
                        position: "absolute",
                      }}
                      src={BlueCircle}
                      alt="Easy Dynamics Logo"
                    />
                    <MainImage
                      sx={{
                        top: 100,
                        left: 538,
                        width: 40,
                        height: 70,
                        position: "absolute",
                      }}
                      src={SemiCircle}
                      alt="Easy Dynamics Logo"
                    />
                    <UploadTypo
                      variant="h6"
                      sx={{
                        top: 220,
                        left: 490,
                        width: 200,
                        position: "absolute",
                      }}
                    >
                      Uploading ...
                    </UploadTypo>
                  </Container>
                )}
                {uploadSuccessful && (
                  <Container>
                    <MainImage
                      sx={{
                        top: 118,
                        left: 505,
                        width: 72,
                        position: "absolute",
                      }}
                      src={GreenCircle}
                      alt="Easy Dynamics Logo"
                    />
                    <MainImage
                      sx={{
                        top: 135,
                        left: 515,
                        width: 50,
                        position: "absolute",
                      }}
                      src={GreenCheck}
                      alt="Easy Dynamics Logo"
                    />
                    <UploadTypo
                      variant="h6"
                      sx={{
                        top: 220,
                        left: 470,
                        width: 200,
                        position: "absolute",
                      }}
                    >
                      Upload Complete
                    </UploadTypo>
                    <Typography sx={{ top: 260, left: 390, width: 400, position: "absolute" }}>
                      {fileName} has been successfully uploaded.
                    </Typography>
                    <OSCALTertiaryButton
                      sx={{ top: 300, left: 370, position: "absolute" }}
                      onClick={loadPage}
                    >
                      GO BACK
                    </OSCALTertiaryButton>
                    <OSCALSecondaryButton
                      sx={{ top: 300, left: 470, position: "absolute" }}
                      onClick={handleGoBack}
                    >
                      UPLOAD MORE FILES
                    </OSCALSecondaryButton>
                    <OSCALPrimaryButton
                      sx={{ top: 300, left: 660, position: "absolute" }}
                      onClick={handleOpenFile}
                    >
                      {" "}
                      GO TO FILE
                    </OSCALPrimaryButton>
                  </Container>
                )}
                {!uploadSuccessful && endUploading && (
                  <Container>
                    <MainImage
                      sx={{
                        top: 127,
                        left: 490,
                        width: 72,
                        position: "absolute",
                      }}
                      src={RedCircle}
                      alt="Easy Dynamics Logo"
                    />
                    <MainImage
                      sx={{
                        top: 140,
                        left: 503,
                        width: 45,
                        position: "absolute",
                      }}
                      src={RedCheck}
                      alt="Easy Dynamics Logo"
                    />
                    <UploadTypo
                      variant="h6"
                      sx={{
                        top: 220,
                        left: 470,
                        width: 200,
                        position: "absolute",
                      }}
                    >
                      Upload Error
                    </UploadTypo>
                    <Typography sx={{ top: 260, left: 390, width: 400, position: "absolute" }}>
                      {fileName} was not uploaded.
                    </Typography>
                    <OSCALPrimaryButton
                      sx={{ top: 300, left: 370, position: "absolute" }}
                      onClick={loadPage}
                    >
                      GO BACK
                    </OSCALPrimaryButton>
                    <OSCALSecondaryButton
                      sx={{ top: 300, left: 470, position: "absolute" }}
                      onClick={handleGoBack}
                    >
                      UPLOAD MORE FILES
                    </OSCALSecondaryButton>
                  </Container>
                )}
              </Box>
            </Box>
            {!endUploading && (
              <UploadTypo
                sx={{
                  top: 422,
                  left: 5,
                  position: "absolute",
                }}
              >
                Accepted File Types: OSCAL Catalog or Profile in .xml or .json format only
              </UploadTypo>
            )}
            {!uploadSuccessful && endUploading && (
              <>
                <UploadTypo
                  sx={{
                    top: 422,
                    left: 5,
                    position: "absolute",
                  }}
                >
                  Accepted File Types: OSCAL Catalog or Profile in .xml or .json format only
                </UploadTypo>
                <Alert
                  severity="error"
                  sx={{
                    borderLeft: `10px solid #B31515`,
                    borderTop: `1px solid #B31515`,
                    borderBottom: `1px solid #B31515`,
                    borderRight: `1px solid #B31515`,
                    backgroundColor: "#FFD9D9",
                    minWidth: "30rem",
                    maxHeight: "17rem",
                    top: 465,
                    left: 0,
                    width: 990,
                    height: 80,
                    position: "absolute",
                  }}
                >
                  <Typography
                    variant={"h2"}
                    sx={{ top: 10, color: "#1A1A1A", position: "absolute" }}
                  >
                    ERROR!
                  </Typography>
                  <Typography
                    sx={{
                      top: 35,
                      textTransform: "uppercase",
                      textAlign: "left",
                      color: "#1A1A1A",
                      position: "absolute",
                    }}
                  >
                    Invalid file format:
                  </Typography>
                </Alert>
              </>
            )}
          </Container>
        )}
      </>
    );
  }

  function DeleteCatalogBaseline() {
    return (
      <HugPublish>
        <Grid spacing={1} container>
          <Button
            disableElevation
            variant="text"
            color="primary"
            sx={{ width: 170, height: 20, color: "#B31515" }}
          >
            <ButtonTypography> DELETE {Model.toUpperCase()}</ButtonTypography>
          </Button>
          <OSCALSecondaryButton
            sx={{ width: 170, height: 20 }}
            onClick={handleAddNewCatalogBaseline}
          >
            <ButtonTypography> PUBLISH {Model.toUpperCase()}</ButtonTypography>
          </OSCALSecondaryButton>
        </Grid>
      </HugPublish>
    );
  }
  function handleUpload() {
    setUploadNewCatalogBaseline(true);
  }
  function HugHug() {
    if (noUploadCreateHug) return null;
    return (
      <Hug>
        <Grid spacing={1} container>
          <OSCALTertiaryButton sx={{ width: 57, height: 36 }} onClick={handleUpload}>
            {" "}
            <ButtonTypography> UPLOAD </ButtonTypography>{" "}
          </OSCALTertiaryButton>
          <OSCALSecondaryButton
            sx={{ width: 150, height: 36 }}
            onClick={handleAddNewCatalogBaseline}
          >
            <ButtonTypography> CREATE NEW + </ButtonTypography>
          </OSCALSecondaryButton>
        </Grid>
      </Hug>
    );
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
                left: 40,
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
                left: 165,
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
                left: 225,
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
                left: 325,
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
                left: 510,
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
                left: 625,
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
    const usedTitle = item.title ?? "";
    const trunckatedTitle = usedTitle.length > 60 ? usedTitle.substring(0, 59) + "..." : usedTitle;
    return (
      <ItemBox component="span">
        <CatalogTooltip title={usedTitle}>
          <ItemTitle sx={{ top: topAdjusted(item.title ?? "") }}>{trunckatedTitle}</ItemTitle>
        </CatalogTooltip>
        <ItemDivider sx={{ top: usedTitle.length < 25 ? "25.91%" : "30.91%" }} />
        <Grid container direction="row">
          <Grid>
            <LastModified sx={{ top: usedTitle.length < 25 ? "32.69%" : "35.69%" }}>
              {" "}
              Last Modified:{" "}
            </LastModified>
            <ItemResult sx={{ top: usedTitle.length < 25 ? "32.69%" : "35.69%", left: "35%" }}>
              {" "}
              {OSCALDateTimeConversion(item.lastModified ?? "")}
            </ItemResult>
          </Grid>
        </Grid>
        <Grid container direction="row">
          <Grid>
            <Version sx={{ top: usedTitle.length < 25 ? "47.58%" : "49.58%" }}>
              Document Version:
            </Version>
          </Grid>
          <Grid>
            <ItemResult sx={{ left: "43%", top: usedTitle.length < 25 ? "47.58%" : "49.58%" }}>
              {" "}
              {item.version}{" "}
            </ItemResult>
          </Grid>
        </Grid>
        <Grid container direction="row">
          <Grid>
            <PublicationDate sx={{ top: usedTitle.length < 25 ? "62.25%" : "64.25%" }}>
              {" "}
              Publication Date:
            </PublicationDate>
          </Grid>
          <Grid>
            <ItemResult
              sx={{
                left: "38%",
                top: usedTitle.length < 25 ? "62.25%" : "64.25%",
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
              width: 331,
              left: 0,
              borderRadius: 0,
              position: "absolute",
              right: "53.33%",
              top: "78.89%",
              bottom: "35.78%",
            }}
            onClick={handleOpenCatalogBaseline}
          >
            <ButtonTypography sx={{ fontWeight: 700 }}> OPEN {type} </ButtonTypography>
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
                  defaultValue={1}
                  inputProps={{
                    name: "font",
                    id: "uncontrolled-native",
                  }}
                  sx={{ width: 100, border: "1px" }}
                >
                  <option value={1}>Normal</option>
                  <option value={2}>Heading 1</option>
                  <option value={3}>Heading 2</option>
                  <option value={4}>Heading 3</option>
                  <option value={5}>Heading 4</option>
                  <option value={6}>Heading 5</option>
                  <option value={7}>Heading 6</option>
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
      // createNewProject();
      submitNewFile();
      wrapper();
      setAddOrgDetails(false);
      setAddNewCatalogBaseline(false);
      setAddAuthorDetails(false);
      setOpenCatalogBaseline(true);
      setNewOSCALModel(data.model);
      setOpenCatalogBaseline(true);
    };

    useEffect(() => {
      // createNewProject();
      submitNewFile();
      wrapper();
    });
    function wrapper() {
      if (newOSCALFilePath.length > 0) {
        updateMetadata();
      }
    }
    function newFile() {
      const catalog_data = {
        uuid: window.self.crypto.randomUUID(),
        metadata: {},
        groups: [],
      };
      const catalog = {
        catalog: catalog_data,
      };
      const profile_data = {
        uuid: window.self.crypto.randomUUID(),
        metadata: {},
        import: [],
        "back-matter": {},
      };
      const profile = {
        profile: profile_data,
      };
      const catalog_file = new Blob([JSON.stringify(catalog)], { type: "application/json" });
      const profile_file = new Blob([JSON.stringify(profile)], { type: "application/json" });
      const file = data.model.isCatalog ? catalog_file : profile_file;
      return file;
    }
    function submitNewFile() {
      if (createdNewCatalogBaseline || data.model.title === undefined) return;
      const filename = newFile();
      if (filename === null) {
        return;
      }
      console.log("Main File", filename);
      fetchUploadFile(filename, uploadFileSuccess, uploadFileFail);
    }
    function uploadFileFail(error: any) {
      console.log("Failed to create new file error message:", error);
    }
    function uploadFileSuccess(response: any) {
      const filename = response["filename"];
      console.log(
        "File " + filename + " uploaded successfully. Response was " + JSON.stringify(response)
      );

      const request_json = {
        file: filename,
      };
      if (!newModelCreationDone) {
        fetchTransaction(
          "/create_oscal_project",
          request_json,
          createOscalProjectSuccess,
          createOscalProjectFail
        );
        newModelCreationDone = true;
      }
      function createOscalProjectSuccess(response: any) {
        console.log("successful creation of a new catalog/baseline", response["new_oscal_file"]);
        setNewOSCALFilePath(response["new_oscal_file"]);
      }
      function createOscalProjectFail(e: any) {
        console.log("Fail to create a new Catalog/Baseline", e.statusText);
      }
    }

    function updateMetadata() {
      const date = new Date();
      const nowDate = date.toLocaleDateString();
      const nowTime = date.toLocaleTimeString();
      console.log("Start updating the metadata of this project ", newOSCALFilePath);
      data.model.lastModified = nowDate + ", " + nowTime;
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
                  <StepConnector sx={{ left: -165, width: 170, border: "1px solid #023E88" }} />
                }
              >
                <Step key="catalog" sx={{ width: 40, height: 40 }}>
                  <StepItemLabel>{Model} Details</StepItemLabel>
                </Step>
                <Step key="org" sx={{ width: 40, height: 40, left: 40 }}>
                  <StepItemLabel>Org Details</StepItemLabel>
                </Step>
                <Step key="author" sx={{ width: 40, height: 40, left: 80 }}>
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
              <NativeSelect
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
                <option value="AL">Alabama</option>
                <option value="AK">Alaska</option>
                <option value="AZ">Arizona</option>
                <option value="AR">Arkansas</option>
                <option value="CA">California</option>
                <option value="CO">Colorado</option>
                <option value="CT">Connecticut</option>
                <option value="DE">Delaware</option>
                <option value="DC">District of Columbia</option>
                <option value="FL">Florida</option>
                <option value="GA">Georgia</option>
                <option value="HI">Hawaii</option>
                <option value="ID">Idaho</option>
                <option value="IL">Illinois</option>
                <option value="IN">Indiana</option>
                <option value="IA">Iowa</option>
                <option value="KS">Kansas</option>
                <option value="KY">Kentucky</option>
                <option value="LA">Louisiana</option>
                <option value="ME">Maine</option>
                <option value="MD">Maryland</option>
                <option value="MA">Massachusetts</option>
                <option value="MI">Michigan</option>
                <option value="MN">Minnesota</option>
                <option value="MS">Mississippi</option>
                <option value="MO">Missouri</option>
                <option value="MT">Montana</option>
                <option value="NE">Nebraska</option>
                <option value="NV">Nevada</option>
                <option value="NH">New Hampshire</option>
                <option value="NJ">New Jersey</option>
                <option value="NM">New Mexico</option>
                <option value="NY">New York</option>
                <option value="NC">North Carolina</option>
                <option value="ND">North Dakota</option>
                <option value="OH">Ohio</option>
                <option value="OK">Oklahoma</option>
                <option value="OR">Oregon</option>
                <option value="PA">Pennsylvania</option>
                <option value="RI">Rhode Island</option>
                <option value="SC">South Carolina</option>
                <option value="SD">South Dakota</option>
                <option value="TN">Tennessee</option>
                <option value="TX">Texas</option>
                <option value="UT">Utah</option>
                <option value="VT">Vermont</option>
                <option value="VA">Virginia</option>
                <option value="WA">Washington</option>
                <option value="WV">West Virginia</option>
                <option value="WI">Wisconsin</option>
                <option value="WY">Wyoming</option>
              </NativeSelect>
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
          <DialogContent sx={{ height: 600, overflow: "hidden" }}>
            <Grid container rowSpacing={2} justifyContent="center" sx={{ width: "100%" }}>
              <Grid item xs={12} sx={{ height: 100 }}>
                <StepperBar
                  alternativeLabel
                  sx={{ width: "100%" }}
                  connector={
                    <StepConnector sx={{ left: -165, width: 170, border: "1px solid #023E88" }} />
                  }
                >
                  <Step key="catalog" sx={{ width: 40, height: 40 }}>
                    <StepItemLabel>{Model} Details</StepItemLabel>
                  </Step>
                  <Step key="org" sx={{ width: 40, height: 40, left: 50 }}>
                    <StepItemLabel>Org Details</StepItemLabel>
                  </Step>
                  <Step key="author" sx={{ width: 40, height: 40, left: 100 }}>
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
    const zeroCatalogBaseline = catalogIds.length === 0 && baselineIds.length === 0;
    if (openCatalogBaseline || uploadNewCatalogBaseline || zeroCatalogBaseline) {
      if (uploadNewCatalogBaseline || zeroCatalogBaseline) return <RenderUpload></RenderUpload>;
      return null;
    }
    return (
      <RenderCatalogItems CatalogUUIDS={catalogIds} ProfileUUIDS={baselineIds}></RenderCatalogItems>
    );
  }
  const FilledBoxItem: React.FC<Project> = (project) => {
    const [metadataObject, setMetadataObject] = useState<any>({});
    useEffect(() => {
      getData();
    }, []);

    const isCatalog = project.model === "catalog" ? true : false;
    function getData() {
      const filePath = "projects/" + project.model + "_" + project.ProjectUUID + "/oscal_data.json";

      const request_json = {
        oscal_file: filePath,
      };

      fetchTransaction(
        "get_metadata",
        request_json,
        getCatalogMetadataSuccess,
        getCatalogMetadataFail
      );
      function getCatalogMetadataSuccess(response: any) {
        console.log("In FilledBoxItem: Successfull REST CAll with path", request_json);
        setMetadataObject(response);
      }
      function getCatalogMetadataFail(e: any) {
        console.log("In FilledBoxItem: Operation fail ", e.statusText, request_json);
      }
    }

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
  const usedText = LabelText ?? "";
  const trunckatedTitle = usedText.length > 45 ? usedText.substring(0, 44) + "..." : usedText;
  return (
    // <Container
    //   component={"main"}
    //   sx={{
    //     position: "absolute",
    //     width: "80%",
    //     height: "100%",
    //     top: 0,
    //     left: 320,
    //     border: "1px",
    //     background: "#f6f6f6",
    //   }}
    // >
    //   {renderTabs({ model: createdModel })}
    //   <HeaderRow model={createdModel}></HeaderRow>
    //   <CatalogBreadCrumbsMenu model={createdModel}></CatalogBreadCrumbsMenu>
    //   <CatalogTooltip title={LabelText}>
    //     <Typography
    //       variant={"h1"}
    //       sx={{ position: "absolute", width: 700, height: 40, top: 116, left: 40 }}
    //     >
    //       {trunckatedTitle}
    //     </Typography>
    //   </CatalogTooltip>
    //   {renderHugHug()}
    //   {renderFilledItemBox()}
    //   {renderAddNewCatalogBaselineDialog()}
    //   {renderOrgDetailsDialog()}
    //   {renderAuthorDetailDialog()}
    //  </Container>

    <Grid
      container
      component={"main"}
      sx={{
        position: "absolute",
        width: "82%",
        height: "90%",
        left: 323,
        top: 80,
        border: "5px solid",
        background: "#f6f6f6",
      }}
    >
      {/* <Grid   
      sx={{
        position: "absolute", 
        width: "100%",
        height: "100%",
        left: 0,
        top: 0,
        overflow: "hidden",
      }} > */}
         {renderTabs({ model: createdModel })}
       <HeaderRow model={createdModel}></HeaderRow>
       <CatalogBreadCrumbsMenu model={createdModel}></CatalogBreadCrumbsMenu>
       <CatalogTooltip title={LabelText}>
        <Typography
           variant={"h1"}
           sx={{ position: "absolute", width: 700, height: 40, top: 116, left: 40 }}
         >
           {trunckatedTitle}
         </Typography>
       </CatalogTooltip>
       {renderHugHug()}
       {renderFilledItemBox()}
       {renderAddNewCatalogBaselineDialog()}
       {renderOrgDetailsDialog()}
       {renderAuthorDetailDialog()}
      {/* </Grid> */}
    </Grid>
  );
}
