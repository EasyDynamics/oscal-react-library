import React from "react";
import ReactMarkdown from "react-markdown";

/**
 * Renders a string of markdown to React elements
 * @param {String} props.text
 * @returns a React element from the markdown
 */

export default function OSCALMarkdownProse(props) {
  return (
    <ReactMarkdown
      components={{
        p: React.Fragment,
      }}
    >
      {props.text}
    </ReactMarkdown>
  );
}
