/**
 * Loads a profile 'import' such as a catalog from a back-matter entry and adds the resulting controls to the SSP
 *
 * @see {@link https://pages.nist.gov/OSCAL/documentation/schema/profile-layer/profile/xml-schema/#global_import}
 * @see {@link https://pages.nist.gov/OSCAL/documentation/schema/profile-layer/profile/xml-schema/#global_back-matter_h2}
 */
function ResolveProfileImport(
  resolvedControls,
  profileImport,
  backMatter,
  profileUrl,
  onSuccess,
  onError
) {
  if (profileImport.href.startsWith("#")) {
    // Dig into back-matter to look for absolute href
    const profileImportUuid = profileImport.href.substring(1);
    let foundResource = null;
    backMatter.resources.some((resource) => {
      if (resource.uuid === profileImportUuid) {
        foundResource = resource;
        return true;
      }
      return false;
    });
    if (foundResource) {
      // TODO - determine how to deal with multiple rlinks
      let profileImportUrl = foundResource.rlinks[0].href;
      // TODO - this should be improved for other use cases
      if (!profileImportUrl.startsWith("http")) {
        profileImportUrl = `${profileUrl}/../${profileImportUrl}`;
      }
      // TODO this is incorrect in the profile (https://github.com/usnistgov/oscal-content/issues/59, https://easydynamics.atlassian.net/browse/EGRC-266)
      if (
        foundResource.rlinks[0]["media-type"].endsWith("json") &&
        profileImportUrl.endsWith(".xml")
      ) {
        profileImportUrl = profileImportUrl.replace(".xml", ".json");
      }
      fetch(profileImportUrl)
        .then((res) => res.json())
        .then(
          (result) => {
            // TODO deal with profiles that import other profiles

            if (result.catalog) {
              /* eslint-disable */
              profileImport.catalog = result.catalog;
              // Dig through catalog controls and add to profile.controls
              resolvedControls.controls = [];
              /* eslint-enable */
              result.catalog.groups.forEach((group) => {
                resolvedControls.controls.push(...group.controls);
              });
              if (result.catalog.controls) {
                resolvedControls.controls.push(...result.catalog.controls);
              }
              onSuccess();
            }
          },
          (error) => onError()
        );
    }
  }
}

/**
 * Loads an SSP's 'import-profile' and adds the resulting controls to the SSP
 *
 * @see {@link https://pages.nist.gov/OSCAL/documentation/schema/implementation-layer/ssp/xml-schema/#global_import-profile}
 */
export default function OSCALResolveProfile(
  origProfileUrl,
  parentUrl,
  onSuccess,
  onError
) {
  // TODO - this is incorrect in the ssp-example.json data (https://github.com/usnistgov/oscal-content/issues/60, https://easydynamics.atlassian.net/browse/EGRC-266)
  // TODO - this should be improved for other use cases
  let profileUrl = origProfileUrl;
  let profile;
  if (!profileUrl.startsWith("http")) {
    profileUrl = `${parentUrl}/../../${profileUrl}`;
  }
  fetch(profileUrl)
    .then((res) => res.json())
    .then(
      (result) => {
        profile = result.profile;
        profile.resolvedControls = [];
        profile.imports.forEach((profileImport) => {
          ResolveProfileImport(
            profile.resolvedControls,
            profileImport,
            profile["back-matter"],
            profileUrl,
            onSuccess,
            onError
          );
        });
        return profile;
      },
      (error) => onError()
    );
}
