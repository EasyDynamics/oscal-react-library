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
        {props.error != true ? `\u00a0${props.error}` : `\u00a0This field is required`}
      </Stack>
    );
  }
};

export const OSCALFormLabel = (props) => {
  return (
    <>
      <FormLabel
        sx={{
          fontWeight: (theme) => theme.typography.fontWeightSemiBold,
          color: (theme) => theme.palette.black.main,
        }}
        component="legend"
        disabled={props.disabled}
      >
        <Stack direction="row">
          {!props.noLabel && !props.disabled && props.required && <RequiredAsterick />}
          {props.label}
          {!props.noLabel && !props.disabled && !props.required && <OptionalText />}
        </Stack>
      </FormLabel>
      {props.children}
      <FormHelperText>
        {props.error ? <ErrorMessage error={props.error} /> : props.helper}
      </FormHelperText>
    </>
  );
};

// TODO: Add styling to GlobalStyles
export const OSCALTextField = (props) => {
  return (
    <OSCALFormLabel {...props}>
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
              borderColor: (theme) => !props.disabled && !props.error && theme.palette.primary.main,
            },
          },
        }}
      />
    </OSCALFormLabel>
  );
};

// TODO: Add in SearchField

export const OSCALDropdown = (props) => {
  return (
    <OSCALFormLabel {...props}>
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
      />
    </OSCALFormLabel>
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

export const OSCALCancelButton = (props) => {
  return (
    <IconButton
      {...props}
      size="small"
      sx={{
        color: (theme) => theme.palette.secondary.main,
        border: (theme) => `0.1rem solid ${theme.palette.secondary.main}`,
      }}
    >
      <ClearIcon fontSize="small" />
    </IconButton>
  );
};

export const OSCALConfirmButton = (props) => {
  return (
    <IconButton
      {...props}
      size="small"
      sx={{
        color: (theme) => theme.palette.white.main,
        backgroundColor: (theme) => theme.palette.primaryAccent.main,
        border: (theme) => `0.1rem solid ${theme.palette.primaryAccent.main}`,
        "&:hover": {
          backgroundColor: (theme) => theme.palette.primaryAccent.main,
        },
      }}
    >
      <DoneIcon fontSize="small" />
    </IconButton>
  );
};
