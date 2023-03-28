import getUriFromBackMatterByHref from "./OSCALBackMatterUtils";

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
  mediaTypeRegex
) {
  return getAbsoluteUrl(
    !href.startsWith("#")
      ? href
      : getUriFromBackMatterByHref(backMatter, href, mediaTypeRegex).href,
    parentUrl
  );
}

/**
 * A helper function for guessExtensionFromHref
 *
 * @param {string} url A given href
 * @returns {string} A valid or blank extension type
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
 * "Unkown" when an invalid
 *
 * @param {string} url A given href
 * @returns {string} A valid or "Unknown" extension type
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

/**
 * Finds if a fragment contains a control group by searching the control tabs
 *
 * @param {string} fragment A given fragment
 * @returns {string} The control group id
 */
export function determineControlGroupFromFragment(fragment) {
  if (fragment === null || fragment === "" || fragment === undefined) {
    return null;
  }
  // Create array from all tab control grouping elements
  const controlGroupList = Array.from(
    document.querySelectorAll('[id^="vertical-tab-"]')
  );
  // Grab group id if found
  return controlGroupList
    ?.find((group) => fragment.includes(group.id.split("vertical-tab-").pop()))
    ?.id?.split("vertical-tab-")
    ?.pop();
}
