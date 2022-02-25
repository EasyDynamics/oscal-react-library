import getUriFromBackMatterByHref from "./OSCALBackMatterUtils";

export function fixJsonUrls(absoluteUrl) {
  // TODO this is incorrect in the profile (https://github.com/usnistgov/oscal-content/issues/59, https://easydynamics.atlassian.net/browse/EGRC-266)
  // TODO this workaround must be improved in https://easydynamics.atlassian.net/browse/EGRC-296
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
