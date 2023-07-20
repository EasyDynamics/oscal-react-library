import AppBar from "@mui/material/AppBar";
import Avatar from "@mui/material/Avatar";
import Badge from "@mui/material/Badge";
import Button from "@mui/material/Button";
import { Divider, Typography, styled } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import Toolbar from "@mui/material/Toolbar";

import React, { useState } from "react";
import { ReactComponent as GearIcon } from "./images/icons/gear.svg";
import { ReactComponent as GearHovIcon } from "./images/icons/gear_hov.svg";
import { ReactComponent as SearchIcon } from "./images/icons/search.svg";
import { ReactComponent as NotifyIcon } from "./images/icons/notify.svg";
import { ReactComponent as NotifyHovIcon } from "./images/icons/notify_hov.svg";

const HoverableIconButton = styled(IconButton)(({ theme }) => ({
  fill: theme.palette.secondary.main,
  "& .MuiBadge-badge": {
    backgroundColor: theme.palette.primaryAccent.main,
  },
  "&:hover": {
    fill: theme.palette.primaryAccent.main,
    "& .MuiBadge-badge": {
      backgroundColor: theme.palette.secondary.main,
    },
  },
}));

const UserButton = styled(Button)(({ theme }) => ({
  marginRight: "0.5rem",
  color: theme.palette.secondary.main,
  textTransform: "none",
}));

const UserAvatar = styled(Avatar)(({ theme }) => ({
  marginRight: "0.5rem",
  border: `0.15rem solid ${theme.palette.primaryAccent.main}`,
}));

const InputAdornmentSearchIcon = styled(SearchIcon)(({ theme }) => ({
  margin: "-0.5rem",
  color: theme.palette.primary.main,
}));

// TODO: This can be removed once global styles is implemented
const BrandedTextField = styled(TextField)(({ theme }) => ({
  "& label.Mui-focused": {
    color: "blue",
  },
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: "#A2B0C7",
    },
    "&:hover fieldset": {
      borderColor: theme.palette.secondary.main,
    },
    "&.Mui-focused fieldset": {
      borderColor: theme.palette.primary.main,
    },
  },
}));

const TopAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: "white",
  color: "#BCC6D5",
}));

interface OSCALAppBarProps {
  drawerWidth: number;
  appBarHeight: number;
}

export const OSCALAppBar: React.FC<OSCALAppBarProps> = ({ drawerWidth, appBarHeight }) => {
  const [buttonOver, setButtonOver] = useState(null);

  const handleButtonOver = (button: any) => {
    setButtonOver(button);
  };

  const handleButtonLeave = () => {
    setButtonOver(null);
  };

  return (
    <TopAppBar position="fixed">
      <Toolbar>
        <Grid
          container
          sx={{ marginLeft: drawerWidth, minHeight: appBarHeight }}
          alignItems="center"
          spacing={0.5}
        >
          <Grid item md={3}>
            <BrandedTextField
              fullWidth
              aria-label="search field"
              placeholder={"Search projects, settings, and more..."}
              InputProps={{
                sx: { borderRadius: 50, marginLeft: "1rem" },
                startAdornment: (
                  <InputAdornment position="start">
                    <HoverableIconButton>
                      <InputAdornmentSearchIcon width="1.25rem" />
                    </HoverableIconButton>
                  </InputAdornment>
                ),
              }}
              size="small"
              variant="outlined"
              // TODO: onChange={handleSearchField}
            />
          </Grid>
          <Grid item md={9}>
            <Grid container justifyContent="right" alignItems="center">
              <Grid item>
                <HoverableIconButton
                  onMouseOver={() => {
                    handleButtonOver("gear");
                  }}
                  onMouseLeave={() => {
                    handleButtonLeave();
                  }}
                  // TODO: Either include an href="" to another screen or box appear beneath showing
                  // "preview" of settings
                >
                  {buttonOver === "gear" ? (
                    <GearHovIcon width="1.5rem" />
                  ) : (
                    <GearIcon width="1.5rem" />
                  )}
                </HoverableIconButton>
              </Grid>
              <Grid item>
                <HoverableIconButton
                  onMouseOver={() => {
                    handleButtonOver("notify");
                  }}
                  onMouseLeave={() => {
                    handleButtonLeave();
                  }}
                  // TODO: Either include an href="" to another screen or box appear beneath showing
                  // "preview" of notifications
                >
                  <Badge variant="dot" overlap="circular">
                    {buttonOver === "notify" ? (
                      <NotifyHovIcon width="1.5rem" />
                    ) : (
                      <NotifyIcon width="1.5rem" />
                    )}
                  </Badge>
                </HoverableIconButton>
              </Grid>
              <Divider
                orientation="vertical"
                flexItem
                sx={{
                  borderRightWidth: 2,
                  margin: "0.5rem",
                  marginBottom: "0.5rem",
                }}
              />
              <Grid item>
                <UserButton
                // TODO: Show "preview" of User options with drop own menu
                >
                  <UserAvatar>U</UserAvatar>
                  Username
                  <ExpandMoreIcon />
                </UserButton>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Toolbar>
    </TopAppBar>
  );
};
