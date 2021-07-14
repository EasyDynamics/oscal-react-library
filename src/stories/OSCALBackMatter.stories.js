import React from "react";
import OSCALBackMatter from "../components/OSCALBackMatter";

export default {
  title: "Components/Back Matter",
  component: OSCALBackMatter,
};

const Template = (args) => <OSCALBackMatter {...args} />;

export const Default = Template.bind({});

const exampleBackMatter = {
  resources: [
    {
      uuid: "dc380596-027f-423b-83f2-82757554ee27",
      description:
        "NIST Special Publication 800-53 Revision 4: Security and Privacy Controls for Federal Information Systems and Organizations",
      rlinks: [
        {
          href: "NIST_SP-800-53_rev4_catalog.json",
          "media-type": "application/oscal.catalog+json",
        },
      ],
    },
  ],
};

const exampleParentUrl =
  "https://raw.githubusercontent.com/usnistgov/oscal-content/master/nist.gov/SP800-53/rev4/json/NIST_SP-800-53_rev4_MODERATE-baseline_profile.json";

Default.args = {
  backMatter: exampleBackMatter,
  parentUrl: exampleParentUrl,
};
