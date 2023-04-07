import React from "react";
import { render, screen } from "@testing-library/react";
import { OSCALMarkupLine, OSCALMarkupMultiLine } from "./OSCALMarkupProse";

const asHtml = (component) => render(component).container.innerHTML;

test(`OSCALMarkupLine converts plaintext to HTML`, () => {
  const html = asHtml(<OSCALMarkupLine>Test</OSCALMarkupLine>);
  expect(html).toBe("Test");
});

test(`OSCALMarkupLine converts Italics, Bold and Plaintext`, () => {
  const html = asHtml(<OSCALMarkupLine>*Hello*, **world** I am in markdown</OSCALMarkupLine>);
  expect(html).toEqual("<em>Hello</em>, <strong>world</strong> I am in markdown");
});

test(`OSCALMarkupLine converts hyperlinks to HTML`, () => {
  render(<OSCALMarkupLine>[Link to EasyDynamics](https://www.easydynamics.com)]</OSCALMarkupLine>);
  const a = screen.getByText("Link to EasyDynamics");

  expect(a.href).toEqual("https://www.easydynamics.com/");
});

test(`OSCALMarkupLine converts images to HTML`, () => {
  const altText = `![alt text](url "title text")`;
  const html = asHtml(<OSCALMarkupLine>{altText}</OSCALMarkupLine>);
  expect(html).toEqual('<img src="url" alt="alt text" title="title text">');
});

test(`OSCALMarkupLine converts code to HTML`, () => {
  const html = asHtml(<OSCALMarkupLine>`Inserting Tester Code`</OSCALMarkupLine>);
  expect(html).toEqual("<code>Inserting Tester Code</code>");
});

test(`OSCALMarkupLine converts script to HTML`, () => {
  const nastyBoi = `<script>alert('Nasty script!')</script>`;
  const html = asHtml(<OSCALMarkupLine>{nastyBoi}</OSCALMarkupLine>);

  expect(html).toEqual("&lt;script&gt;alert('Nasty script!')&lt;/script&gt;");
});

test(`OSCALMarkupMultiLine converts a multiline string to HTML`, () => {
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
  const html = asHtml(<OSCALMarkupMultiLine>{multilineMarkdown}</OSCALMarkupMultiLine>);
  expect(html).toEqual(multilineAsHTML);
});

test(`OSCALMarkupLine Handles titles of links`, () => {
  const testingTitle = `Empty: [](# 'Testing Title')`;

  render(<OSCALMarkupLine>{testingTitle}</OSCALMarkupLine>);
  const a = screen.getByTitle("Testing Title");

  expect(a.href).toEqual("http://localhost/#");
  expect(a.title).toEqual("Testing Title");
});
