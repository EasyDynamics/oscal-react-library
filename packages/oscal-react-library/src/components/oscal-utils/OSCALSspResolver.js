import OSCALResolveProfileOrCatalogUrlControls from "./OSCALProfileResolver";
/**
 * Loads an SSP's 'import-profile' and adds the resulting controls to the SSP
 *
 * @see {@link https://pages.nist.gov/OSCAL/documentation/schema/implementation-layer/ssp/xml-schema/#global_import-profile}
 */
export default function OSCALSspResolveProfile(ssp, parentUrl, onSuccess, onError) {
  if (!ssp["import-profile"]) {
    return;
  }
  const profileUrl = ssp["import-profile"].href;

  const inheritedProfilesAndCatalogs = {
    inherited: [],
  };

  // Fixing linting error here would take significant change to codebase given how we use props.
  /* eslint no-param-reassign: "error" */
  ssp.resolvedControls = [];
  ssp.modifications = {
    "set-parameters": [],
    alters: [],
  };

  OSCALResolveProfileOrCatalogUrlControls(
    ssp.resolvedControls,
    ssp.modifications,
    profileUrl,
    parentUrl,
    ssp["back-matter"],
    inheritedProfilesAndCatalogs.inherited,
    () => {
      onSuccess(inheritedProfilesAndCatalogs);
    },
    onError,
    []
  );
}
