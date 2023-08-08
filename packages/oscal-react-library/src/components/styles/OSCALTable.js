import React from "react";
import { TableCell, TableContainer } from "@mui/material";
import Table from "@mui/material/Table";
import TableRow from "@mui/material/TableRow";

// Primary Table - seperation between rows, no border, primary color header
export const OSCALPrimaryTable = (props) => {
  return <Table {...props} sx={{ borderSpacing: "0 0.5rem", borderCollapse: "separate" }} />;
};

export const OSCALPrimaryTableRow = (props) => {
  return <TableRow {...props} className="PrimaryTableRow" />;
};

// Secondary Table (commonly used in modals) - black outline, alternating row color
export const OSCALSecondaryTable = (props) => {
  return (
    <Table
      {...props}
      sx={{
        borderCollapse: "separate",
        maxHeight: "18.6rem",
      }}
    />
  );
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

export const OSCALTertiaryTableOuterContainer = (props) => {
  return (
    <TableContainer
      {...props}
      sx={{
        border: (theme) => `1px solid ${theme.palette.lightGrayBlue.main}`,
      }}
    />
  );
};

export const OSCALTertiaryTableContainer = (props) => {
  return (
    <TableContainer
      {...props}
      sx={{
        maxHeight: "50vh",
        overflow: "auto",
      }}
      className="RightScrollbar"
    />
  );
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
