import type { BackMatter } from "@easydynamics/oscal-types";
import { BackMatterLookup } from "./OSCALBackMatterUtils";

export function getAbsoluteUrl(href: string | undefined, parentUrl: string): string | undefined {
  if (
    href?.startsWith("https://") ||
    href?.startsWith("http://") ||
    !parentUrl ||
    parentUrl.startsWith(".")
  ) {
    return href;
  }
  return new URL(href ?? "", parentUrl).toString();
}

export default function resolveLinkHref(
  backMatter: BackMatter,
  href: string,
  parentUrl: string,
  mediaType: RegExp,
  preferBase64 = false
) {
  const lookup = new BackMatterLookup(backMatter, preferBase64);
  return getAbsoluteUrl(lookup?.resolve(href, mediaType)?.uri, parentUrl);
}

/**
 * A helper function for guessExtensionFromHref
 *
 * @param url A given href
 * @returns A valid or blank extension type
 */
function getFileExtension(url: string): string {
  try {
    // This will throw a TypeError if `url` is not a valid URL.
    const validUrl = new URL(url);
    return validUrl?.pathname.split("/").pop()?.split(".").pop() ?? "";
  } catch (err) {
    return "";
  }
}

/**
 * Guesses an extension type based on a provided href, and provides
 * "Unknown" when an invalid
 *
 * @param url A given href
 * @returns A valid or "Unknown" extension type
 */
export function guessExtensionFromHref(url: string): "Unknown" | string {
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
 * @param fragment A given fragment
 * @returns The control group id
 */
export function determineControlGroupFromFragment(
  fragment: string | undefined
): string | undefined {
  if (!fragment) {
    return undefined;
  }
  // Create array from all tab control grouping elements
  const controlGroupList = Array.from(document.querySelectorAll('[id^="vertical-tab-"]'));
  // Grab group id if found
  return controlGroupList
    ?.find((group) => fragment.split("/")?.[0] === group.id.split("vertical-tab-").pop())
    ?.id?.split("vertical-tab-")
    ?.pop();
}

/**
 * Add (push) a control/sub-control to fragmentPrefix.
 *
 * @param fragmentPrefix The beginning of a fragment
 * @param controlId The identification for a control
 * @returns fragmentPrefix with an added control
 */
export function appendToFragmentPrefix(fragmentPrefix: string, controlId: string): string {
  return fragmentPrefix ? `${fragmentPrefix}/${controlId}` : controlId;
}

/**
 * Remove (shift) a grouping from a fragmentSuffix.
 *
 * @param fragmentSuffix The end of a fragment
 * @returns fragmentSuffix with a removed control
 */
export function shiftFragmentSuffix(fragmentSuffix: string | undefined): string | undefined {
  return fragmentSuffix
    ? `${fragmentSuffix.substring(fragmentSuffix.indexOf("/") + 1)}`
    : undefined;
}

/**
 * Transforms text inner-text of an element to prepare as a fragment, by replacing slashes and
 * spaces with hyphens and lowercasing all letters.
 *
 * @param {any} linkElement Text or element to format
 * @returns {string} Formatted text to work as a fragment
 */
export function conformLinkIdText(linkElement: any): string {
  return !linkElement
    ? null
    : linkElement?.props?.children?.replace(/\\| |\//g, "-")?.toLowerCase() ||
        linkElement?.replace(/\\| |\//g, "-")?.toLowerCase();
}
