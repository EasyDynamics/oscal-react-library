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

export const BackMatterWithDescription = Template.bind({});

export const BackMatterWithCitation = Template.bind({});

export const BackMatterWithMediaType = Template.bind({});

export const BackMatterWithoutTitle = Template.bind({});

Default.args = {
  backMatter: exampleBackMatter,
  parentUrl: parentUrlTestData,
};

BackMatterWithDescription.args = {
  backMatter: exampleBackMatterWithDescription,
  parentUrl: parentUrlTestData,
};

BackMatterWithCitation.args = {
  backMatter: exampleBackMatterWithCitation,
  parentUrl: parentUrlTestData,
};

BackMatterWithMediaType.args = {
  backMatter: exampleBackMatterWithMediaType,
  parentUrl: parentUrlTestData,
};

BackMatterWithoutTitle.args = {
  backMatter: exampleBackMatterWithoutTitle,
  parentUrl: parentUrlTestData,
};
