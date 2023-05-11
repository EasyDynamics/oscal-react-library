import { Box, Popover } from "@mui/material";
import React from "react";
import { OSCALMarkupLine, OSCALMarkupMultiLine } from "./OSCALMarkupProse";

export interface HoverablePopoverProps {
  /**
   * The content of the popover.
   */
  popoverContent: React.ReactNode;

  /**
   * Content to hover over.
   */
  children: React.ReactNode;
}

export const HoverablePopover: React.FC<HoverablePopoverProps> = ({ popoverContent, children }) => {
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);

  const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return (
    <>
      <Box
        component="span"
        aria-owns={open ? "mouse-over-popover" : undefined}
        aria-haspopup="true"
        onMouseEnter={handlePopoverOpen}
        onMouseLeave={handlePopoverClose}
      >
        {children}
      </Box>
      <Popover
        open={open}
        sx={{
          pointerEvents: "none",
          maxWidth: "30em",
        }}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        anchorEl={anchorEl}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        onClose={handlePopoverClose}
        disableRestoreFocus
      >
        <Box sx={{ padding: "1em" }}>{popoverContent}</Box>
      </Popover>
    </>
  );
};

export interface MarkupPopoverProps {
  /**
   * The markup multi line content of the popover.
   */
  popoverContent: string;

  /**
   * Content to hover over.
   */
  children: React.ReactNode;
}

export const MarkupMultiLinePopover: React.FC<MarkupPopoverProps> = ({
  popoverContent,
  children,
}) => {
  const markup = <OSCALMarkupMultiLine>{popoverContent}</OSCALMarkupMultiLine>;

  return <HoverablePopover popoverContent={markup}>{children}</HoverablePopover>;
};

export const MarkupLinePopover: React.FC<MarkupPopoverProps> = ({ popoverContent, children }) => {
  const markup = <OSCALMarkupLine>{popoverContent}</OSCALMarkupLine>;

  return <HoverablePopover popoverContent={markup}>{children}</HoverablePopover>;
};
