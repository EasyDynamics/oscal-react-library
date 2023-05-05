import React from "react";
import OSCALBackMatter from "../components/OSCALBackMatter";
import {
  exampleBackMatter,
  exampleBackMatterWithCitation,
  exampleBackMatterWithDescription,
  exampleBackMatterWithMediaType,
  exampleBackMatterWithoutTitle,
} from "../test-data/BackMatterData";
import { parentUrlTestData } from "../test-data/Urls";

export default {
  title: "Components/Back Matter",
  component: OSCALBackMatter,
};

function Template(args) {
  return <OSCALBackMatter {...args} />;
}

export const Default = Template.bind({});

export const WithDescription = Template.bind({});

export const WithCitation = Template.bind({});

export const WithMediaType = Template.bind({});

export const WithoutTitle = Template.bind({});

export const WithType = Template.bind({});

export const WithTypeAndDescription = Template.bind({});

Default.args = {
  backMatter: exampleBackMatter,
  parentUrl: parentUrlTestData,
};

WithDescription.args = {
  backMatter: exampleBackMatterWithDescription,
  parentUrl: parentUrlTestData,
};

WithCitation.args = {
  backMatter: exampleBackMatterWithCitation,
  parentUrl: parentUrlTestData,
};

WithMediaType.args = {
  backMatter: exampleBackMatterWithMediaType,
  parentUrl: parentUrlTestData,
};

WithoutTitle.args = {
  backMatter: exampleBackMatterWithoutTitle,
  parentUrl: parentUrlTestData,
};

WithType.args = {
  backMatter: {
    resources: [{ ...exampleBackMatter.resources[0], props: [{ name: "type", value: "logo" }] }],
  },
  parentUrl: parentUrlTestData,
};

WithTypeAndDescription.args = {
  backMatter: {
    resources: [
      {
        ...exampleBackMatterWithDescription.resources[0],
        props: [{ name: "type", value: "logo" }],
      },
    ],
  },
  parentUrl: parentUrlTestData,
};
