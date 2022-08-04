import React from "react";
import ReactMarkdown from "react-markdown";

export default function OSCALMarkdownProse(props) {
  return <ReactMarkdown>{props.text}</ReactMarkdown>;
}
