import React, { ReactNode, useState } from "react";
import Stack from "@mui/material/Stack";
import LinkIcon from "@mui/icons-material/Link";
import { Link } from "react-router-dom";
import Fade from "@mui/material/Fade";
import { styled } from "@mui/material/styles";
import { conformLinkIdText } from "./oscal-utils/OSCALLinkUtils";

const AnchorLinkIcon = styled(LinkIcon)(({ theme }) => ({
  width: "0.75em",
  height: "0.75em",
  color: theme.palette.grey[500],
}));

export interface AnchorLinkProps {
  /**
   * he current fragment being handled
   */
  readonly urlFragment?: string;
  /**
   * The beginning of a fragment which ends with the current group/control being handled
   */
  readonly fragmentPrefix?: string;
  /**
   * The end of a fragment which starts with the current group/control being handled
   */
  readonly fragmentSuffix?: string;
}

export interface OSCALAnchorLinkHeaderProps {
  /**
   * Text or element to link to.
   *
   * @example a <Typography />
   */
  children: ReactNode;
  /**
   * Value to be used in the id and fragment. If not specified,
   * children will be used.
   */
  name?: string;
}

export const OSCALAnchorLinkHeader: React.FC<OSCALAnchorLinkHeaderProps> = (props) => {
  const { children, name } = props;
  const [isHover, setIsHover] = useState(false);
  const onEnter = () => {
    setIsHover(true);
  };
  const onLeave = () => {
    setIsHover(false);
  };

  const linkId = name || conformLinkIdText(children);

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
        <Link to={`#${linkId}`}>
          <Fade in={isHover}>
            <AnchorLinkIcon aria-label={`${linkId} anchor link`} />
          </Fade>
        </Link>
      )}
    </Stack>
  );
};
