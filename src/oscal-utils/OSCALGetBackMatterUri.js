function getAbsoluteUrl(foundResource) {
  let profileImportUrl = foundResource.rlinks[0].href;
  // TODO this is incorrect in the profile (https://github.com/usnistgov/oscal-content/issues/59, https://easydynamics.atlassian.net/browse/EGRC-266)
  if (
    foundResource.rlinks[0]["media-type"].endsWith("json") &&
    profileImportUrl.endsWith(".xml")
  ) {
    profileImportUrl = profileImportUrl.replace(".xml", ".json");
  }
  return profileImportUrl;
}

/**
 * Gets an rlink URI from the given back matter's resource by the given HREF UUID.
 *
 * TODO - This should probably be a global function not specific to profiles
 *
 * @see {@link https://pages.nist.gov/OSCAL/documentation/schema/implementation-layer/component/xml-schema/##local_back-matter-resource-rlink_def-h3}
 */

export default function getUriFromBackMatterByHref(backMatter, href) {
  if (!href.startsWith("#")) {
    throw new Error("not an internal href");
  }
  // Dig into back-matter to look for absolute href
  const profileImportUuid = href.substring(1);
  let foundResource = null;
  backMatter.resources.some((resource) => {
    if (resource.uuid === profileImportUuid) {
      foundResource = resource;
      return true;
    }
    return false;
  });
  if (!foundResource) {
    throw new Error("resource not found for href");
  }
  return getAbsoluteUrl(foundResource);
}
