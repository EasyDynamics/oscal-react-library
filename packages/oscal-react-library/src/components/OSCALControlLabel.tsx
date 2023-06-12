import React from "react";
import { styled } from "@mui/material/styles";
import { Typography, TypographyProps } from "@mui/material";

const FallbackIdAsLabel = styled(Typography)(({ theme }) => ({
  color: theme.palette.grey[400],
  textTransform: "uppercase",
})) as typeof Typography;

export interface OSCALControlLabelProps extends TypographyProps {
  label?: string;
  id?: string;
  children?: React.ReactNode;

  // Workaround for mui/material-ui#13921
  component: React.ElementType;
}

const OSCALControlLabel: React.FC<OSCALControlLabelProps> = (props) => {
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
};
export default OSCALControlLabel;
