import React from "react";
import ReactDomServer from "react-dom/server";
import OSCALMarkdownProse from "./OSCALMarkdownProse";

export default function asHtml(input) {
  return ReactDomServer.renderToStaticMarkup(input);
}

test(`OSCALMarkdownProse converts plaintext to HTML`, () => {
  const testerString = asHtml(<OSCALMarkdownProse text="Test" />);
  expect(testerString).toEqual("<p>Test</p>");
});

test(`OSCALMarkdownProse converts Italics, Bold and Plaintext`, () => {
  const testerString = asHtml(
    <OSCALMarkdownProse text="*Hello*, **world** I am in markdown" />
  );
  expect(testerString).toEqual(
    "<p><em>Hello</em>, <strong>world</strong> I am in markdown</p>"
  );
});

test(`OSCALMarkdownProse converts hyperlinks to HTML`, () => {
  const testerString = asHtml(
    <OSCALMarkdownProse text="[Link to EasyDynamics](https://www.easydynamics.com)]" />
  );
  expect(testerString).toEqual(
    '<p><a href="https://www.easydynamics.com">Link to EasyDynamics</a>]</p>'
  );
});
test(`OSCALMarkdownProse converts images to HTML`, () => {
  const testerString = asHtml(
    <OSCALMarkdownProse text={'![alt text](url "title text")'} />
  );
  expect(testerString).toEqual(
    '<p><img src="url" alt="alt text" title="title text"/></p>'
  );
});

test(`OSCALMarkdownProse converts images to HTML`, () => {
  const testerString = asHtml(
    <OSCALMarkdownProse text="`Inserting Tester Code`" />
  );
  expect(testerString).toEqual("<p><code>Inserting Tester Code</code></p>");
});
