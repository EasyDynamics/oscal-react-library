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
  children: string | undefined;
}

export interface OSCALMarkupMultiLineInterface extends OSCALMarkupInterface {
  paragraphComponent?: any;
}

/**
 * Renders a string of markdown to React elements
 */
export const OSCALMarkupMultiLine: React.FC<OSCALMarkupMultiLineInterface> = ({
  children,
  paragraphComponent,
  ...rest
}) => {
  if (!children) {
    return null;
  }

  return (
    <ReactMarkdown
      {...rest}
      components={{
        ...baseComponents,
        p: paragraphComponent ?? "p",
      }}
    >
      {children}
    </ReactMarkdown>
  );
};

export const OSCALMarkupLine: React.FC<OSCALMarkupInterface> = ({ children, ...rest }) => {
  if (!children) {
    return null;
  }

  return (
    <ReactMarkdown {...rest} components={{ ...baseComponents, p: React.Fragment }}>
      {children}
    </ReactMarkdown>
  );
};
