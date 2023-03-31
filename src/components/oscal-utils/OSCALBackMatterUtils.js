export default class BackMatterLookup {
  #backMatter;

  #preferBase64 = false;

  // the `preferBase64` parameter would allow operating "offline" without access to
  // public resources
  constructor(backMatter, preferBase64) {
    this.#backMatter = backMatter;
    this.#preferBase64 = preferBase64;
  }

  /**
   * @param uuid {string}
   * @param mediaType {?RegExp}
   *
   * @returns ResolvedUri {string} or undefined
   */
  resolveUuid(uuid, mediaType) {
    const resource = this.#backMatter.resources.find(
      (item) => item.uuid === uuid
    );

    if (!this.#preferBase64) {
      const rlink = resource?.rlinks?.find((item) => {
        const rlinkMediaType = item["media-type"];
        if (!mediaType || !rlinkMediaType) {
          return true;
        }
        return mediaType.test(rlinkMediaType);
      });

      if (rlink) {
        return { uri: rlink.href, mediaType: rlink["media-type"] };
      }
    }

    const base64 = resource?.base64;

    // We require media type to be present. In most cases in existing OSCAL documents,
    // media type is missing; however, the underlying document is not actually plain-text
    // data. If we don't specify a media type in the URI, the browser will assume that it
    // is plain text. This will cause a whole mess that we'd really rather avoid.
    // In the future, this may throw an error.
    if (!base64?.["media-type"]) {
      return undefined;
    }

    if (mediaType && !mediaType.test(base64["media-type"])) {
      return undefined;
    }

    if (!base64?.value) {
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

  /**
   * @param uri {string}
   * @param mediaType {?string}
   *
   * @returns ResolvedUri {string} or undefined
   */
  resolve(uri, mediaType) {
    if (uri.startsWith("#")) {
      return this.resolveUuid(uri.slice(1), mediaType);
    }

    return { uri, mediaType: undefined };
  }
}
