import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import resolveLinkHref from "./oscal-utils/OSCALLinkUtils";

const useStyles = makeStyles(() => ({
  OSCALDiagramImg: {
    maxWidth: "100%",
  },
}));

export default function OSCALDiagram(props) {
  const classes = useStyles(props);

  // Just grab the first rlink for now
  const link = props.diagram?.links[0];
  if (!link) {
    throw new Error("no rlink found");
  }

  const diagramUri = resolveLinkHref(
    props.backMatter,
    link.href,
    props.parentUrl,
    /^image\//
  );

  return (
    <>
      <img
        src={diagramUri}
        alt={props.diagram.caption}
        className={classes.OSCALDiagramImg}
      />
      <Typography variant="caption" display="block" align="center" gutterBottom>
        {props.diagram.caption}
      </Typography>
    </>
  );
}
