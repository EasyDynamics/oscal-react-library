import getUriFromBackMatterByHref from "./OSCALBackMatterUtils";

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
 * Loads a URL which may represent a catalog or profile and adds the controls to the given resolvedControls.
 *
 * Note that profiles can contain other profiles which must also be resolved until a catalog is reached.
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
  onError,
  pendingProcesses // tracks state of recursive calls
) {
  let itemUrl = origItemUrl;
  // TODO - this should be improved for other use cases
  if (!origItemUrl.startsWith("http")) {
    itemUrl = `${parentUrl}/../${origItemUrl}`;
  }
  // TODO - remove this when OSCAL Content has fixed their issue with source
  if (itemUrl.includes("/content/nist.gov/")) {
    itemUrl = itemUrl.replace("/content/nist.gov/", "/nist.gov/");
  }
  if (itemUrl.includes("/content/fedramp.gov/")) {
    itemUrl = itemUrl.replace("/content/fedramp.gov/", "/fedramp.gov/");
  }
  // Add our current itemUrl to the list of pending processes
  pendingProcesses.push(itemUrl);
  fetch(itemUrl)
    .then((res) => res.json())
    .then(
      (result) => {
        if (result.catalog) {
          // Dig through catalog controls and add to profile.controls
          result.catalog.groups.forEach((group) => {
            resolvedControls.push(...group.controls);
          });
          if (result.catalog.controls) {
            resolvedControls.push(...result.catalog.controls);
          }
        } else if (result.profile) {
          // Iterate over each import and recursively call this method to get either another profile or catalog
          result.profile.imports.forEach((profileImport) => {
            const importUrl = getUriFromBackMatterByHref(
              result.profile["back-matter"],
              profileImport.href
            );
            OSCALResolveProfileOrCatalogUrlControls(
              resolvedControls,
              importUrl,
              itemUrl,
              result.profile["back-matter"],
              onSuccess,
              onError,
              pendingProcesses
            );
          });
        }
        // We're done processing this itemUrl, remove it from pendingProcesses
        const processIndex = pendingProcesses.indexOf(itemUrl);
        if (processIndex > -1) {
          pendingProcesses.splice(processIndex, 1);
        }
        // Check if this execution was the last of our pending processes, and if so, execute the original success callback
        if (onSuccess && pendingProcesses.length === 0) {
          onSuccess();
        }
      },
      (error) => onError(error)
    );
}

export function OSCALResolveProfile(profile, parentUrl, onSuccess, onError) {
  if (!profile.imports) {
    return;
  }

  // profile does not have a resolvedControls field.
  // profile.resolvedControls needs to be declared & initialized here.
  /* eslint no-param-reassign: "error" */
  profile.resolvedControls = [];

  profile.imports
    .map((imp) =>
      getUriFromBackMatterByHref(profile["back-matter"], imp.href, parentUrl)
    )
    .forEach((importUrl) => {
      OSCALResolveProfileOrCatalogUrlControls(
        profile.resolvedControls,
        importUrl,
        parentUrl,
        profile["back-matter"],
        onSuccess,
        onError,
        []
      );
    });
}
