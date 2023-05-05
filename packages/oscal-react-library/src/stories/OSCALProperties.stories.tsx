import React from "react";
import { StoryFn } from "@storybook/react";
import { Property } from "@easydynamics/oscal-types";
import { OSCALPropertiesDialog, OSCALPropertiesDialogProps } from "../components/OSCALProperties";

const exampleProperties: Property[] = [
  {
    name: "Example Property 1",
    value: "Example Value",
    ns: "http://easydynamics.com/ns/oscal/example",
  },
  {
    name: "Example Property 2",
    value: "Example Value",
  },
  {
    name: "Example Property 3",
    value: "Example Value",
  },
];

export default {
  title: "Components/Properties Dialog",
  component: OSCALPropertiesDialog,
};

const Template: StoryFn<OSCALPropertiesDialogProps> = (args) => <OSCALPropertiesDialog {...args} />;

export const Default = Template.bind({});

Default.args = {
  properties: exampleProperties,
  title: "Components/Properties Dialog Title",
};
