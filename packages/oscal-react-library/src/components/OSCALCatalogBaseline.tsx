import React from "react";

import { Catalog, Profile } from "@easydynamics/oscal-types";
import { EditableFieldProps } from "./OSCALEditableTextField";

import { Link, Typography } from "@mui/material";
import FormLabel from "@mui/material/FormLabel";
import BreadCrumbs from "@mui/material/Breadcrumbs";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import { Divider } from "@mui/material";
import "../styles/OSCALCatalogBaseline.css";
import { Stack } from "@mui/system";
//import { useFetchers } from "./Fetchers";

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
export class UploadButton extends React.Component {
  render() {
    return (
      <Button className="upload">
        {" "}
        <Typography style={{ color: "#023E88" }}> UPLOAD</Typography>{" "}
      </Button>
    );
  }
}
const handleClick = () => {
  return <OSCALAddNewCatalogBaseline></OSCALAddNewCatalogBaseline>;
};
export class CreateNewButton extends React.Component {
  render() {
    return (
      <Button className="createNew" onClick={handleClick}>
        {" "}
        <Typography style={{ color: "#023E88" }}> CREATE NEW + </Typography>{" "}
      </Button>
    );
  }
}
export const CatalogBreadCrumbMenu: React.FC<OSCALModelMetadataInfo | null> = (item) => {
  if (item != null && item.title != null && item.title.length > 0)
    return (
      <BreadCrumbs aria-label="breadcrumb" className="breadcrumb">
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
      <BreadCrumbs aria-label="breadcrumb" className="breadcrumb">
        <Link underline="hover" href="/" style={{ color: "#1D1D1D", fontWeight: "400" }}>
          Home
        </Link>
        <Link underline="hover" href="/" style={{ color: "#002867", fontWeight: "700" }}>
          CATALOGS & BASELINES
        </Link>
      </BreadCrumbs>
    );
};

export class CatalogBaselineHeader extends React.Component {
  render() {
    return <FormLabel className="header"> Catalogs & Baselines</FormLabel>;
  }
}

export const CatalogBaselineItem: React.FC<OSCALModelMetadataInfo> = (item) => {
  return (
    <Box component="span" className="box">
      <Typography className="title">{item.title}</Typography>
      <Divider className="divider" />
      <Typography className="lastModified"> Last Modified: {item.lastModified} </Typography>
      <Typography className="version"> Document Version: {item.version} </Typography>
      <Typography className="publicationDate">
        {" "}
        Publication Date: {item.publicationDate}{" "}
      </Typography>
      <Button className="button">
        <Typography className="buttonLabel"> OPEN CATALOG </Typography>
      </Button>
    </Box>
  );
};

export const StackFunct: React.FC<ItemList> = (itemList) => {
  return (
    <Box className="boxStack">
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
    </Box>
  );
};

export const OSCALCatalogBaseline: React.FC = () => {
  return (
    <Container className="container">
      <CatalogBreadCrumbMenu></CatalogBreadCrumbMenu>
      <CatalogBaselineHeader></CatalogBaselineHeader>
      <UploadButton></UploadButton>
      <CreateNewButton></CreateNewButton>
      <StackFunct Items={data}></StackFunct>
    </Container>
  );
};

export const OSCALAddNewCatalogBaseline: React.FC = () => {
  return (
    <Container className="container">
      <CatalogBreadCrumbMenu></CatalogBreadCrumbMenu>
      <CatalogBaselineHeader></CatalogBaselineHeader>
      <UploadButton></UploadButton>
      <CreateNewButton></CreateNewButton>
      <StackFunct Items={data}></StackFunct>
      <Container className="containerShaded"></Container>
    </Container>
  );
};

export default OSCALCatalogBaseline;
