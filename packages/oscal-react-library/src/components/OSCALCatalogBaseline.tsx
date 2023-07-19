import React, { useState, useEffect } from "react";
import { Catalog, Profile } from "@easydynamics/oscal-types";
import { EditableFieldProps } from "./OSCALEditableTextField";

import { Link } from "@mui/material";
import FormLabel from "@mui/material/FormLabel";
import BreadCrumbs from "@mui/material/Breadcrumbs";
import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import Button from "@mui/material/Button";
import { Divider } from "@mui/material";
import { Stack, styled } from "@mui/system";
//import BreadCrumbs from "@mui/material/node_modules/@mui/base";
import { useFetchers } from "./Fetchers";
import {
  OSCALDialogActions,
  OSCALDialogTitle,
  OSCALDialogTitleWarning,
  OSCALEditingDialog,
  OSCALWarningDialog,
} from "./styles/OSCALDialog";

import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepConnector from "@mui/material/StepConnector";
import StepLabel from "@mui/material/StepLabel";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";

import Toolbar from "@mui/material/Toolbar";

import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import IconButton from "@mui/material/IconButton";
import { TextField, Typography, Container, Grid } from "@mui/material";
import AppBar from "@mui/material/AppBar";

import {
  OSCALDestructiveButton,
  OSCALPrimaryButton,
  OSCALSecondaryButton,
  OSCALTertiaryButton,
} from "./styles/OSCALButtons";
import {
  OSCALTextField,
  OSCALDropdown,
  OSCALRadio,
  OSCALCheckbox,
  OSCALCancelButton,
  OSCALConfirmButton,
  OSCALFormLabel,
} from "./styles/OSCALInputs";

import {
  EditAttributesSharp,
  FormatBold,
  FormatItalic,
  FormatQuote,
  Subscript,
  Superscript,
} from "@mui/icons-material";

import { CodeOffSharp } from "@mui/icons-material";
import { getDateRangePickerDayUtilityClass } from "@mui/lab";
import { string } from "prop-types";
import { timeStamp } from "console";

const CreateNew = styled(Button)`
  position: absolute;
  width: 142px;
  height: 35px;
  top: 120px;
  left: 1050px;
`;
const Hug = styled(Container)`
  position: absolute;
  width: 348px;
  height: 36px;
  top: 120px;
  left: 950px;
`;
const Upload = styled(Button)`
  position: absolute;
  width: 57px;
  height: 20px;
  top: 128px;
  left: 970px;
  font-family: Source Sans Pro;
  font-size: 16px;
  font-weight: 600;
  line-height: 20px;
  letter-spacing: 0em;
  text-align: left;
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

const Label = styled(Typography)`
  height: 17px;
  width: 207px;
  left: 440px;
  top: 550px;
  border-radius: nullpx;
  position: absolute;
  left: 20.56%;
  right: 62.01%;
  top: 30.11%;
  bottom: 37%;
  font-family: "Source Sans Pro";
  font-style: normal;
  font-weight: 700;
  font-size: 16px;
  line-height: 20px;
  color: #ffffff;
`;
const ItemButton = styled(Button)`
  height: 39px;
  width: 352px;
  left: 0px;
  top: 539px;
  border-radius: 0px;
  position: absolute;
  right: 53.33%;
  top: 78.89%;
  bottom: 35.78%;
  background: #002867;
  hover: #023e88;
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
  font-style: normal;
  font-weight: 700;
  font-size: 20px;
  line-height: 25px;
  color: #002867;
`;
const LastModified = styled(Typography)`
  position: absolute;
  height: 18px;
  width: 350px;
  left: 332.375px;
  top: 249.21400451660156px;
  border-radius: nullpx;
  left: 3.08%;
  right: 62.27%;
  top: 32.69%;
  bottom: 70.31%;
  font-family: "Source Sans Pro";
  font-style: normal;
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
  top: 249.21400451660156px;
  border-radius: nullpx;
  left: 28.08%;
  right: 62.27%;
  top: 32.69%;
  bottom: 70.31%;
  font-family: "Source Sans Pro";
  font-style: normal;
  font-weight: 700;
  font-size: 14px;
  line-height: 18px;
  color: #2b2b2b;
`;
const Version = styled(Typography)`
  height: 18px;
  width: 350px;
  left: 332px;
  top: 275.2139892578125px;
  border-radius: nullpx;
  position: absolute;
  left: 3.06%;
  right: 67.5%;
  top: 47.58%;
  bottom: 67.42%;
  font-family: "Source Sans Pro";
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 18px;
  color: #2b2b2b;
`;
const PublicationDate = styled(Typography)`
  height: 18px;
  width: 350px;
  left: 332.375px;
  top: 299.2139892578125px;
  border-radius: nullpx;
  position: absolute;
  left: 3.08%;
  right: 63.59%;
  top: 62.25%;
  bottom: 64.75%;
  font-family: "Source Sans Pro";
  font-style: normal;
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
  font-style: normal;
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
  font-size: 16px;
  font-weight: 700;
  line-height: 20px;
  letter-spacing: 0em;
  text-align: "left";
  color: #002867;
`;

const ShadedContainer = styled(Container)`
  width: 1440px;
  height: 900px;
  top: 0px;
  left: 0px;
  border: 1px;
  background: #2B2B2B66;
}
`;
const SecondLabel = styled(Typography)`
  font-family: "Source Sans Pro";
  font-size: 16px;
  font-weight: 400;
  line-height: 20px;
  letter-spacing: 0em;
  text-align: "left";
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
  documentVersion?: string;
  description?: string;
  orgContactInfo?: ContactInfo;
  authorContactInfo?: ContactInfo;
}
export interface OSCALModel extends EditableFieldProps {
  model: CatalogBaseline;
}
interface OSCALCatalogBaselineProps extends EditableFieldProps {
  readonly baseline?: Profile;
  readonly catalog?: Catalog;
  readonly onRestError?: (error: any) => void;
  readonly onRestSuccess?: (data: any) => void;
}

interface OSCALModelMetadataInfo extends EditableFieldProps {
  readonly title?: string;
  readonly lastModified?: string;
  readonly version?: string;
  readonly publicationDate?: string;
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
const item: OSCALModelMetadataInfo = {
  title: "FedRamp Baseline",
  lastModified: "02/13/2021",
  version: "1.2",
  publicationDate: "05/12/2023",
};
const item1: OSCALModelMetadataInfo = {
  title: "NIST Baseline",
  lastModified: "02/13/2021",
  version: "0.2",
  publicationDate: "05/12/2023",
};
const item2: OSCALModelMetadataInfo = {
  title: "CIS Baseline",
  lastModified: "02/13/2021",
  version: "0.2",
  publicationDate: "05/12/2023",
};
const item3: OSCALModelMetadataInfo = {
  title: "EDC Baseline",
  lastModified: "02/13/2021",
  version: "5.2",
  publicationDate: "05/12/2023",
};
const data: Array<OSCALModelMetadataInfo> = [item, item1, item2, item3];

class UploadButton extends React.Component {
  render() {
    return (
      <Upload>
        {" "}
        <Typography style={{ color: "#023E88" }}> UPLOAD</Typography>{" "}
      </Upload>
    );
  }
}

export const CatalogBreadCrumbsMenu: React.FC<OSCALModelMetadataInfo | null> = (item) => {
  if (item != null && item.title != null && item.title.length > 0)
    return (
      <BreadCrumbs
        aria-label="breadcrumb"
        sx={{
          position: "absolute",
          width: "321px",
          height: "100px",
          top: "96px",
          left: "100px",
          fontFamily: "Source Sans Pro",
          fontStyle: "normal",
          fontSize: "16px",
          lineHeight: "20px",
          ":hover": {
            color: "#FF6600",
          },
        }}
      >
        <Link
          href="/"
          style={{
            color: "#1D1D1D",
            fontWeight: "400",
            fontFamily: "Source Sans Pro",
            fontStyle: "normal",
            fontSize: "16px",
            lineHeight: "20px",
          }}
        >
          HOME
        </Link>
        <Link
          href="/"
          style={{
            color: "#002867",
            fontWeight: "700",
            fontFamily: "Source Sans Pro",
            fontStyle: "normal",
            fontSize: "16px",
            lineHeight: "20px",
          }}
        >
          CATALOGS & BASELINES
        </Link>
        <Link
          href="/"
          style={{
            color: "#002867",
            fontWeight: "700",
            fontFamily: "Source Sans Pro",
            fontStyle: "normal",
            fontSize: "16px",
            lineHeight: "20px",
          }}
        >
          {" "}
          {item?.title}
        </Link>
      </BreadCrumbs>
    );
  else
    return (
      <BreadCrumbs
        aria-label="breadcrumb"
        sx={{
          position: "absolute",
          width: "321px",
          height: "100px",
          top: "96px",
          left: "100px",
          fontFamily: "Source Sans Pro",
          fontStyle: "normal",
          fontSize: "16px",
          lineHeight: "20px",
          ":hover": {
            color: "#FF6600",
          },
        }}
      >
        <Link
          href="/"
          sx={{
            color: "#1D1D1D",
            fontWeight: "400",
            fontFamily: "Source Sans Pro",
            fontStyle: "normal",
            fontSize: "16px",
            lineHeight: "20px",
            ":hover": {
              color: "#FF6600",
            },
          }}
        >
          HOME
        </Link>
        <Link
          href="/"
          sx={{
            color: "#002867",
            fontWeight: "700",
            fontFamily: "Source Sans Pro",
            fontStyle: "normal",
            fontSize: "16px",
            lineHeight: "20px",
            ":hover": {
              color: "#FF6600",
            },
          }}
        >
          CATALOGS & BASELINES
        </Link>
      </BreadCrumbs>
    );
};

export default function OSCALCatalogBaseline() {
  const fetchers = useFetchers();
  const fetchUploadFile = fetchers["fetchUploadFile"];
  const fetchTransaction = fetchers["fetchTransaction"];
  const fetchRest = fetchers["fetchRest"];
  const fetchRestGetData = fetchers["fetchRestGetData"];

  let Model = "Catalog";
  const [AddNewCatalogBaseline, setAddNewCatalogBaseline] = useState(false);
  const [AddOrgDetails, setAddOrgDetails] = useState(false);
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
  const [initSelectedCatalogBaseline, setInitSelectedCatalogBaseline] = useState<string>(Model);
  const [openCatalogBaseline, setOpenCatalogBaseline] = useState(false);
  let newModelCreationDone = false;
  let address: Address = orgAddress;
  let contact: ContactInfo = {};
  address = authorAddress;
  //const Metadatas: any[] = [];
  useEffect(() => {
    getCatalogIds();
    getBaselineIds();
    getInitSelectedModel();
  }, []);

  function getInitSelectedModel() {
    setInitSelectedCatalogBaseline(Model);
  }
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
            <OSCALDestructiveButton>DELETE CATALOG</OSCALDestructiveButton>
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
              {item.lastModified}
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
                fontSize: fontSizeCorrection(item.publicationDate ?? ""),
              }}
            >
              {item.publicationDate}{" "}
            </ItemResult>{" "}
          </Grid>
        </Grid>
        {/* <ItemButton> */}
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
          >
            {/* <Label> OPEN CATALOG </Label> */}
            OPEN CATALOG
          </OSCALPrimaryButton>
        </Container>
        {/* </ItemButton> */}
      </ItemBox>
    );
  };
  function DenseAppBar() {
    return (
      <Box sx={{ flexGrow: 1, top: 10 }}>
        <AppBar position="static" sx={{ background: "#ffffff", height: 10 }}>
          <Toolbar
            variant="dense"
            sx={{ background: "#ffffff", height: 7, border: "1px solid #CCCCCC" }}
          >
            <IconButton edge="start" aria-label="menu" sx={{ mr: 1 }}>
              <FormatBold />
            </IconButton>
            <IconButton edge="start" aria-label="menu" sx={{ mr: 1 }}>
              <FormatItalic />
            </IconButton>
            <IconButton edge="start" aria-label="menu" sx={{ mr: 1 }}>
              <CodeOffSharp />
            </IconButton>
            <IconButton edge="start" aria-label="menu" sx={{ mr: 1 }}>
              <FormatQuote />
            </IconButton>
            <IconButton edge="start" aria-label="menu" sx={{ mr: 1 }}>
              <Subscript />
            </IconButton>
            <IconButton edge="start" aria-label="menu" sx={{ mr: 1 }}>
              <Superscript />
            </IconButton>
          </Toolbar>
        </AppBar>
      </Box>
    );
  }

  function ToolBarMenu() {
    return (
      <Box
        justifyContent="center"
        sx={{
          height: 12,
        }}
      >
        <Grid container spacing={1}>
          <Grid xs={6}>
            <Container></Container>
          </Grid>
          <Grid xs={6}>
            <Box>
              <DenseAppBar></DenseAppBar>
            </Box>
          </Grid>
        </Grid>
      </Box>
    );
  }

  const AddOrgDetailsDialog: React.FC<OSCALModel> = (data) => {
    Model = data.model.isCatalog ? "Catalog" : "Baseline";

    contact = data.model.orgContactInfo ?? {};
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
      console.log("closing now ", data.model);
    };
    const handleAddAuthorDetails = () => {
      setAddOrgDetails(false);
      setAddNewCatalogBaseline(false);
      setAddAuthorDetails(true);
      data.model.orgContactInfo = orgContact;
      setMainData(data.model);
      newModelCreationDone = false;
    };
    if (AddOrgDetails)
      return (
        <Dialog
          open={data.model.isVisible}
          onClose={handleCloseOrgDetails}
          fullWidth={true}
          sx={{ top: -30, left: 530, width: 560, height: 950 }}
        >
          <OSCALDialogTitle title={title} onClose={handleCloseOrgDetails} />
          <DialogContent>
            <Grid container rowSpacing={2} justifyContent="center">
              <Grid item xs={12} sx={{ height: 100 }}>
                <StepperBar
                  alternativeLabel
                  activeStep={1}
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
                <OSCALFormLabel label={"Organization Name"} required={true} />
                <TextField
                  fullWidth
                  id={"orgName"}
                  onChange={handleEditOrgNameChange}
                  defaultValue={data.model.orgContactInfo?.name}
                  margin="none"
                />
                <OSCALFormLabel label={"Organization Phone"} required={false} />
                <TextField
                  fullWidth
                  id={"orgPhone"}
                  onChange={handleEditOrgPhoneChange}
                  defaultValue={data.model.orgContactInfo?.phone}
                  margin="none"
                />
              </Grid>
              <Grid item xs={12}>
                <OSCALFormLabel label={"Organization Email"} required={false} />
                <TextField
                  fullWidth
                  id={"orgEmail"}
                  onChange={handleEditOrgEmailChange}
                  defaultValue={data.model.orgContactInfo?.email}
                />
              </Grid>
              <Grid item xs={12}>
                <OSCALFormLabel label={"Organization Address"} required={false} />
                <SecondLabel>Address Line 1</SecondLabel>
                <TextField
                  fullWidth
                  id={"address line 1"}
                  onChange={handleEditAddressLine1Change}
                  defaultValue={data.model.orgContactInfo?.address?.line1}
                />
                <SecondLabel>Address Line 2</SecondLabel>
                <TextField
                  fullWidth
                  id={"address line 2"}
                  onChange={handleEditAddressLine2Change}
                  defaultValue={data.model.orgContactInfo?.address?.line2}
                />
                <SecondLabel>City</SecondLabel>
                <TextField
                  defaultValue={data.model.orgContactInfo?.address?.city}
                  fullWidth
                  id={"city"}
                  onChange={handleEditCityChange}
                />
                <SecondLabel>State</SecondLabel>
                <TextField
                  defaultValue={data.model.orgContactInfo?.address?.state}
                  fullWidth
                  id={"state"}
                  onChange={handleEditStateChange}
                />
                <SecondLabel>ZIP</SecondLabel>
                <TextField
                  defaultValue={data.model.orgContactInfo?.address?.zip}
                  sx={{ width: 100 }}
                  id={"zip"}
                  onChange={handleEditZipChange}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <OSCALSecondaryButton onClick={handleCloseOrgDetails}>Previous</OSCALSecondaryButton>
            <OSCALPrimaryButton onClick={handleAddAuthorDetails}>Next</OSCALPrimaryButton>
          </DialogActions>
        </Dialog>
      );
    else return null;
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
  const AddAuthorDetailsDialog: React.FC<OSCALModel> = (data) => {
    Model = data.model.isCatalog ? "Catalog" : "Baseline";
    const [newOSCALFilePath, setNewOSCALFilePath] = useState("");
    contact = data.model.authorContactInfo ?? {};
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
      setAddOrgDetails(true);
      setAddNewCatalogBaseline(false);
      setAddAuthorDetails(false);
      setAuthorAddress(address);
      setAuthorContact(contact);
      data.model.authorContactInfo = authorContact;
      setMainData(data.model);
      console.log("closing now ", data.model);
    };
    const handleCreateNewCatalogBaseline = () => {
      createNewProject();
      wrapper();
      setAddOrgDetails(false);
      setAddNewCatalogBaseline(false);
      setAddAuthorDetails(false);
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
      const nowTime = Date.now().toLocaleString();
      console.log("Start updating the metadata of this project ", newOSCALFilePath);
      data.model.lastModified = "2023-07-19T13:57:28.91745-04:00"; //nowTime;
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
    }

    if (AddAuthorDetails)
      return (
        <Dialog
          open={data.model.isVisible}
          onClose={handleCloseOrgDetails}
          fullWidth={true}
          sx={{ top: -30, left: 530, width: 560, height: 950 }}
        >
          <OSCALDialogTitle title={title} onClose={handleCloseOrgDetails} />
          <DialogContent>
            <Grid container rowSpacing={2} justifyContent="center">
              <Grid item xs={12} sx={{ height: 100 }}>
                <StepperBar
                  alternativeLabel
                  activeStep={2}
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
                <OSCALFormLabel label={"Author Name"} required={true} />
                <TextField
                  fullWidth
                  id={"authorName"}
                  onChange={handleEditOrgNameChange}
                  defaultValue={data.model.authorContactInfo?.name}
                />
                <OSCALFormLabel label={"Author Phone"} required={false} />
                <TextField
                  fullWidth
                  id={"authorPhone"}
                  onChange={handleEditOrgPhoneChange}
                  defaultValue={data.model.authorContactInfo?.phone}
                />
              </Grid>
              <Grid item xs={12}>
                <OSCALFormLabel label={"Author Email"} required={false} />
                <TextField
                  fullWidth
                  id={"authorEmail"}
                  onChange={handleEditOrgEmailChange}
                  defaultValue={data.model.authorContactInfo?.email}
                />
              </Grid>
              <Grid item xs={12}>
                <OSCALFormLabel label={"Author Address"} required={false} />
                <SecondLabel>Address Line 1</SecondLabel>
                <TextField
                  fullWidth
                  id={"address line 1"}
                  onChange={handleEditAddressLine1Change}
                  defaultValue={data.model.authorContactInfo?.address?.line1}
                />
                <SecondLabel>Address Line 2</SecondLabel>
                <TextField
                  fullWidth
                  id={"address line 2"}
                  onChange={handleEditAddressLine2Change}
                  defaultValue={data.model.authorContactInfo?.address?.line2}
                />
                <SecondLabel>City</SecondLabel>
                <TextField
                  defaultValue={data.model.authorContactInfo?.address?.city}
                  fullWidth
                  id={"city"}
                  onChange={handleEditCityChange}
                />
                <SecondLabel>State</SecondLabel>
                <TextField
                  defaultValue={data.model.authorContactInfo?.address?.state}
                  fullWidth
                  id={"state"}
                  onChange={handleEditStateChange}
                />
                <SecondLabel>ZIP</SecondLabel>
                <TextField
                  defaultValue={data.model.authorContactInfo?.address?.zip}
                  sx={{ width: 100 }}
                  id={"zip"}
                  onChange={handleEditZipChange}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <OSCALSecondaryButton onClick={handleCloseOrgDetails}>Previous</OSCALSecondaryButton>
            <OSCALPrimaryButton onClick={handleCreateNewCatalogBaseline}>
              CREATE {Model}
            </OSCALPrimaryButton>
          </DialogActions>
        </Dialog>
      );
    else return null;
  };

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
        <Dialog
          open={data.model.isVisible}
          onClose={handleCloseAddNewCatalogBaseline}
          fullWidth={true}
          sx={{ top: -30, left: 530, width: 560, height: 950 }}
        >
          <OSCALDialogTitle title={title} onClose={handleCloseAddNewCatalogBaseline} />
          <DialogContent>
            <Grid container rowSpacing={2} justifyContent="center">
              <Grid item xs={12} sx={{ height: 100 }}>
                <StepperBar
                  alternativeLabel
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
                <OSCALFormLabel label={Model + " Title"} required={true} />
                <TextField
                  fullWidth
                  id={"title"}
                  onChange={handleEditTitleChange}
                  defaultValue={data.model.title}
                />
                <ToolBarMenu></ToolBarMenu>
              </Grid>
              <Grid item xs={12}>
                <OSCALFormLabel label={"Document Version"} required={true} />
                <TextField
                  fullWidth
                  id={"document-version"}
                  onChange={handleEditDocumentVersionChange}
                  defaultValue={data.model.documentVersion}
                />
              </Grid>
              <Grid item xs={12} sx={{ height: 90 }}>
                <OSCALFormLabel label={Model + " Description "} required={false}></OSCALFormLabel>
                <TextField
                  multiline={true}
                  fullWidth
                  id={"Catalog-new-description"}
                  onChange={handleEditDescriptionChange}
                  defaultValue={data.model.description}
                  rows={2}
                  SelectProps={{
                    MenuProps: {
                      anchorOrigin: {
                        vertical: "bottom",
                        horizontal: "left",
                      },
                    },
                  }}
                />
                <ToolBarMenu></ToolBarMenu>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <OSCALSecondaryButton onClick={handleCloseAddNewCatalogBaseline}>
              Cancel
            </OSCALSecondaryButton>
            <OSCALPrimaryButton onClick={handleAddOrgDetails}>Next</OSCALPrimaryButton>
          </DialogActions>
        </Dialog>
      );
    else return null;
  };

  function renderHugHug() {
    if (!openCatalogBaseline) return <HugHug></HugHug>;
    else return <DeleteCatalogBaseline></DeleteCatalogBaseline>;
  }
  function renderAuthorDetailDialog() {
    if (!AddAuthorDetails) return null;

    return <AddAuthorDetailsDialog model={mainData} />;
  }
  function renderOrgDetailsDialog() {
    if (!AddOrgDetails) return null;

    return <AddOrgDetailsDialog model={mainData} />;
  }
  function renderAddNewCatalogBaselineDialog() {
    if (!AddNewCatalogBaseline) return null;

    return <AddCatalogDetailsDialog model={mainData} />;
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
      //fetchRestGetData(operation, getCatalogMetadataSuccess, getCatalogMetadataFail);

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
      <CatalogBreadCrumbsMenu></CatalogBreadCrumbsMenu>
      <FormHeaderLabel> Catalogs & Baselines </FormHeaderLabel>
      {/* <UploadButton></UploadButton> */}
      {renderHugHug()}
      {/* <StackFunct Items={data}></StackFunct> */}
      {/* <RenderCatalogItems CatalogUUIDS={catalogIds} ProfileUUIDS={baselineIds}></RenderCatalogItems> */}
      {renderFilledItemBox()}
      {renderAddNewCatalogBaselineDialog()}
      {renderOrgDetailsDialog()}
      {renderAuthorDetailDialog()}
    </MainContainer>
  );
}
