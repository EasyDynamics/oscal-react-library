import React from "react";
import OSCALBackMatter from "../components/OSCALBackMatter";
import {
  exampleBackMatter,
  exampleBackMatterCitation,
  exampleBackMatterDescription,
  exampleBackMatterDescription,
  exampleBackMatterMediaType,
  exampleBackMatterTitle,
} from "../test-data/BackMatterData";
import { parentUrlTestData } from "../test-data/Urls";

export default {
  title: "Components/Back Matter",
  component: OSCALBackMatter,
};

const Template = (args) => <OSCALBackMatter {...args} />;

export const Default = Template.bind({});

export const BackMatterTitle = Template.bind({});

export const BackMatterDescription = Template.bind({});

export const BackMatterCitation = Template.bind({});

export const BackMatterMediaType = Template.bind({});

Default.args = {
  backMatter: exampleBackMatter,
  parentUrl: parentUrlTestData,
};

BackMatterTitle.args = {
  backMatter: exampleBackMatterTitle,
  parentUrl: parentUrlTestData,
};

BackMatterDescription.args = {
  backMatter: exampleBackMatterDescription,
  parentUrl: parentUrlTestData,
};

BackMatterCitation.args = {
  backMatter: exampleBackMatterCitation,
  parentUrl: parentUrlTestData,
};

BackMatterMediaType.args = {
  backMatter: exampleBackMatterMediaType,
  parentUrl: parentUrlTestData,
};
