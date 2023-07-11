import {
  Checkbox,
  FormHelperText,
  FormLabel,
  TextField,
  Select,
  Radio,
  IconButton,
  styled,
  Typography,
  Stack,
} from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import DoneIcon from "@mui/icons-material/Done";
import { ErrorOutline } from "@mui/icons-material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const RequiredAsterick = () => {
  {
    return <Typography sx={{ color: (theme) => theme.palette.destructive.main }}>*</Typography>;
  }
};

const OptionalText = () => {
  {
    return (
      <Typography sx={{ color: (theme) => theme.palette.darkGray.main }}>
        &nbsp;(optional)
      </Typography>
    );
  }
};

const ErrorMessage = (props) => {
  {
    return (
      <Stack
        direction="row"
        sx={{
          fill: (theme) => theme.palette.destructive.main,
          color: (theme) => theme.palette.destructive.main,
          alignItems: "center",
          fontWeight: (theme) => theme.typography.fontWeightBold,
        }}
      >
        <ErrorOutline sx={{ width: "1rem" }} />
        {props.helper ? `\u00a0{props.helper}` : `\u00a0Fill in required text field`}
      </Stack>
    );
  }
};

export const OSCALFormLabel = (props) => {
  return (
    <FormLabel
      sx={{
        fontWeight: (theme) => theme.typography.fontWeightSemiBold,
        color: (theme) => theme.palette.black.main,
      }}
      component="legend"
      className=""
      disabled={props.disabled}
    >
      <Stack direction="row">
        {!props.noLabel && !props.disabled && props.required && <RequiredAsterick />}
        {props.label}
        {!props.noLabel && !props.disabled && !props.required && <OptionalText />}
      </Stack>
    </FormLabel>
  );
};

// TODO: Add styling to GlobalStyles
export const OSCALTextField = (props) => {
  return (
    <>
      <OSCALFormLabel {...props} />
      <TextField
        {...props}
        placeholder={props.placeholder}
        disabled={props.disabled}
        size="small"
        label=""
        sx={{
          backgroundColor: (theme) => props.error && theme.palette.lightPink.main,
          "& .MuiOutlinedInput-root": {
            "& > fieldset": {
              borderColor: (theme) => theme.palette.secondary.main,
            },
          },
          "&:hover .MuiOutlinedInput-root": {
            "& > fieldset": {
              borderColor: (theme) => theme.palette.primary.main,
            },
          },
        }}
      ></TextField>
      <FormHelperText>
        {props.error ? <ErrorMessage helper={props.helper} /> : props.helper}
      </FormHelperText>
    </>
  );
};

// TODO: Add in SearchField

export const OSCALDropdown = (props) => {
  return (
    <>
      <OSCALFormLabel {...props} />
      <Select
        {...props}
        label=""
        placeholder={props.placeholder}
        value={props.value}
        disabled={props.disabled}
        size="small"
        IconComponent={ExpandMoreIcon}
        sx={{
          minWidth: "100%",
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: (theme) => theme.palette.secondary.main,
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: (theme) => theme.palette.primary.main,
          },
        }}
      ></Select>
    </>
  );
};

export const OSCALCheckbox = styled(Checkbox)(({ theme }) => ({
  color: theme.palette.grayBlue.main,
  "&.Mui-checked": {
    color: theme.palette.primaryAccent.main,
  },
}));

export const OSCALRadio = styled(Radio)(({ theme }) => ({
  color: theme.palette.grayBlue.main,
  "&.Mui-checked": {
    color: theme.palette.primaryAccent.main,
  },
}));

const OSCALInputButton = styled(IconButton)(({ theme }) => ({
  color: theme.palette.secondary.main,
  border: `0.1rem solid ${theme.palette.secondary.main}`,
  "&:hover": {
    color: theme.palette.white.main,
    backgroundColor: theme.palette.primaryAccent.main,
    border: `0.1rem solid ${theme.palette.primaryAccent.main}`,
  },
}));

export const OSCALCancelButton = (props) => {
  return (
    <OSCALInputButton size="small">
      <ClearIcon fontSize="small" />
    </OSCALInputButton>
  );
};

export const OSCALConfirmButton = (props) => {
  return (
    <OSCALInputButton size="small">
      <DoneIcon fontSize="small" />
    </OSCALInputButton>
  );
};
