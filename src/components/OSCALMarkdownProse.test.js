import React from "react";
import { render, screen, within } from "@testing-library/react";
import { OSCALMarkdownProse } from "./OSCALMarkdownProse";
import ReactDom from 'react-dom'

function markdownRenderer() {
  render(<OSCALMarkdownProse children={props.text} />);
}

function asHtml(input) {
    return ReactDom.renderToStaticMarkup(input);
  }
  
export default function testOSCALMarkdown(parentElementName, renderer) {
  test(` ${parentElement} can convert plaintext`, () => {
    renderer();
    assert.equal(asHtml(<OSCALMarkdownProse>Test</OSCALMarkdownProse>), '<p>Test</p>');

  });
}
