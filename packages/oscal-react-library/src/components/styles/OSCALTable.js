import React from "react";
import { TableCell, TableContainer } from "@mui/material";
import Table from "@mui/material/Table";
import TableRow from "@mui/material/TableRow";

export const OSCALPrimaryTable = (props) => {
  return <Table {...props} sx={{ borderSpacing: "0 0.5rem", borderCollapse: "separate" }} />;
};

export const OSCALPrimaryTableRow = (props) => {
  return <TableRow {...props} className="PrimaryTableRow" />;
};

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
  return (
    <TableContainer
      {...props}
      sx={{
        borderWidth: 1,
        borderColor: "black",
        borderStyle: "solid",
        maxHeight: "18.6rem",
        maxWidth: "29.9rem",
      }}
      className="RightScrollbar"
    />
  );
};

export const OSCALSecondaryTableCellContainer = (props) => {
  return <div {...props} className="SecondaryTableCellContainer RightScrollbar" />;
};

export const OSCALSecondaryTableRow = (props) => {
  return <TableRow {...props} className="SecondaryTableRow" />;
};

export const OSCALSecondaryTableSubRow = (props) => {
  return <TableRow {...props} className="SecondaryTableSubHeaderRow" />;
};

export const OSCALSecondaryTableCell = (props) => {
  return <TableCell {...props} className="SecondaryTableCell" padding={"none"} />;
};

export const OSCALTertiaryTable = (props) => {
  return (
    <Table
      {...props}
      className="TertiaryTable"
      sx={{
        borderWidth: 1,
        borderColor: (theme) => theme.palette.lightGrayBlue.main,
        borderStyle: "solid",
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
      }}
      className="RightScrollbar"
    />
  );
};
