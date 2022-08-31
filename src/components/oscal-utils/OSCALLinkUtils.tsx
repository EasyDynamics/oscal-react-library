import getUriFromBackMatterByHref from "./OSCALBackMatterUtils";

export function fixJsonUrls(absoluteUrl: string): string {
  // TODO: This workaround references JSON representation instead of the back-matter links to
  // XML catalogs and it should be removed once the issue has been resolved.
  // https://github.com/EasyDynamics/oscal-react-library/issues/158
  if (!absoluteUrl.endsWith(".xml")) {
    return absoluteUrl;
  }
  // Replacing all instances of xml with json in the path *should* get us the correct json URL
  return absoluteUrl.replace(/xml/g, "json");
}

export function getAbsoluteUrl(href: string, parentUrl: string): string {
  return href.startsWith("http") ? href : `${parentUrl}/../${href}`;
}

export default function resolveLinkHref(
  backMatter: any,
  href: string,
  parentUrl: string,
  mediaTypeRegex: RegExp
): string {
  if (!href.startsWith("#")) {
    return getAbsoluteUrl(href, parentUrl);
  }

  return fixJsonUrls(
    getAbsoluteUrl(
      getUriFromBackMatterByHref(backMatter, href, mediaTypeRegex).href,
      parentUrl
    )
  );
}

/**
 * A helper function for guessExtensionFromHref
 *
 * @param url A given href.
 * @returns A string providing a valid or blank extension type.
 */
function getFileExtension(url: string): string {
  try {
    return new URL(url).pathname.split("/").pop()?.split(".").pop() ?? "";
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
export function guessExtensionFromHref(url: string) {
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
