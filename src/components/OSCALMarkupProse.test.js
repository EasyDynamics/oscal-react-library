import React from "react";
import ReactDomServer from "react-dom/server";
import { OSCALMarkupLine, OSCALMarkupMultiLine } from "./OSCALMarkupProse";

const asHtml = (input) => ReactDomServer.renderToStaticMarkup(input);
test(`OSCALMarkupLine converts plaintext to HTML`, () => {
  const testerString = asHtml(<OSCALMarkupLine text="Test" />);
  expect(testerString).toEqual("Test");
});

test(`OSCALMarkupLine converts Italics, Bold and Plaintext`, () => {
  const testerString = asHtml(
    <OSCALMarkupLine text="*Hello*, **world** I am in markdown" />
  );
  expect(testerString).toEqual(
    "<em>Hello</em>, <strong>world</strong> I am in markdown"
  );
});

test(`OSCALMarkupLine converts hyperlinks to HTML`, () => {
  const testerString = asHtml(
    <OSCALMarkupLine text="[Link to EasyDynamics](https://www.easydynamics.com)]" />
  );
  expect(testerString).toEqual(
    '<a href="https://www.easydynamics.com">Link to EasyDynamics</a>]'
  );
});
test(`OSCALMarkupLine converts images to HTML`, () => {
  const testerString = asHtml(
    <OSCALMarkupLine text={'![alt text](url "title text")'} />
  );
  expect(testerString).toEqual(
    '<img src="url" alt="alt text" title="title text"/>'
  );
});

test(`OSCALMarkupLine converts images to HTML`, () => {
  const testerString = asHtml(
    <OSCALMarkupLine text="`Inserting Tester Code`" />
  );
  expect(testerString).toEqual("<code>Inserting Tester Code</code>");
});

test(`OSCALMarkupLine converts script to HTML`, () => {
  const testerString = asHtml(
    <OSCALMarkupLine text="<script>alert('Nasty script!')</script>" />
  );

  expect(testerString).toEqual(
    "&lt;script&gt;alert(&#x27;Nasty script!&#x27;)&lt;/script&gt;"
  );
});

test(`OSCALMarkupLine converts a multiline string to HTML`, () => {
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
  const testerString = asHtml(
    <OSCALMarkupMultiLine text={multilineMarkdown} paragraphComponent="p" />
  );
  expect(testerString).toEqual(multilineAsHTML);
});

test(`OSCALMarkupLine Handles titles of links`, () => {
  const testerString = asHtml(
    <OSCALMarkupLine text="Empty: [](# 'Testing Title')" />
  );

  expect(testerString).toEqual('Empty: <a href="#" title="Testing Title"></a>');
});
