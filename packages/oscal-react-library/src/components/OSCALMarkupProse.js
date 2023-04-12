import React from "react";
import Link from "@mui/material/Link";
import ReactMarkdown from "react-markdown";

import OpenInNewIcon from "@mui/icons-material/OpenInNew";

const baseComponents = {
  a: ({ ...props }) =>
    props.href.startsWith("http") ? (
      <Link target="_blank" {...props}>
        <OpenInNewIcon /> {props.children}
      </Link>
    ) : (
      <Link {...props}>{props.children}</Link>
    ),
};

/**
 * Renders a string of markdown to React elements
 * @param {String} props.text
 * @returns a React element from the markdown
 */
export function OSCALMarkupMultiLine(props) {
  const { paragraphComponent, ...otherProps } = props;
  return (
    <ReactMarkdown
      {...otherProps}
      components={{
        ...baseComponents,
        p: paragraphComponent ?? "p",
      }}
    />
  );
}

export function OSCALMarkupLine(props) {
  return <ReactMarkdown {...props} components={{ ...baseComponents, p: React.Fragment }} />;
}