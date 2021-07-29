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

const Template = (args) => <OSCALBackMatter {...args} />;

export const Default = Template.bind({});

export const WithDescription = Template.bind({});

export const WithCitation = Template.bind({});

export const WithMediaType = Template.bind({});

export const WithoutTitle = Template.bind({});

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
