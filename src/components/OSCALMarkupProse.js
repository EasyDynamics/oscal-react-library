import React from "react";
import ReactMarkdown from "react-markdown";

/**
 * Renders a string of markdown to React elements
 * @param {String} props.text
 * @returns a React element from the markdown
 */

export function OSCALMarkupMultiLine(props) {
  if (props.paragraphComponent) {
    return (
      <ReactMarkdown
        components={{
          p: props.paragraphComponent,
        }}
      >
        {props.text}
      </ReactMarkdown>
    );
  }
  return <ReactMarkdown>{props.text}</ReactMarkdown>;
}

export function OSCALMarkupLine(props) {
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
