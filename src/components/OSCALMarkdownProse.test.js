import React from "react";
import ReactDomServer from "react-dom/server";
import OSCALMarkdownProse from "./OSCALMarkdownProse";

function asHtml(input) {
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

test(`OSCALMarkdownProse converts script to HTML`, () => {
  const testerString = asHtml(
    <OSCALMarkdownProse text="<script>alert('Nasty script!')</script>" />
  );

  expect(testerString).toEqual(
    "&lt;script&gt;alert(&#x27;Nasty script!&#x27;)&lt;/script&gt;"
  );
});

test(`OSCALMarkdownProse converts a multiline string to HTML`, () => {
  const multilineMarkdown = `
  this should be here
  # h1 heading
  
  ## h2 Heading
  
  This is in heading 2
  
  ### h3 Heading
  
  This is in heading 3
  
  #### **h4 Heading**
  `;
  const multilineAsHTML = `<p>this should be here</p>
<h1>h1 heading</h1>
<h2>h2 Heading</h2>
<p>This is in heading 2</p>
<h3>h3 Heading</h3>
<p>This is in heading 3</p>
<h4><strong>h4 Heading</strong></h4>`;
  const testerString = asHtml(<OSCALMarkdownProse text={multilineMarkdown} />);
  expect(testerString).toEqual(multilineAsHTML);
});

test(`OSCALMarkdownProse Handles titles of links`, () => {
  const testerString = asHtml(
    <OSCALMarkdownProse text="Empty: [](# 'Testing Title')" />
  );

  expect(testerString).toEqual(
    '<p>Empty: <a href="#" title="Testing Title"></a></p>'
  );
});
