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

export interface OSCALMarkupInterface {
  children: string;
}

export interface OSCALMarkupMultiLineInterface extends OSCALMarkupInterface {
  paragraphComponent?: any;
}

/**
 * Renders a string of markdown to React elements
 */
export const OSCALMarkupMultiLine: React.FC<OSCALMarkupMultiLineInterface> = (props) => {
  return (
    <ReactMarkdown
      {...props}
      components={{
        ...baseComponents,
        p: props.paragraphComponent ?? "p",
      }}
    />
  );
};

export const OSCALMarkupLine: React.FC<OSCALMarkupInterface> = (props) => {
  return <ReactMarkdown {...props} components={{ ...baseComponents, p: React.Fragment }} />;
};
