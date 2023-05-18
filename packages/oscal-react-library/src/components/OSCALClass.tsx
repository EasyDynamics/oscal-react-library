import { Chip } from "@mui/material";
import React from "react";
import { colorFromString } from "../utils";

interface HasClass {
  class?: string;
}

interface SmallInlineClassDisplayProps {
  item: HasClass;
}

export const SmallInlineClassDisplay: React.FC<SmallInlineClassDisplayProps> = ({ item }) => {
  return item.class ? (
    <Chip size="small" label={item.class} sx={{ bgcolor: colorFromString(item.class) }} />
  ) : null;
};
