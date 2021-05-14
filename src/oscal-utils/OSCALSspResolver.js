import OSCALResolveProfileOrCatalogUrlControls from "./OSCALProfileResolver";
/**
 * Loads an SSP's 'import-profile' and adds the resulting controls to the SSP
 *
 * @see {@link https://pages.nist.gov/OSCAL/documentation/schema/implementation-layer/ssp/xml-schema/#global_import-profile}
 */
export default function OSCALSspResolveProfile(
  ssp,
  parentUrl,
  onSuccess,
  onError
) {
  if (!ssp["import-profile"]) {
    return;
  }
  let profileUrl = ssp["import-profile"].href;
  // TODO - this is incorrect in the ssp-example.json data (https://github.com/usnistgov/oscal-content/issues/60, https://easydynamics.atlassian.net/browse/EGRC-266)
  // TODO - this should be improved for other use cases
  if (!profileUrl.startsWith("http")) {
    profileUrl = `${parentUrl}/../${profileUrl}`;
  }
  //console.log('parent url in ssp resolver', parentUrl);
  //console.log('the ssp resolver profileurl',profileUrl);
  ssp.resolvedControls = [];
  OSCALResolveProfileOrCatalogUrlControls(
    ssp.resolvedControls,
    profileUrl,
    parentUrl,
    ssp.["back-matter"],
    onSuccess,
    onError,
    []
  );
}