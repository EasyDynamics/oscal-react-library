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
  const multilineMarkdown =
    "this should b here # h1 Heading 8-    ## h2 Heading     This is in heading 2    ### h3 Heading      This is in heading 3    #### h4 Heading      ##### **h5 Heading**    ###### h6 Heading ";
  const multilineAsHTML =
    "<p>this should b here # h1 Heading 8-    ## h2 Heading     This is in heading 2    ### h3 Heading      This is in heading 3    #### h4 Heading      ##### <strong>h5 Heading</strong>    ###### h6 Heading</p>";
  const testerString = asHtml(<OSCALMarkdownProse text={multilineMarkdown} />);

  expect(testerString).toEqual(multilineAsHTML);
});
