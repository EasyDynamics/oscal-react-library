import getUriFromBackMatterByHref from "./OSCALBackMatterUtils";

export function getAbsoluteUrl(href, parentUrl) {
  if (href.startsWith("https://") || href.startsWith("http://") || !parentUrl) {
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
