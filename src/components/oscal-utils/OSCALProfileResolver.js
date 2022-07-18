import resolveLinkHref, { fixJsonUrls } from "./OSCALLinkUtils";

const OSCAL_MEDIA_TYPE_REGEX = /^application\/oscal.*\+json$/;
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
  modifications,
  origItemUrl,
  parentUrl,
  backMatter,
  inheritedProfilesAndCatalogs,
  onSuccess,
  onError,
  pendingProcesses // tracks state of recursive calls
) {
  let itemUrl = origItemUrl;

  // TODO: This should be improved for other use cases. https://github.com/EasyDynamics/oscal-react-library/issues/505

  if (!origItemUrl.startsWith("http")) {
    itemUrl = `${parentUrl}/../${origItemUrl}`;
  }

  // TODO: This is only necessary because of a source issue with OSCAL Content.
  // Once the issue has been resolved, this can be removed.
  // https://github.com/EasyDynamics/oscal-react-library/issues/502
  if (itemUrl.includes("/content/nist.gov/")) {
    itemUrl = itemUrl.replace("/content/nist.gov/", "/nist.gov/");
  }
  if (itemUrl.includes("/content/fedramp.gov/")) {
    itemUrl = itemUrl.replace("/content/fedramp.gov/", "/fedramp.gov/");
  }
  itemUrl = fixJsonUrls(itemUrl);
  // Add our current itemUrl to the list of pending processes
  pendingProcesses.push(itemUrl);
  fetch(itemUrl)
    .then((res) => res.json())
    .then(
      (result) => {
        const inheritedOSCALObject = {};
        if (result.catalog) {
          inheritedOSCALObject.title = result.catalog.metadata.title;
          inheritedOSCALObject.uuid = result.catalog.uuid;
          inheritedOSCALObject.type = "catalog";
          // Dig through catalog controls and add to profile.controls
          result.catalog.groups?.forEach((group) => {
            resolvedControls.push(...group.controls);
          });
          if (result.catalog.controls) {
            resolvedControls.push(...result.catalog.controls);
          }
        } else if (result.profile) {
          // Iterate over each import and recursively call this method to get either another profile or catalog
          inheritedOSCALObject.title = result.profile.metadata.title;
          inheritedOSCALObject.uuid = result.profile.uuid;
          inheritedOSCALObject.type = "profile";
          inheritedOSCALObject.inherited = [];

          modifications["set-parameters"].push(
            ...(result.profile.modify?.["set-parameters"] ?? [])
          );
          modifications.alters.push(...(result.profile.modify?.alters ?? []));

          result.profile.imports.forEach((profileImport) => {
            const importUrl = resolveLinkHref(
              result.profile?.["back-matter"] ?? [],
              profileImport.href,
              null,
              OSCAL_MEDIA_TYPE_REGEX
            );
            OSCALResolveProfileOrCatalogUrlControls(
              resolvedControls,
              modifications,
              importUrl,
              itemUrl,
              result.profilea?.["back-matter"] ?? [],
              inheritedOSCALObject.inherited,
              onSuccess,
              onError,
              pendingProcesses
            );
          });
        }
        inheritedProfilesAndCatalogs.push(inheritedOSCALObject);

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
  const inheritedProfilesAndCatalogs = {
    inherited: [],
  };
  // profile does not have a resolvedControls field.
  // profile.resolvedControls needs to be declared & initialized here.
  /* eslint no-param-reassign: "error" */
  profile.resolvedControls = [];
  profile.modifications = {
    "set-parameters": [],
    alters: [],
  };

  profile.imports.forEach((imp) => {
    OSCALResolveProfileOrCatalogUrlControls(
      profile.resolvedControls,
      profile.modifications,
      resolveLinkHref(
        profile?.["back-matter"] ?? [],
        imp.href,
        parentUrl,
        OSCAL_MEDIA_TYPE_REGEX
      ),
      parentUrl,
      profile?.["back-matter"] ?? [],
      inheritedProfilesAndCatalogs.inherited,
      () => {
        onSuccess(inheritedProfilesAndCatalogs);
      },
      onError,
      []
    );
  });
}
