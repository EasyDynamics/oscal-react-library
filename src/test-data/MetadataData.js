import { exampleParties } from "./CommonData";

const title = "Test Title";
const lastModified = "7/12/2021";
const version = "Revision 5";
const oscalVersion = "1.0.0";

export const exampleMetadata = {
  title,
  "last-modified": lastModified,
  version,
  "oscal-version": oscalVersion,
};

export const exampleMetadataWithPartiesAndRoles = {
  title,
  "last-modified": lastModified,
  version,
  "oscal-version": oscalVersion,
  roles: [
    {
      id: "creator",
      title: "Document creator",
    },
  ],
  parties: exampleParties,
  "responsible-parties": [
    {
      "role-id": "creator",
      "party-uuids": ["party-1"],
    },
  ],
};

export const testModifiableMetadata = {
  "last-modified": ["01-01-2022", () => {}],
  version: {
    ref: "TextField reference metadata version",
    edit: [false, () => {}],
    value: version,
    typographyVariant: "body2",
  },
  title: {
    ref: "TextField reference metadata title",
    edit: [false, () => {}],
    value: title,
    typographyVariant: "h6",
  },
};
