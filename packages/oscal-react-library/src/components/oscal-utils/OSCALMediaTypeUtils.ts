import { ResourceLink } from "@easydynamics/oscal-types";
import { lookup as mimeTypeLookup } from "mime-types";

const mediaTypeLookup = {
  application: {},
  audio: {},
  text: {},
  font: {},
  message: {},
  model: {},
  video: {},
};

enum Type {
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

function isValidType(str: string): str is Type {
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

enum Suffix {
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

function isRegisteredSuffix(str: string): str is Type {
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

enum Tree {
  STANDARDS,
  VENDOR,
  PERSONAL,
  UNREGISTERED,
}

interface IMediaType {
  readonly type: Type;
  readonly subtype: string;
  readonly suffix?: Suffix | string;
}

class MediaType implements IMediaType {
  static fromString(s: string): MediaType | undefined {
    const [type, rest] = s.split("/");
    if (!isValidType(type)) {
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

export function getFallbackMediaTypeFromExtension(link: ResourceLink): string | false {
  return mimeTypeLookup(link.href);
}
