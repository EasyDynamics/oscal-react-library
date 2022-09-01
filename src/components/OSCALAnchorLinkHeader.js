import React, { useState } from "react";
import Stack from "@mui/material/Stack";
import LinkIcon from "@mui/icons-material/Link";
import { Link } from "react-router-dom";
import Fade from '@mui/material/Fade';

export default function OSCALAnchorLinkHeader(props) {
  const [hover, setHover] = useState(false);
  const onEnter = () => {
    setHover(true);
  };
  const onLeave = () => {
    setHover(false);
  };

  const editString = (str) => {
    return str.replaceAll(" ", "-").toLowerCase();
  }

  return (
    <Stack
      direction={"row"}
      gap={1}
      alignItems="start"
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      id={editString(props.title)}
    >
      {props.title}
      {!hover ? (
        ""
      ) : (
        <Link to={{ hash: `#${editString(props.title)}` }}>
          <Fade in={hover}>
            <LinkIcon />
          </Fade>
        </Link>
      )}
    </Stack>
  );
}
