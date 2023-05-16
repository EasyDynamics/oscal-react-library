import { ResourceLink } from "@easydynamics/oscal-types";
import mimeDb from "mime-db";

/**
 * A naive implementation to get the extension of a file name.
 *
 * This is meant to mimic the behavior of node's `path.extname` without the
 * complexity of supporting a whole polyfill library. It adds support for
 * URLs (which is not in Node's implementation) as we may receive data with
 * a query or fragment.
 *
 * @param path the full file name to get an extension for
 */
function extname(path: string): string | undefined {
  const fromUrl = (path: string) => {
    try {
      return new URL(path).pathname;
    } catch (_) {
      return path;
    }
  };
  const pathname = fromUrl(path);
  const extension = pathname.split(".").pop();
  if (extension === pathname) return undefined;
  return extension;
}

export const UNRECOGNIZED = "Unrecognized File Type";

type Matcher = (type: MediaType) => string | undefined;

export enum Type {
  APPLICATION = "application",
  AUDIO = "audio",
  EXAMPLE = "example",
  FONT = "font",
  IMAGE = "image",
  MESSAGE = "message",
  MODEL = "model",
  MULTIPART = "multipart",
  TEXT = "text",
  VIDEO = "video",
}

export function isValidType(str: string): str is Type {
  switch (str) {
    case Type.APPLICATION:
    case Type.AUDIO:
    case Type.EXAMPLE:
    case Type.FONT:
    case Type.IMAGE:
    case Type.MESSAGE:
    case Type.MODEL:
    case Type.MULTIPART:
    case Type.TEXT:
    case Type.VIDEO:
      return true;
  }
  return false;
}

export enum Suffix {
  XML = "xml",
  JSON = "json",
  BER = "ber",
  CBOR = "cbor",
  DER = "der",
  FAST_INFOSET = "fastinfoset",
  WBXML = "wbxml",
  ZIP = "zip",
  TLV = "tlv",
  JSON_SEQ = "json-seq",
  SQLITE3 = "sqlite3",
  JWT = "jwt",
  GZIP = "gzip",
  CBOR_SEQ = "cbor-seq",
  ZSTANDARD = "zstd",
}

export function isRegisteredSuffix(str: string): str is Type {
  switch (str) {
    case Suffix.XML:
    case Suffix.JSON:
    case Suffix.BER:
    case Suffix.CBOR:
    case Suffix.DER:
    case Suffix.FAST_INFOSET:
    case Suffix.WBXML:
    case Suffix.ZIP:
    case Suffix.TLV:
    case Suffix.JSON_SEQ:
    case Suffix.SQLITE3:
    case Suffix.JWT:
    case Suffix.GZIP:
    case Suffix.CBOR_SEQ:
    case Suffix.ZSTANDARD:
      return true;
  }
  return false;
}

export interface IMediaType {
  readonly type: Type;
  readonly subtype: string;
  readonly suffix?: Suffix | string;
}

/**
 * A Media/MIME type object.
 *
 * This contains the type, subtype, and suffix. This can be parsed using
 * `fromString` static factory method.
 *
 * Formally, this only supports types under the registered categories with
 * IANA.
 */
export class MediaType implements IMediaType {
  static fromString(s: string): MediaType | undefined {
    const [type, rest] = s.split("/");
    if (!isValidType(type) || !rest) {
      return undefined;
    }
    const [subtype, suffix] = rest.split("+");
    return new MediaType(type, subtype, suffix);
  }

  public readonly type: Type;
  public readonly subtype: string;
  public readonly suffix?: Suffix | string;

  private constructor(type: Type, subtype: string, suffix?: string) {
    this.type = type;
    this.subtype = subtype;
    this.suffix = suffix;
  }

  toString(): string {
    return `${this.type}/${this.subtype}${this.suffix ? `+${this.suffix}` : ""}`;
  }
}

// Maps a media type to a list of functions that can be used to determine a display name for
// the specific subtype/suffix. The functions in the list will be applied in order until one
// returns a non-undefined value; therefore, higher-priority items should be placed towards the
// top of the list.
// Only a subset of media types are currently included. This is intentional. The last entry
// in every list is a reasonable fall back for items in that category. Of course, `application/`
// is the hardest for that but overall, this should be a reasonable set of mappings considering
// the audience of the library/application.
/** @private */
const map: { [key in Type]: Matcher[] } = {
  [Type.APPLICATION]: [
    // Handle the various OSCAL document format types specially
    (type) =>
      type.suffix === Suffix.XML && type.subtype.startsWith("oscal") ? "OSCAL (XML)" : undefined,
    (type) =>
      type.suffix === Suffix.JSON && type.subtype.startsWith("oscal") ? "OSCAL (JSON)" : undefined,
    (type) =>
      // Formally, YAML is not a registered suffix; however, it is called out specifically in the
      // OSCAL documentation. Therefore, we will handle it.
      type.suffix === "yaml" && type.subtype.startsWith("oscal") ? "OSCAL (YAML)" : undefined,

    // Microsoft Office document formats
    (type) => {
      switch (type.subtype) {
        case "msword":
          return "Microsoft Word (.doc)";
        case "vnd.openxmlformats-officedocument.wordprocessingml.document":
          return "Microsoft Word (.docx)";
        case "vnd.ms-excel":
          return "Microsoft Excel (.xls)";
        case "vnd.openxmlformats-officedocument.spreadsheetml.sheet":
          return "Microsoft Excel (.xlsx)";
        case "vnd.ms-powerpoint":
          return "Microsoft PowerPoint (.ppt)";
        case "vnd.openxmlformats-officedocument.presentationml.presentation":
          return "Microsoft PowerPoint (.pptx)";
      }
      return undefined;
    },

    (type) => {
      // Note: Support for the YAML media type and suffix is currently a draft RFC. We support
      // it because it is already in semi-common use and a specific document type for OSCAL.
      // https://www.ietf.org/id/draft-ietf-httpapi-yaml-mediatypes-06.html
      switch (type.subtype) {
        case "yaml":
        case "x-yaml":
          return "YAML";
        case "json":
          return "JSON";
        case "xml":
          return "XML";
      }
      // Fallback to the base document type for some specific suffixes. This isn't strictly
      // correct in all cases but is probably sufficient in the JSON/XML/YAML case within
      // application/
      switch (type.suffix) {
        case Suffix.JSON:
          return "JSON";
        case Suffix.XML:
          return "XML";
        case "yaml":
          return "YAML";
      }
    },
    (type) => (type.subtype === "pdf" ? "PDF" : undefined),
    (type) => (type.subtype === "zip" ? "ZIP" : undefined),
    (type) => (type.subtype === "pem-certificate-chain" ? "PEM Chain" : undefined),
    (type) => (type.subtype === "pkcs8" ? "PKCS8" : undefined),
    (type) => (type.subtype === "pgp-signature" ? "PGP Signature" : undefined),
    (type) => (type.subtype === "rtf" ? "Rich Text (RTF)" : undefined),
    (type) => (type.subtype === "ogg" ? "Media (OGG)" : undefined),
    (type) => (type.subtype === "octet-stream" ? "Binary Data" : undefined),

    () => "Application/Binary Data",
  ],
  [Type.AUDIO]: [
    ({ subtype }) => {
      switch (subtype) {
        case "mpeg":
          return "Audio (MP3)";
        case "mp4":
          return "Audio (MP4)";
        case "aac":
          return "Audio (AAC)";
        case "ogg":
          return "Audio (OGG)";
      }
    },
    () => "Audio",
  ],
  [Type.EXAMPLE]: [() => UNRECOGNIZED],
  [Type.FONT]: [() => "Font"],
  [Type.IMAGE]: [
    (type) => {
      switch (type.subtype) {
        case "gif":
          return "Image (GIF)";
        case "heic":
          return "Image (HEIC)";
        case "jpeg":
          return "Image (JPEG)";
        case "png":
          return "Image (PNG)";
        case "tiff":
          return "Image (TIFF)";
        case "svg+xml":
          return "Image (SVG)";
        case "bmp":
          return "Image (BMP)";
        case "webp":
          return "Image (WebP)";
        case "x-icon":
        case "vnd.microsoft.icon":
          return "Image (Icon)";
        case "vnd.adobe.photoshop":
          return "Image (Photoshop)";
      }
    },
    () => "Image",
  ],
  [Type.MESSAGE]: [() => "Message"],
  [Type.MODEL]: [() => "Model"],
  [Type.MULTIPART]: [() => "Multipart Data"],
  [Type.TEXT]: [
    ({ subtype }) => (subtype === "xml" ? "XML" : undefined),
    ({ subtype }) => (subtype === "javascript" ? "JavaScript" : undefined),
    ({ subtype }) => (subtype === "html" ? "HTML" : undefined),
    (type) =>
      type.suffix === Suffix.XML && type.subtype.startsWith("oscal") ? "OSCAL (XML)" : undefined,
    ({ subtype }) => (subtype === "plain" ? "Plain Text" : undefined),
    ({ subtype }) => (subtype === "markdown" || subtype === "x-markdown" ? "Markdown" : undefined),
    () => "Text",
  ],
  [Type.VIDEO]: [
    ({ subtype }) => {
      switch (subtype) {
        case "H264":
          return "Video (H.264)";
        case "mp4":
          return "Video (MP4)";
        case "raw":
          return "Video (Raw)";
        case "JPEG":
          return "Video (JPEG)";
        case "OGG":
          return "Video (OGG)";
      }
    },
    () => "Video",
  ],
};

/**
 * A cache of file extensions to media types.
 *
 * @private
 */
const mediaTypeCache: { [extension: string]: string[] } = {};

/**
 * Build the cache of extensions to media types.
 *
 * @private
 */
function buildCache() {
  Object.entries(mimeDb).forEach(([type, data]) => {
    data.extensions?.forEach((ext) => {
      mediaTypeCache[ext] ??= [];
      mediaTypeCache[ext].push(type);
    });
  });
}
/**
 * Attempt to determine the media type from an OSCAL Resource Link.
 *
 * This first checks the `media-type`; however, if that is unspecified, an
 * attempt is made to determine the media type based on the extension of
 * the given file.
 *
 * This will build a cache of extensions to file names on the first invocation
 * so that subsequent calls will be faster.
 *
 * @private
 */
function determineMediaType(link: ResourceLink): string | undefined {
  if (link["media-type"]) {
    return link["media-type"];
  }
  if (!Object.keys(mediaTypeCache).length) {
    buildCache();
  }
  const extension = extname(link.href);
  if (!extension) {
    return undefined;
  }
  const mediaType = mediaTypeCache[extension]?.[0];
  if (!mediaType) {
    return undefined;
  }
  return mediaType;
}

/**
 * Get a friendly display of the media type for a given resource link.
 *
 * Media Types are not inherently human-readable and may not provide sufficient
 * context to understand the document's type. This attempts to convert to a common
 * set of descriptions for the media type. If a media type can be determined at all,
 * a general descriptions of the "class" of file will be returned; however, if there
 * is not a media type that can be determined, a generic fallback ({@see UNRECOGNIZED})
 * will be returned.
 *
 * @param link the back matter resource's rlink field
 */
export function getFriendlyDisplayOfMediaType(link: ResourceLink): string {
  // Get the media type based on the rlink; this is either the field from
  // the object or a guess based on the file extension in the `href` field.
  const mediaTypeRaw = determineMediaType(link);
  if (!mediaTypeRaw) {
    return UNRECOGNIZED;
  }

  // Attempt to convert the media type into its constituent parts. If the
  // media type is invalid, then abort.
  const mediaType = MediaType.fromString(mediaTypeRaw);
  if (!mediaType) {
    return UNRECOGNIZED;
  }

  // Check if the given media type has any valid functions to apply to
  // provide a friendly representation; if they do not then the generic
  // fallback will be used.
  const matchers = map[mediaType.type];
  if (!matchers?.length) {
    return UNRECOGNIZED;
  }

  // This applies each of the "matchers" for the top-level media type
  // until any of them return a value. This allows for checking against
  // all the fields of the media type but looking them up based on the
  // primary type means we can avoid conficts (such as when something appears
  // in audio/ and video/ or text/ and application/) and allows for specifying
  // the priority within each type.
  for (const matcher of matchers) {
    const result = matcher(mediaType);
    if (result) {
      return result;
    }
  }
  return UNRECOGNIZED;
}
