export function fixJsonUrls(absoluteUrl) {
  // TODO this is incorrect in the profile (https://github.com/usnistgov/oscal-content/issues/59, https://easydynamics.atlassian.net/browse/EGRC-266)
  // TODO this workaround must be improved in https://easydynamics.atlassian.net/browse/EGRC-296
  if (!absoluteUrl.endsWith(".xml")) {
    return absoluteUrl;
  }
  // Replacing all instances of xml with json in the path *should* get us the correct json URL
  return absoluteUrl.replace(/xml/g, "json");
}

export function getAbsoluteUrl(rlink, parentUrl) {
  let absoluteUrl = rlink.href;

  // TODO - this should be improved for other use cases
  if (!absoluteUrl.startsWith("http")) {
    absoluteUrl = `${parentUrl}/../${absoluteUrl}`;
  }

  return absoluteUrl;
}

/**
 * Gets an rlink URI from the given back matter's resource by the given HREF UUID.
 *
 * @see {@link https://pages.nist.gov/OSCAL/documentation/schema/implementation-layer/component/xml-schema/##local_back-matter-resource-rlink_def-h3}
 */

export default function getUriFromBackMatterByHref(
  backMatter,
  href,
  parentUrl
) {
  if (!href.startsWith("#")) {
    throw new Error("not an internal href");
  }
  // Dig into back-matter to look for absolute href
  const importUuid = href.substring(1);

  const foundLink = backMatter.resources
    .find((resource) => resource.uuid === importUuid)
    ?.rlinks.find(
      (rlink) => rlink["media-type"] === "application/oscal.catalog+json"
    );

  if (!foundLink) {
    throw new Error("resource not found for href");
  }

  return fixJsonUrls(getAbsoluteUrl(foundLink, parentUrl));
}
