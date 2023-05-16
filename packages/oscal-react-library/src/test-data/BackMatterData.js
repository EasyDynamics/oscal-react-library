import { revFourCatalog } from "./Urls";
import diagram from "./resources/diagram.png";

const citation = {
  text: "This is an example citation",
};
const description =
  "NIST Special Publication 800-53 Revision 4: Security and Privacy Controls for Federal Information Systems and Organizations";
const href = "NIST_SP-800-53_rev4_catalog.json";
const mediaType = "application/oscal.catalog+json";
const title = "Resource Title";
const uuid = "dc380596-027f-423b-83f2-82757554ee27";

export const backMatterTestData = {
  resources: [
    {
      uuid: "dc380596-027f-423b-83f2-82757554ee27",
      title: "Resource Test Title",
      description: "This is a test description for resource",
      rlinks: [
        {
          href: revFourCatalog,
          "media-type": "application/oscal.catalog+json",
        },
        {
          href,
          "media-type": "application/something.else",
        },
      ],
      props: [
        {
          name: "keywords",
          value: "Resource test keywords",
        },
      ],
    },
    {
      uuid: "dc380596-027f-423b-83f2-82757554ee28",
      title: "Resource Test Title 2",
      description: "This is a test description for resource 2",
      rlinks: [
        {
          href,
          "media-type": "application/json",
        },
      ],
    },
    {
      uuid: "a2fc103a-9fe6-433d-a83b-44a33db1564b",
      title: "Some Diagram",
      description: "This is a test diagram",
      rlinks: [
        {
          href: diagram,
          "media-type": "image/png",
        },
      ],
    },
  ],
};

export const exampleBackMatter = {
  resources: [
    {
      uuid,
      title,
      rlinks: [
        {
          href,
        },
      ],
    },
  ],
};

export const exampleBackMatterWithoutTitle = {
  resources: [
    {
      uuid,
      citation,
      description,
      rlinks: [
        {
          href,
          "media-type": mediaType,
        },
      ],
    },
  ],
};

export const exampleBackMatterWithDescription = {
  resources: [
    {
      uuid,
      title,
      description,
      rlinks: [
        {
          href,
        },
      ],
    },
  ],
};

export const exampleBackMatterWithCitation = {
  resources: [
    {
      uuid,
      title,
      citation,
      description,
      rlinks: [
        {
          href,
        },
      ],
    },
  ],
};

export const exampleBackMatterWithMediaType = {
  resources: [
    {
      uuid,
      title,
      citation,
      description,
      rlinks: [
        {
          href,
          "media-type": mediaType,
        },
      ],
    },
  ],
};

export const exampleBackMatterWithoutMediaType = {
  resources: [
    {
      uuid,
      title,
      citation,
      description,
      rlinks: [
        {
          href: diagram,
        },
      ],
    },
  ],
};

export const exampleBackMatterWithoutMediaTypeAndUnknownExtension = {
  resources: [
    {
      uuid,
      title,
      citation,
      description,
      rlinks: [
        {
          href: "unknown/unknown-filetype",
        },
      ],
    },
  ],
};
