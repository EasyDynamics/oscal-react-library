export function getAbsoluteUrl(rlink, parentUrl, fixJsonUrls) {
  let absoluteUrl = rlink.href;

  // TODO - this should be improved for other use cases
  if (!absoluteUrl.startsWith("http")) {
    absoluteUrl = `${parentUrl}/../${absoluteUrl}`;
  }
  // TODO this is incorrect in the profile (https://github.com/usnistgov/oscal-content/issues/59, https://easydynamics.atlassian.net/browse/EGRC-266)
  // TODO this workaround must be improved in https://easydynamics.atlassian.net/browse/EGRC-296
  // We don't want to alter resources being displayed by the OSCALBackMatter component so check fixJsonUrls
  if (fixJsonUrls && absoluteUrl.endsWith(".xml")) {
    // Replacing all instances of xml with json in the path *should* get us the correct json URL
    absoluteUrl = absoluteUrl.replaceAll("xml", "json");
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
  let foundResource = null;
  backMatter.resources.some((resource) => {
    if (resource.uuid === importUuid) {
      foundResource = resource;
      return true;
    }
    return false;
  });
  if (!foundResource) {
    throw new Error("resource not found for href");
  }
  return getAbsoluteUrl(foundResource.rlinks[0], parentUrl, true);
}
