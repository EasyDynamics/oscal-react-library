import React from "react";
import { styled } from "@mui/material/styles";
import { Typography } from "@mui/material";

const FallbackIdAsLabel = styled(Typography)(({ theme }) => ({
  color: theme.palette.grey[400],
  textTransform: "uppercase",
}));

export default function OSCALControlLabel(props) {
  const { label, id, children, ...rest } = props;
  if (label) {
    return (
      <Typography {...rest}>
        {label} {children}
      </Typography>
    );
  }
  return (
    <FallbackIdAsLabel {...rest}>
      {id} {children}
    </FallbackIdAsLabel>
  );
}
