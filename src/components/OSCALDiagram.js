import React from "react";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import resolveLinkHref from "./oscal-utils/OSCALLinkUtils";

const PREFIX = "OSCALDiagram";

const classes = {
  OSCALDiagramImg: `${PREFIX}-OSCALDiagramImg`,
};

// TODO jss-to-styled codemod: The Fragment root was replaced by div. Change the tag if needed.
const Root = styled("div")(() => ({
  [`& .${classes.OSCALDiagramImg}`]: {
    maxWidth: "100%",
  },
}));

export default function OSCALDiagram(props) {
  // Just grab the first rlink for now
  const link = props.diagram?.links[0];
  if (!link) {
    throw new Error("no rlink found");
  }

  let diagramUri;
  try {
    diagramUri = resolveLinkHref(
      props.backMatter,
      link.href,
      props.parentUrl,
      /^image\//
    );
  } catch (err) {
    // Silently fail on unresolved diagram resources
    diagramUri = link.href;
  }

  return (
    <Root>
      <img
        src={diagramUri}
        alt={props.diagram.caption}
        className={classes.OSCALDiagramImg}
      />
      <Typography variant="caption" display="block" align="center" gutterBottom>
        {props.diagram.caption}
      </Typography>
    </Root>
  );
}
