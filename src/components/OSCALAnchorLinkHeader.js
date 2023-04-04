import React, { useState } from "react";
import Stack from "@mui/material/Stack";
import LinkIcon from "@mui/icons-material/Link";
import { Link } from "react-router-dom";
import Fade from "@mui/material/Fade";
import { conformLinkIdText } from "./oscal-utils/OSCALLinkUtils";

export default function OSCALAnchorLinkHeader(props) {
  const { children, value } = props;
  const [isHover, setIsHover] = useState(false);
  const onEnter = () => {
    setIsHover(true);
  };
  const onLeave = () => {
    setIsHover(false);
  };

  const linkId = value || conformLinkIdText(children);

  return (
    <Stack
      direction="row"
      gap={1}
      alignItems="center"
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      id={linkId}
    >
      {children}
      {isHover && (
        // Navigate to a specified fragment or use the child text
        <Link reloadDocument to={`#${linkId}`}>
          <Fade in={isHover}>
            <LinkIcon
              sx={[
                (theme) => ({
                  width: "0.75em",
                  height: "0.75em",
                  color: theme.palette.grey[500],
                }),
              ]}
              aria-label={`${linkId} anchor link`}
            />
          </Fade>
        </Link>
      )}
    </Stack>
  );
}
