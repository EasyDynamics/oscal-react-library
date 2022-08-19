import getUriFromBackMatterByHref from "./OSCALBackMatterUtils";

export function fixJsonUrls(absoluteUrl) {
  // TODO: This workaround references JSON representation instead of the back-matter links to
  // XML catalogs and it should be removed once the issue has been resolved.
  // https://github.com/EasyDynamics/oscal-react-library/issues/158
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

export function getURLMediaType(url) {
  const fileExtension = new URL(url).pathname.split(".").pop();
  return fileExtension.length <= 4 ? fileExtension.toUpperCase() : "Unknown";
}
