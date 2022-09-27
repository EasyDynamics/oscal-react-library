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

  return (
    <Stack
      direction="row"
      gap={1}
      alignItems="start"
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      id={props.value || editString(props.children)}
    >
      {props.children}
      {hover && (
        // Navigate to a specified hash or use the child text
        <Link to={{ hash: `#${props.value || editString(props.children)}` }}>
          <Fade in={hover}>
            <LinkIcon
              sx={[
                (theme) => ({
                  width: "0.75em",
                  height: "0.75em",
                  color: theme.palette.grey[500],
                }),
              ]}
            />
          </Fade>
        </Link>
      )}
    </Stack>
  );
}
