import React, { useState } from "react";
import Stack from "@mui/material/Stack";
import LinkIcon from "@mui/icons-material/Link";
import { Link } from "react-router-dom";
import Fade from "@mui/material/Fade";

export default function OSCALAnchorLinkHeader(props) {
  const [hover, setHover] = useState(false);
  const onEnter = () => {
    setHover(true);
  };
  const onLeave = () => {
    setHover(false);
  };

  const editString = (str) =>
    str.props?.children.replaceAll(" ", "-")?.toLowerCase() ||
    str.replaceAll(" ", "-").toLowerCase();

  const linkId = props.value || editString(props.children);

  return (
    <Stack
      direction="row"
      gap={1}
      alignItems="center"
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      id={linkId}
    >
      {props.children}
      {hover && (
        // Navigate to a specified fragment or use the child text
        <Link reloadDocument to={`#${linkId}`}>
          <Fade in={hover}>
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
