import {
  Checkbox,
  FormHelperText,
  FormLabel,
  TextField,
  Select,
  Radio,
  IconButton,
  styled,
} from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import DoneIcon from "@mui/icons-material/Done";
import React from "react";

// TODO: Add styling to GlobalStyles
export const OSCALTextField = (props) => {
  return (
    <>
      <FormLabel
        color="primary"
        sx={{ textWeight: "700", color: "black" }}
        component="legend"
        className=""
        disabled={props.disabled}
      >
        {props.label}
      </FormLabel>
      <TextField placeholder={props.placeholder} disabled={props.disabled} size="small"></TextField>
      <FormHelperText>{props.helper}</FormHelperText>
    </>
  );
};

export const OSCALDropdown = (props) => {
  return (
    <>
      <FormLabel
        sx={{ textWeight: "700", color: "black" }}
        component="legend"
        className=""
        disabled={props.disabled}
      >
        {props.label}
      </FormLabel>
      <Select
        placeholder={props.placeholder}
        value={props.value}
        disabled={props.disabled}
        size="small"
        sx={{ minWidth: "12.5rem" }}
      ></Select>
    </>
  );
};

export const OSCALCheckbox = () => {
  return <Checkbox className="" />;
};

export const OSCALRadio = () => {
  return <Radio className="" />;
};

const OSCALInputButton = styled(IconButton)(({ theme }) => ({
  color: theme.palette.secondary.main,
  border: `0.1rem solid ${theme.palette.secondary.main}`,
  "&:hover": {
    color: theme.palette.white.main,
    backgroundColor: theme.palette.primaryAccent.main,
    border: `0.1rem solid ${theme.palette.primaryAccent.main}`,
  },
}));

export const OSCALCancelButton = () => {
  return (
    <OSCALInputButton>
      <ClearIcon fontSize="small" />
    </OSCALInputButton>
  );
};

export const OSCALConfirmButton = () => {
  return (
    <OSCALInputButton>
      <DoneIcon fontSize="small" />
    </OSCALInputButton>
  );
};
