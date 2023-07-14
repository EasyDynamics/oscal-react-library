import React, { useState, useEffect, ReactElement } from "react";
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
import { isAbsolute } from "path";
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

import { FormatBold, FormatItalic, FormatQuote, Subscript, Superscript } from "@mui/icons-material";

import { CodeOffSharp } from "@mui/icons-material";

const CreateNew = styled(Button)`
  position: absolute;
  width: 142px;
  height: 35px;
  top: 120px;
  left: 1050px;
  border: 1px;
  border: 1px solid #073c92;
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
  background: #023e88;
`;
const ItemTitle = styled(Typography)`
  height: 25px;
  width: 300px;
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
  width: 211px;
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
const Version = styled(Typography)`
  height: 18px;
  width: 136px;
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
  width: 192px;
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
  width: 290px;
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
  width: 295px;
  height: 26px;
  top: 30px;
  left: 20px;
  font-family: "Source Sans Pro";
  font-size: 16px;
  font-weight: 700;
  line-height: 20px;
  letter-spacing: 0em;
  text-align: left;
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

export interface OSCALCatalogBaselineProps extends EditableFieldProps {
  readonly baseline?: Profile;
  readonly catalog?: Catalog;
  readonly onRestError?: (error: any) => void;
  readonly onRestSuccess?: (data: any) => void;
}

export interface OSCALModelMetadataInfo extends EditableFieldProps {
  readonly title?: string;
  readonly lastModified?: string;
  readonly version?: string;
  readonly publicationDate?: string;
}

export interface ItemList {
  readonly Items: Array<OSCALModelMetadataInfo>;
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
        style={{
          position: "absolute",
          width: "321px",
          height: "100px",
          top: "96px",
          left: "100px",
          fontFamily: "Source Sans Pro",
          fontStyle: "normal",
          fontSize: "16px",
          lineHeight: "20px",
        }}
      >
        <Link underline="hover" href="/" style={{ color: "#1D1D1D", fontWeight: "400" }}>
          Home
        </Link>
        <Link underline="hover" href="/" style={{ color: "#002867", fontWeight: "700" }}>
          CATALOGS & BASELINES
        </Link>
        <Link underline="hover" href="/" style={{ color: "#002867", fontWeight: "700" }}>
          {" "}
          {item?.title}
        </Link>
      </BreadCrumbs>
    );
  else
    return (
      <BreadCrumbs
        aria-label="breadcrumb"
        style={{
          position: "absolute",
          width: "321px",
          height: "100px",
          top: "96px",
          left: "100px",
          fontFamily: "Source Sans Pro",
          fontStyle: "normal",
          fontSize: "16px",
          lineHeight: "20px",
        }}
      >
        <Link underline="hover" href="/" style={{ color: "#1D1D1D", fontWeight: "400" }}>
          Home
        </Link>
        <Link underline="hover" href="/" style={{ color: "#002867", fontWeight: "700" }}>
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
  function handleEditDescriptionChange() {
    return 0;
  }
  // const metadata = "";
  const eiScopeFile =
    "data/projects/enterprise-initiative_4d37c688-c897-4331-a1be-354515a92eac/oscal_data.json";
  // const [modelMetadata, setMetadata] = useState<any | null>(metadata);
  const [projects, setProjects] = useState([]);

  let Catalogs: any[];
  let Baselines: any[];
  const Metadatas: any[] = [];
  const ItemMetadataInfos: Array<OSCALModelMetadataInfo> = [];
  const [catalogs, setCatalogs] = useState<any[]>([]);
  const [baselines, setBaselines] = useState<any[]>([]);
  const [metadataCatalogs, setMetadataCatalogs] = useState<any[]>([]);
  const [metadataBaselines, setMetadataBaselines] = useState<any[]>([]);
  const [items, setItems] = useState<Array<OSCALModelMetadataInfo>>([]);
  let metadata: any;
  let modelUUID: string;

  // useEffect(() => {
  //   //getOscalProjects();
  //   // getCatalogProjects();
  //   //getBaselineProjects();
  //   getMetadata(modelUUID);
  //   // setMetadataInfo();
  // }, [getMetadata, modelUUID]);

  function setMetadataInfo() {
    // const titles = Metadatas.map((object) => object.title);
    // console.log(titles.length);
    for (let i = 0; i < Metadatas.length; i++) {
      const value = Metadatas[i];
      const temp: OSCALModelMetadataInfo = {
        title: value.title,
        lastModified: value["last-modified"],
        version: value.version,
      };
      ItemMetadataInfos.push(temp);
    }
    // Metadatas.forEach(function (value) {
    //   const temp: OSCALModelMetadataInfo = {
    //     title: value.title,
    //     lastModified: value["last-modified"],
    //     version: value.version,
    //   };
    //   ItemMetadataInfos.push(temp);
    // });
  }
  function getMetadata(modelUUID: string) {
    const request_json = {
      method: "GET",
    };
    const operation = "/catalog/" + modelUUID + "/catalog/metadata";
    fetchRest(operation, request_json, getCatalogMetadataSuccess, getCatalogMetadataFail);

    function getCatalogMetadataSuccess(response: any) {
      metadata = response;
    }
    function getCatalogMetadataFail(e: any) {
      console.log("Operation fail " + e.statusText);
    }
  }
  function restAddCatalogMetadataEntry(projectId: string) {
    const operation = "/catalog/" + projectId + "/catalog/metadata";
    const requestOptions = {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    };
    let slash = "/";
    if (operation.startsWith("/")) {
      slash = "";
    }
    fetch("/rest" + slash + operation, requestOptions)
      .then((response) => {
        if (!response.ok) {
          throw new Error(response.statusText);
        }
        return response.json();
      })
      .then((data) => {
        const titles = Metadatas.map((object) => object.title);
        if (titles.length === 0) {
          Metadatas.push(data);
          const value = data;
          const temp: OSCALModelMetadataInfo = {
            title: value.title,
            lastModified: value["last-modified"],
            version: value.version,
          };
          ItemMetadataInfos.push(temp);
        }
        if (!titles.includes(data.title)) {
          Metadatas.push(data);
          const value = data;
          const temp: OSCALModelMetadataInfo = {
            title: value.title,
            lastModified: value["last-modified"],
            version: value.version,
          };
          ItemMetadataInfos.push(temp);
        }
        setItems(ItemMetadataInfos);
      });
  }

  function restGetData(operation: string) {
    const requestOptions = {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    };
    let slash = "/";
    if (operation.startsWith("/")) {
      slash = "";
    }
    fetch("/rest" + slash + operation, requestOptions)
      .then((response) => {
        if (!response.ok) {
          throw new Error(response.statusText);
        }
        return response.json();
      })
      .then((data) => {
        const titles = Metadatas.map((object) => object.title);
        if (titles.length === 0) {
          Metadatas.push(data);
          const value = data;
          const temp: OSCALModelMetadataInfo = {
            title: value.title,
            lastModified: value["last-modified"],
            version: value.version,
          };
          ItemMetadataInfos.push(temp);
        }
        if (!titles.includes(data.title)) {
          Metadatas.push(data);
          const value = data;
          const temp: OSCALModelMetadataInfo = {
            title: value.title,
            lastModified: value["last-modified"],
            version: value.version,
          };
          ItemMetadataInfos.push(temp);
        }
        setItems(ItemMetadataInfos);
      });
  }

  function getBaselineProjects() {
    const request_json = {
      method: "GET",
    };
    fetchRest(
      "/profile",
      request_json,
      getProfileProjectsStatusSuccess,
      getProfileProjectsStatusFail
    );
  }
  function getProfileProjectsStatusSuccess(response: []) {
    Baselines = response;
    getAllMetadataInfos(Baselines, "profile");
  }
  function getProfileProjectsStatusFail(e: any) {
    console.log("Operation failed " + e.statusText);
  }
  function getAllMetadataInfos(temp: any, model: string) {
    const items = temp.projects.flatMap((x: any) => x);
    for (let i = 0; i < items.length; i++) {
      const operation = "/" + model + "/" + items[i] + "/" + model + "/metadata";
      restGetData(operation);
    }
  }
  //   function getOscalProjects() {
  //     const request_json = {
  //       model_type: "all",
  //     };
  //     fetchTransaction(
  //       "/list_oscal_projects",
  //       request_json,
  //       getOSCALProjectStatusSuccess,
  //       getOSCALProjectStatusFail
  //     );
  //   }

  //   function getOSCALProjectStatusSuccess(response: any) {
  //     console.log(response);
  //   }
  //   function getOSCALProjectStatusFail(e: any) {
  //     console.log("operation fail " + e.statusText);
  //   }

  const handleAddNewCatalogBaseline = () => {
    setAddNewCatalogBaseline(true);
  };
  const handleCloseAddNewCatalogBaseline = () => {
    setAddNewCatalogBaseline(false);
  };
  const CreateNewButton: React.FC = () => {
    return (
      <>
        <CreateNew onClick={handleAddNewCatalogBaseline}>CREATE NEW +</CreateNew>
      </>
    );
  };
  const CatalogBaselineItem: React.FC<OSCALModelMetadataInfo> = (item) => {
    return (
      <ItemBox component="span">
        <ItemTitle>{item.title}</ItemTitle>
        <ItemDivider />
        <LastModified> Last Modified: {item.lastModified} </LastModified>
        <Version> Document Version: {item.version} </Version>
        <PublicationDate> Publication Date: {item.publicationDate} </PublicationDate>
        <ItemButton>
          <Label> OPEN CATALOG </Label>
        </ItemButton>
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

  const OSCALAddOrgDetails: React.FC<{ show: boolean }> = ({ show }) => {
    const [selectedCatalogBaseline, setSelectedCatalogBaseline] = useState<string>(Model);
    function handleCatalogBaselineRadioChange(event: React.ChangeEvent<HTMLInputElement>) {
      setSelectedCatalogBaseline(event.target.value);
    }
    Model = selectedCatalogBaseline;
    const title = "Add a New " + Model;
    if (AddNewCatalogBaseline)
      return (
        <ShadedContainer>
          <Dialog
            open={show}
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
                  <TextField fullWidth id={"orgName"} onChange={handleEditDescriptionChange} />
                  <OSCALFormLabel label={"Organization Phone"} required={false} />
                  <TextField fullWidth id={"orgPhone"} onChange={handleEditDescriptionChange} />
                </Grid>
                <Grid item xs={12}>
                  <OSCALFormLabel label={"Organization Email"} required={false} />
                  <TextField fullWidth id={"orgEmail"} onChange={handleEditDescriptionChange} />
                  <ToolBarMenu></ToolBarMenu>
                </Grid>
                <Grid item xs={12}>
                  <OSCALFormLabel label={"Document Version"} required={true} />
                  <TextField
                    fullWidth
                    id={"document-version"}
                    onChange={handleEditDescriptionChange}
                  />
                </Grid>
                <Grid item xs={12} sx={{ height: 90 }}>
                  <OSCALFormLabel label={Model + " Description "} required={false}></OSCALFormLabel>
                  <TextField
                    multiline={true}
                    fullWidth
                    id={"Catalog-new-description"}
                    onChange={handleEditDescriptionChange}
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
              <OSCALPrimaryButton>Next</OSCALPrimaryButton>
            </DialogActions>
          </Dialog>
        </ShadedContainer>
      );
    else return null;
  };

  const OSCALAddCatalogDetails: React.FC<{ show: boolean }> = ({ show }) => {
    const [selectedCatalogBaseline, setSelectedCatalogBaseline] = useState<string>(Model);
    function handleCatalogBaselineRadioChange(event: React.ChangeEvent<HTMLInputElement>) {
      setSelectedCatalogBaseline(event.target.value);
    }
    Model = selectedCatalogBaseline;
    const title = "Add a New " + Model;
    if (AddNewCatalogBaseline)
      return (
        <ShadedContainer>
          <Dialog
            open={show}
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
                  <TextField fullWidth id={"title"} onChange={handleEditDescriptionChange} />
                  <ToolBarMenu></ToolBarMenu>
                </Grid>
                <Grid item xs={12}>
                  <OSCALFormLabel label={"Document Version"} required={true} />
                  <TextField
                    fullWidth
                    id={"document-version"}
                    onChange={handleEditDescriptionChange}
                  />
                </Grid>
                <Grid item xs={12} sx={{ height: 90 }}>
                  <OSCALFormLabel label={Model + " Description "} required={false}></OSCALFormLabel>
                  <TextField
                    multiline={true}
                    fullWidth
                    id={"Catalog-new-description"}
                    onChange={handleEditDescriptionChange}
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
              <OSCALPrimaryButton>Next</OSCALPrimaryButton>
            </DialogActions>
          </Dialog>
        </ShadedContainer>
      );
    else return null;
  };

  function renderAddNewCatalogBaselineDialog() {
    if (!AddNewCatalogBaseline) return null;

    return <OSCALAddCatalogDetails show={AddNewCatalogBaseline} />;
  }
  const FilledBoxItem: React.FC<any> = (catalogId) => {
    const [metadataObject, setMetadataObject] = useState<any>();
    console.log("catalogId= ", catalogId.catalogId);

    modelUUID = catalogId.catalogId;
    const request_json = {
      method: "GET",
    };
    const operation = "/catalog/" + catalogId.catalogId + "/catalog/metadata";
    fetchRest(operation, request_json, getCatalogMetadataSuccess, getCatalogMetadataFail);

    function getCatalogMetadataSuccess(response: any) {
      setMetadataObject(response);
    }
    function getCatalogMetadataFail(e: any) {
      console.log("Operation fail " + e.statusText);
    }
    console.log("metadata= ");
    console.log(metadataObject);
    return (
      <></>
      //<CatalogBaselineItem
      // key={metadata.title}
      // title={metadata.title}
      // version={metadata["version"]}
      // lastModified={metadata["last-modified"]}
      // publicationDate={metadata["publication-date"]}
      // ></CatalogBaselineItem>
    );
  };
  function RenderCatalogItems(): ReactElement<any, any> {
    console.log("In RenderCatalogItems:");
    const [catalogIds, setCatalogIds] = useState<string[]>([]);

    // useEffect(() => {
    //   getOscalProjects();
    //   getCatalogProjects();
    //   getBaselineProjects();
    //   getCatalogMetadataSuccess();
    //    setMetadataInfo();
    // }, []);
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
      //getAllMetadataInfos(catalogs, "catalog");
    }
    function getCatalogProjectsStatusFail(e: any) {
      console.log("Operation fail " + e.statusText);
    }
    //console.log(catalogIds);
    console.log(" enumerate ids");
    catalogIds.flatMap((catalog) => console.log(catalog));
    return (
      <StackBox>
        <Stack spacing={{ xs: 10, sm: 2 }} direction="row" useFlexGap flexWrap="wrap">
          {catalogIds.flatMap((catalog) => (
            <FilledBoxItem key={catalog} catalogId={catalog}></FilledBoxItem>

            // <CatalogBaselineItem
            //   key={catalog}
            //   title={catalog}
            //   version={catalog}
            //   lastModified={catalog}
            //   publicationDate={catalog}
            // ></CatalogBaselineItem>
          ))}
        </Stack>
      </StackBox>
    );
  }
  const StackFunct: React.FC<ItemList> = (itemList) => {
    return (
      <StackBox>
        <Stack spacing={{ xs: 10, sm: 2 }} direction="row" useFlexGap flexWrap="wrap">
          {itemList.Items.map((item) => (
            <CatalogBaselineItem
              key={item.title}
              title={item.title}
              version={item.version}
              lastModified={item.lastModified}
              publicationDate={item.publicationDate}
            ></CatalogBaselineItem>
          ))}
        </Stack>
      </StackBox>
    );
  };

  return (
    <MainContainer>
      <CatalogBreadCrumbsMenu></CatalogBreadCrumbsMenu>
      <FormHeaderLabel> Catalogs & Baselines </FormHeaderLabel>
      <UploadButton></UploadButton>
      <CreateNewButton></CreateNewButton>
      <StackFunct Items={data}></StackFunct>
      {/* <RenderCatalogItems></RenderCatalogItems> */}
      {renderAddNewCatalogBaselineDialog()}
    </MainContainer>
  );
}
