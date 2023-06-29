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
import { Stack, styled } from "@mui/system";
//import { useFetchers } from "./Fetchers";

export const CreateNew = styled(Button)`
  position: absolute;
  width: 142px;
  height: 35px;
  top: 120px;
  left: 1050px;
  border: 1px;
  border: 1px solid #073c92;
`;

export const Upload = styled(Button)`
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
export const StackBox = styled(Box)`
  position: absolute;
  top: 186px;
  left: 100px;
  width: 1088px;
  height: 800px;
`;

export const ItemBox = styled(Box)`
  height: 187.11px;
  width: 351px;
  border-radius: 0px;
  border: 1px solid #00286726;
  box-shadow: 0px 0px 10px 0px #00000029;
  position: relative;
  background: #ffffff;
`;
export const ShadedContainer = styled(Container)`
  position: absolute;
  width: 1440px;
  height: 900px;
  top: 0px;
  left: 150px;
  border: 1px;
  background: #2B2B2B66;
}
`;
export const MainContainer = styled(Container)`
  position: absolute;
  width: 1440px;
  height: 900px;
  top: 0px;
  left: 150px;
  border: 1px;
  background: #f6f6f6;
`;

export const Label = styled(Typography)`
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
export const ItemButton = styled(Button)`
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
export const ItemTitle = styled(Typography)`
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
export const LastModified = styled(Typography)`
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
export const Version = styled(Typography)`
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
export const PublicationDate = styled(Typography)`
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
export const ItemDivider = styled(Divider)`
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
export const FormHeaderLabel = styled(FormLabel)`
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
export const BreadCrumbMenu = styled(BreadCrumbs)`
  position: absolute;
  width: 321px;
  height: 100px;
  top: 96px;
  left: 100px;
  font-family: "Source Sans Pro";
  font-style: normal;
  font-size: 16px;
  line-height: 20px;
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
export class UploadButton extends React.Component {
  render() {
    return (
      <Upload>
        {" "}
        <Typography style={{ color: "#023E88" }}> UPLOAD</Typography>{" "}
      </Upload>
    );
  }
}
const handleClick = () => {
  return <OSCALAddNewCatalogBaseline></OSCALAddNewCatalogBaseline>;
};
export class CreateNewButton extends React.Component {
  render() {
    return (
      <CreateNew className="createNew" onClick={handleClick}>
        {" "}
        <Typography style={{ color: "#023E88" }}> CREATE NEW + </Typography>{" "}
      </CreateNew>
    );
  }
}
export const CatalogBreadCrumbsMenu: React.FC<OSCALModelMetadataInfo | null> = (item) => {
  if (item != null && item.title != null && item.title.length > 0)
    return (
      <BreadCrumbMenu aria-label="breadcrumb" className="breadcrumb">
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
      </BreadCrumbMenu>
    );
  else
    return (
      <BreadCrumbMenu aria-label="breadcrumb">
        <Link underline="hover" href="/" style={{ color: "#1D1D1D", fontWeight: "400" }}>
          Home
        </Link>
        <Link underline="hover" href="/" style={{ color: "#002867", fontWeight: "700" }}>
          CATALOGS & BASELINES
        </Link>
      </BreadCrumbMenu>
    );
};

export const CatalogBaselineItem: React.FC<OSCALModelMetadataInfo> = (item) => {
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

export const StackFunct: React.FC<ItemList> = (itemList) => {
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

export const OSCALCatalogBaseline: React.FC = () => {
  return (
    <MainContainer>
      <CatalogBreadCrumbsMenu></CatalogBreadCrumbsMenu>
      <FormHeaderLabel> Catalogs & Baselines </FormHeaderLabel>
      <UploadButton></UploadButton>
      <CreateNewButton></CreateNewButton>
      <StackFunct Items={data}></StackFunct>
    </MainContainer>
  );
};

export const OSCALAddNewCatalogBaseline: React.FC = () => {
  return (
    <MainContainer>
      <CatalogBreadCrumbsMenu></CatalogBreadCrumbsMenu>
      <FormHeaderLabel> Catalogs & Baselines </FormHeaderLabel>
      <UploadButton></UploadButton>
      <CreateNewButton></CreateNewButton>
      <StackFunct Items={data}></StackFunct>
      <ShadedContainer></ShadedContainer>
    </MainContainer>
  );
};

export default OSCALCatalogBaseline;
