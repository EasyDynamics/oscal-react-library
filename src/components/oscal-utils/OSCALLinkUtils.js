import getUriFromBackMatterByHref from "./OSCALBackMatterUtils";

export function fixJsonUrls(absoluteUrl) {
  if (!absoluteUrl.endsWith(".xml")) {
    return absoluteUrl;
  }
  // Replacing all instances of xml with json in the path *should* get us the correct json URL
  return absoluteUrl.replace(/xml/g, "json");
}

export function getAbsoluteUrl(href, parentUrl) {
  return href.startsWith("http") ? href : `${parentUrl}/../${href}`;
}

export default function resolveLinkHref(
  backMatter,
  href,
  parentUrl,
  mediaTypeRegex
) {
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
