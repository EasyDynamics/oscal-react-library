import BackMatterLookup from "./OSCALBackMatterUtils";

export function getAbsoluteUrl(href, parentUrl) {
  if (
    href.startsWith("https://") ||
    href.startsWith("http://") ||
    !parentUrl ||
    parentUrl.startsWith(".")
  ) {
    return href;
  }
  return new URL(href, parentUrl).toString();
}

export default function resolveLinkHref(
  backMatter,
  href,
  parentUrl,
  mediaType,
  preferBase64 = false
) {
  const lookup = new BackMatterLookup(backMatter, preferBase64);
  return getAbsoluteUrl(lookup.resolve(href, mediaType).uri, parentUrl);
}

/**
 * A helper function for guessExtensionFromHref
 *
 * @param url A given href.
 * @returns A string providing a valid or blank extension type.
 */
function getFileExtension(url) {
  try {
    return new URL(url).pathname.split("/").pop().split(".").pop();
  } catch {
    return "";
  }
}

/**
 * Guesses an extension type based on a provided href, and provides
 * "Unkown" when an invalid.
 *
 * @param url A given href.
 * @returns A string providing a valid or "Unknown" extension type.
 */
export function guessExtensionFromHref(url) {
  const fallbackFileExtension = "Unknown";
  // TODO: Use an HTTP HEAD request to attempt to get a `Content-Type` header for the underlying
  // document. (https://github.com/EasyDynamics/oscal-react-library/issues/580)
  const detectedExtension = getFileExtension(url).toUpperCase();
  const extensionLength = detectedExtension.length;
  // This is purely a guess based on typical file types. When the length is less
  // than 2 or more than 4, it's likely not the file extension we've aquired,
  // but an unexpected part of the filename.
  if (extensionLength > 4 || extensionLength < 2) {
    return fallbackFileExtension;
  }
  return detectedExtension;
}
