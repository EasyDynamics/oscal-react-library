import OSCALResolveProfileOrCatalogUrlControls from "./OSCALProfileResolver";
/**
 * Loads an SSP's 'import-profile' and adds the resulting controls to the SSP
 *
 * @see {@link https://pages.nist.gov/OSCAL/documentation/schema/implementation-layer/ssp/xml-schema/#global_import-profile}
 */
export default function OSCALProfileDefintionResolver(
  profile,
  parentUrl,
  onSuccess,
  onError
) {
  // if it has no imports, return nothing
  // eslint-disable-next-line
  if (!profile["imports"]) {
    return;
  }

  // pull out catalog

  // TODO - pull the rev4 catalog out, currently it will not be displayed properly unless it is the rev5 catalog
  const catalogUrl =
    "https://raw.githubusercontent.com/usnistgov/oscal-content/master/nist.gov/SP800-53/rev5/json/NIST_SP-800-53_rev5_catalog.json";
  // let catalogUrl = "https://raw.githubusercontent.com/usnistgov/oscal-content/master/nist.gov/SP800-53/rev4/json/NIST_SP-800-53_rev4_catalog.json";
  // eslint-disable-next-line
  profile.resolvedControls = [];
  OSCALResolveProfileOrCatalogUrlControls(
    profile.resolvedControls,
    catalogUrl,
    parentUrl,
    profile["back-matter"],
    onSuccess,
    onError,
    []
  );
}
