import React from "react";
import { styled, useTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import { Box } from "@mui/material";

export default function OSCALControlParamLegend() {
  const LegendLabel = styled(Typography)(
    ({ theme }) => `
      display: inline-flex;
      flex-direction: row;
      flex-wrap: wrap;
      justifyContent: flex-end;
      color: ${theme.palette.grey[400]};
      font-size: 0.85em;
      padding-left: 1em;
      padding-right: 1em;
      padding-top: 0.5em;
    `
  );

  const legendBox = (color) => (
    <Box
      borderRadius="25%"
      sx={{
        width: "1.25em",
        height: "1.25em",
        backgroundColor: color,
      }}
      mr={1}
    />
  );

  const theme = useTheme();

  return (
    <div>
      <LegendLabel aria-label="legend-placeholder-label">
        <span>{legendBox(theme.palette.warning.light)}</span>
        <span>Placeholder</span>
      </LegendLabel>
      <LegendLabel aria-label="legend-value-label">
        <span>{legendBox(theme.palette.info.light)}</span>
        <span>Value</span>
      </LegendLabel>
    </div>
  );
}
