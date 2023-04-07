import type { BackMatter } from "@easydynamics/oscal-types";

export interface ResolvedUri {
  /**
   * The URI for the resource.
   *
   * This may not be an HTTP(S) URL; it may be a data URI with base64-encoded
   * data.
   */
  readonly uri: string;

  /**
   * The media type for the resource, if known.
   */
  readonly mediaType?: string;
}

export interface ResourceLinkQuery {
  /**
   * Get a URI for a resource based on its URI reference.
   *
   * @param uri - the URI reference to lookup
   * @param mediaType - the preferred media ty
   */
  resolve: (uri: string, mediaType?: RegExp) => ResolvedUri | undefined;
}

export class BackMatterLookup implements ResourceLinkQuery {
  private readonly backMatter: BackMatter;
  private readonly preferBase64: boolean;

  /**
   * @param backMatter the back matter to look up the resource in
   * @param preferBase64 whether base64 should be used instead of rlinks
   */
  constructor(backMatter: BackMatter, preferBase64?: boolean) {
    this.backMatter = backMatter;
    this.preferBase64 = preferBase64 ?? false;
  }

  private resolveUuid(
    uuid: string,
    mediaType?: RegExp
  ): ResolvedUri | undefined {
    const resource = this.backMatter.resources?.find(
      (resource) => resource.uuid === uuid
    );

    if (!this.preferBase64) {
      const rlink = resource?.rlinks?.find((item) => {
        const rlinkMediaType = item["media-type"];
        if (!mediaType || !rlinkMediaType) {
          return true;
        }
        return mediaType.test(rlinkMediaType);
      });

      if (rlink) {
        return {
          uri: rlink.href,
          mediaType: rlink["media-type"],
        };
      }
    }

    const base64 = resource?.base64;

    if (!base64?.["media-type"]) {
      console.error(`Resource ${uuid} does not have a media-type specified`);
      return undefined;
    }

    if (!base64?.value) {
      console.error(
        `Resource ${uuid} does not have a value, so a URL cannot be constructed`
      );
      return undefined;
    }

    return {
      uri: `data:${base64["media-type"]};base64,${base64.value.replace(
        "\n",
        ""
      )}`,
      mediaType: base64["media-type"],
    };
  }

  public resolve(uri: string, mediaType?: RegExp) {
    if (uri.startsWith("#")) {
      return this.resolveUuid(uri.slice(1), mediaType);
    }

    return { uri, mediaType: undefined };
  }
}
