import * as mt from "./OSCALMediaTypeUtils";

describe("MediaType", () => {
  const testValues: Array<mt.IMediaType & { mediaType: string }> = [
    {
      mediaType: "application/json",
      type: mt.Type.APPLICATION,
      subtype: "json",
    },
    {
      mediaType: "example/test",
      type: mt.Type.EXAMPLE,
      subtype: "test",
    },
    {
      mediaType: "image/svg+xml",
      type: mt.Type.IMAGE,
      subtype: "svg",
      suffix: mt.Suffix.XML,
    },
  ];
  it.each(["application", 1231, "not a mediatype", "fake/type"])(
    "returns undefined for invalid media types (%s)",
    (s) => {
      expect(mt.MediaType.fromString(s.toString())).toBeUndefined();
    }
  );
  it.each(testValues)("parses the type value ($mediaType is $type)", ({ mediaType, type }) => {
    expect(mt.MediaType.fromString(mediaType)?.type).toEqual(type);
  });
  it.each(testValues)(
    "parses the subtype value ($mediaType is $subtype)",
    ({ mediaType, subtype }) => {
      expect(mt.MediaType.fromString(mediaType)?.subtype).toEqual(subtype);
    }
  );
  it.each(testValues)(
    "parses the suffix correctly ($mediaType is $suffix)",
    ({ mediaType, suffix }) => {
      expect(mt.MediaType.fromString(mediaType)?.suffix).toEqual(suffix);
    }
  );
  it.each(testValues)("round-trips values correctly ($mediaType)", ({ mediaType }) => {
    expect(mt.MediaType.fromString(mediaType)?.toString()).toEqual(mediaType);
  });
});

describe("Friendly Display for media type", () => {
  // The only fields of an `rlink` that should be considered are the HREF and media-type;
  // therefore, we will only define those fields.
  type TestData = Array<{ rlink: { href: string; "media-type"?: string }; expected: string }>;

  it("gets paths from URLs", () => {
    expect(
      mt.getFriendlyDisplayOfMediaType({ href: "https://example.com/foo.json?test=true#blah" })
    ).toEqual("JSON");
  });
  it("ignores the TLD of a domain", () => {
    expect(mt.getFriendlyDisplayOfMediaType({ href: "https://example.zip" })).toMatch(
      /Unrecognized/
    );
  });

  it.each([
    { rlink: { href: "file.json", "media-type": "audio/aac" }, expected: "Audio (AAC)" },
    { rlink: { href: "https://example.com", "media-type": "application/json" }, expected: "JSON" },
    { rlink: { href: "file.json", "media-type": "video/x-test" }, expected: "Video" },
  ] as TestData)(
    "prefers media-type when present ($#: $rlink.href => '$expected')",
    ({ rlink, expected }) => {
      expect(mt.getFriendlyDisplayOfMediaType(rlink)).toEqual(expected);
    }
  );

  it("treats example/ as unrecognized", () => {
    expect(mt.getFriendlyDisplayOfMediaType({ href: "", "media-type": "example/test" })).toMatch(
      /Unrecognized/
    );
  });
  it.each(Object.values(mt.Type).filter((it) => it !== "example"))(
    "has a generic fallback for each type (%s)",
    (type) => {
      expect(
        mt.getFriendlyDisplayOfMediaType({ href: "", "media-type": `${type}/x-test` })
      ).not.toMatch(/Unrecognized/);
    }
  );

  it.each(["xml", "json", "yaml"])("handles the OSCAL mime type for %s", (suffix) => {
    const mediaType = `application/oscal+${suffix}`;
    const expected = `OSCAL (${suffix.toUpperCase()})`;
    expect(
      mt.getFriendlyDisplayOfMediaType({ href: "file.test", "media-type": mediaType })
    ).toEqual(expected);
  });
});
