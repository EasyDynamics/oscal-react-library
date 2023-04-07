import type { BackMatter } from "@easydynamics/oscal-types";
import { BackMatterLookup } from "./OSCALBackMatterUtils";

const mediaTypeRegex = /^image\//;
const mediaType = "image/png";

const base64Value = "aaabbbccc";

const rlinkResource = {
  uuid: "7e56057e-194b-4f66-b1fb-9c318b3fc701",
  uri: "#7e56057e-194b-4f66-b1fb-9c318b3fc701",
  href: "test-image.png",
};

const base64Resource = {
  uuid: "93abfff9-1196-4dfe-b802-7f6676a828ae",
  uri: "#93abfff9-1196-4dfe-b802-7f6676a828ae",
};

const base64ResourceNoMediaType = {
  uuid: "fe980d37-6866-4edc-9f93-916bbb59328b",
  uri: "#fe980d37-6866-4edc-9f93-916bbb59328b",
};

const base64ResourceNoValue = {
  uuid: "817d5cbf-aa38-45bb-91e9-1f59f5f9e522",
  uri: "#817d5cbf-aa38-45bb-91e9-1f59f5f9e522",
};

const base64ResourceWrongMediaType = {
  uuid: "efd827a3-8ff2-449a-bcde-b710fde34ff8",
  uri: "#efd827a3-8ff2-449a-bcde-b710fde34ff8",
};

const backMatter: BackMatter = {
  resources: [
    {
      uuid: rlinkResource.uuid,
      rlinks: [
        {
          href: rlinkResource.href,
          "media-type": mediaType,
        },
      ],
    },
    {
      uuid: base64Resource.uuid,
      base64: {
        "media-type": mediaType,
        value: base64Value,
      },
    },
    {
      uuid: base64ResourceNoMediaType.uuid,
      base64: {
        value: base64Value,
      },
    },
    {
      uuid: base64ResourceNoValue.uuid,
      base64: {
        value: "",
        "media-type": mediaType,
      },
    },
    {
      uuid: base64ResourceWrongMediaType.uuid,
      base64: {
        value: base64Value,
        "media-type": "html",
      },
    },
  ],
};

describe("BackMatterLookup", () => {
  test("can be created", () => {
    const lookup = new BackMatterLookup(backMatter);

    expect(lookup).toBeInstanceOf(BackMatterLookup);
    expect(lookup.resolve("", new RegExp(""))).toBeDefined();
  });

  test("resolves valid rlink resource", () => {
    const lookup = new BackMatterLookup(backMatter);

    const resource = lookup.resolve(rlinkResource.uri, mediaTypeRegex);

    expect(resource?.mediaType).toBe(mediaType);
    expect(resource?.uri).toBe(rlinkResource.href);
  });

  test("doesn't return rlink when preferring base64", () => {
    const lookup = new BackMatterLookup(backMatter, true);

    const resource = lookup.resolve(rlinkResource.uri, mediaTypeRegex);

    expect(resource).toBeUndefined();
  });

  test("only checks backmatter for items with #", () => {
    const lookup = new BackMatterLookup(backMatter);

    const resource = lookup.resolve(rlinkResource.uuid, mediaTypeRegex);

    expect(resource?.mediaType).toBeUndefined();
    expect(resource?.uri).toBe(rlinkResource.uuid);
  });

  test("resolves valid base64 resource", () => {
    const lookup = new BackMatterLookup(backMatter);

    const resource = lookup.resolve(base64Resource.uri, mediaTypeRegex);

    expect(resource?.mediaType).toBe(mediaType);
    expect(resource?.uri).toBe(`data:${mediaType};base64,${base64Value}`);
  });

  test("handles base64 resource without mediaType", () => {
    const lookup = new BackMatterLookup(backMatter);

    const resource = lookup.resolve(
      base64ResourceNoMediaType.uri,
      mediaTypeRegex
    );

    expect(resource).toBeUndefined();
  });

  test("handles base64 resource without value", () => {
    const lookup = new BackMatterLookup(backMatter);

    const resource = lookup.resolve(base64ResourceNoValue.uri, mediaTypeRegex);

    expect(resource).toBeUndefined();
  });

  test("handles base64 resource with wrong media type", () => {
    const lookup = new BackMatterLookup(backMatter);

    const resource = lookup.resolve(
      base64ResourceWrongMediaType.uri,
      mediaTypeRegex
    );

    expect(resource).toBeUndefined();
  });
});
