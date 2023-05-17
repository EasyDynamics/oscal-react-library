import type { BackMatter } from "@easydynamics/oscal-types";
import { BackMatterLookup } from "./OSCALBackMatterUtils";

export function getAbsoluteUrl(
  href: string | undefined,
  parentUrl: string | undefined
): string | undefined {
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

export interface UriReferenceLookup {
  /**
   * A BackMatter object to resolve relative links against.
   */
  backMatter?: BackMatter;
  /**
   * Url of parent for relative links.
   */
  parentUrl?: string;
}

interface ResolveLinkHrefProps {
  backMatter: BackMatter;
  href: string;
  mediaType: RegExp;
  preferBase64?: boolean;
  parentUrl?: string;
}

export default function resolveLinkHref(props: ResolveLinkHrefProps) {
  const lookup = new BackMatterLookup(props.backMatter, props.preferBase64);
  return getAbsoluteUrl(lookup?.resolve(props.href, props.mediaType)?.uri, props.parentUrl);
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
export function appendToFragmentPrefix(
  fragmentPrefix: string | undefined,
  controlId: string
): string {
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
