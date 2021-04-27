
/**
 * Profiles are brought in through different methods in OSCAL models.
 * 
 * SSP
 * - Brings in a single profile through system-security-plan.import-profile.href
 * -- https://github.com/usnistgov/oscal-content/blob/master/examples/ssp/json/ssp-example.json#L43
 * 
 * Component Definition
 * - Brings in multiple profiles or catalogs per component and control implementation through 
 * component-definition.component[BY-KEY].control-implementations[BY-ARRAY].source
 * -- https://github.com/usnistgov/oscal-content/blob/master/examples/component-definition/json/example-component.json#L32
 * 
 * Profile
 * - Brings in other profiles or catalogs through profile.imports[BY-ARRAY].href
 * -- https://github.com/usnistgov/oscal-content/blob/master/nist.gov/SP800-53/rev4/json/NIST_SP-800-53_rev4_MODERATE-baseline_profile.json#L57
 * which can also be a reference to a back matter resource, i.e. profile.back-matter.resources[BY-ARRAY].rlinks[BY-ARRAY].href
 * -- https://github.com/usnistgov/oscal-content/blob/master/nist.gov/SP800-53/rev4/json/NIST_SP-800-53_rev4_MODERATE-baseline_profile.json#L2567 
 */

/**
 * Gets an rlink URI from the given back matter's resource by the given HREF UUID.
 * 
 * TODO - This should probably be a global function not specific to profiles
 *
 * @see {@link https://pages.nist.gov/OSCAL/documentation/schema/implementation-layer/component/xml-schema/##local_back-matter-resource-rlink_def-h3}
 */
 function getUriFromBackMatterByHref(
  backMatter,
  href
) {
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
  // TODO - determine how to deal with multiple rlinks
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
 * Loads a URL which may represent a catalog or profile and adds the controls to the given resolvedControls
 *
 * @see {@link https://pages.nist.gov/OSCAL/documentation/schema/profile-layer/profile/xml-schema/#global_import}
 * @see {@link https://pages.nist.gov/OSCAL/documentation/schema/profile-layer/profile/xml-schema/#global_back-matter_h2}
 */
export default function OSCALResolveProfileOrCatalogUrlControls(
  resolvedControls,
  origItemUrl,
  parentUrl,
  backMatter,
  onSuccess,
  onError
) {
  let itemUrl = origItemUrl;
  // TODO - this should be improved for other use cases
  if (!origItemUrl.startsWith("http")) {
    itemUrl = `${parentUrl}/../${origItemUrl}`;
  }
  fetch(itemUrl)
    .then((res) => res.json())
    .then(
      (result) => {
        if (result.catalog) {
          // Dig through catalog controls and add to profile.controls
          /* eslint-enable */
          result.catalog.groups.forEach((group) => {
            resolvedControls.push(...group.controls);
          });
          if (result.catalog.controls) {
            resolvedControls.push(...result.catalog.controls);
          }
          if (onSuccess) {
            onSuccess();
          }
        } else if (result.profile) {
          result.profile.imports.forEach((profileImport) => {
            const profileImportUrl  = getUriFromBackMatterByHref(backMatter, profileImport.href);
            OSCALResolveProfileOrCatalogUrlControls(resolvedControls, profileImportUrl, itemUrl, result.profile["back-matter"], null, onError);
          });
        }
      },
      (error) => onError()
    );
}
