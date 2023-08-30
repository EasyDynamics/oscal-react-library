import React from "react";
import { TableCell, TableContainer } from "@mui/material";
import Table from "@mui/material/Table";
import TableRow from "@mui/material/TableRow";
import styled from "@emotion/styled";

// Primary Table - seperation between rows, no border, primary color header
const OSCALHelperPrimaryTable = styled(Table)(() => ({
  borderSpacing: "0 0.5rem",
  borderCollapse: "separate",
}));

export const OSCALPrimaryTable = (props) => {
  return <OSCALHelperPrimaryTable {...props} />;
};

export const OSCALPrimaryTableRow = (props) => {
  return <TableRow {...props} className="PrimaryTableRow" />;
};

// Secondary Table (commonly used in modals) - black outline, alternating row color
const OSCALHelperSecondaryTable = styled(Table)(() => ({
  borderCollapse: "separate",
  maxHeight: "18.6rem",
}));

export const OSCALSecondaryTable = (props) => {
  return <OSCALHelperSecondaryTable {...props} />;
};

export const OSCALSecondaryTableContainer = (props) => {
  return <TableContainer {...props} className="SecondaryTableContainer RightScrollbar" />;
};

export const OSCALSecondaryTableRow = (props) => {
  return <TableRow {...props} className="SecondaryTableRow" />;
};

export const OSCALSecondaryTableCellContainer = (props) => {
  return <div {...props} className="SecondaryTableCellContainer RightScrollbar" />;
};

export const OSCALSecondaryTableCell = (props) => {
  return <TableCell {...props} padding={"none"} />;
};

// Tertiary Table - gray outline, multiple gray color headings, alternating colored rows
export const OSCALTertiaryTable = (props) => {
  return <Table {...props} className="TertiaryTable" />;
};

const OSCALHelperTertiaryTableOuterContainer = styled(TableContainer)(({ theme }) => ({
  border: `1px solid ${theme.palette.lightGrayBlue.main}`,
}));

export const OSCALTertiaryTableOuterContainer = (props) => {
  return <OSCALHelperTertiaryTableOuterContainer {...props} />;
};

const OSCALHelperTertiaryTableContainer = styled(TableContainer)(() => ({
  maxHeight: "50vh",
  overflow: "auto",
}));

export const OSCALTertiaryTableContainer = (props) => {
  return <OSCALHelperTertiaryTableContainer {...props} className="RightScrollbar" />;
};

export const OSCALTertiaryTableSubHeaderRow = (props) => {
  return <TableRow {...props} className="TertiaryTableSubHeaderRow" />;
};

export const OSCALTertiaryTableHeadCell = (props) => {
  return <TableCell {...props} padding={"checkbox"} className="TertiaryTableCell" />;
};

export const OSCALTertiaryTableCell = (props) => {
  return <TableCell {...props} padding={"none"} className="TertiaryTableCell" />;
};
