import React from "react";
import ReactMarkdown from "react-markdown";

import OpenInNewIcon from "@mui/icons-material/OpenInNew";

const components = {
  a: ({ ...props }) =>
    props.href.startsWith("http") ? (
      <a target="_blank" {...props}>
        <OpenInNewIcon /> {props.children}
      </a>
    ) : (
      <a {...props}>{props.children}</a>
    ),
};

/**
 * Renders a string of markdown to React elements
 * @param {String} props.text
 * @returns a React element from the markdown
 */

export function OSCALMarkupMultiLine(props) {
  components.p = props.paragraphComponent ?? "p";
  return (
    <ReactMarkdown components={components}>{props.children}</ReactMarkdown>
  );
}

export function OSCALMarkupLine(props) {
  components.p = React.Fragment;
  return (
    <ReactMarkdown components={components}>{props.children}</ReactMarkdown>
  );
}
