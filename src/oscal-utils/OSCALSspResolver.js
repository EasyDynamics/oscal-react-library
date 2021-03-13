
/**
 * Loads a profile 'import' such as a catalog from a back-matter entry and adds the resulting controls to the SSP
 * 
 * @see {@link https://pages.nist.gov/OSCAL/documentation/schema/profile-layer/profile/xml-schema/#global_import}
 * @see {@link https://pages.nist.gov/OSCAL/documentation/schema/profile-layer/profile/xml-schema/#global_back-matter_h2}
 */
function ResolveProfileImport(ssp, profileImport, backMatter, profileUrl, onSuccess, onError) {
	if (profileImport.href.startsWith('#')) {
		// Dig into back-matter to look for absolute href
		let profileImportUuid = profileImport.href.substring(1);
		let foundResource = null;
		backMatter.resources.some(resource => {
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
			if (!profileImportUrl.startsWith('http')) {
				profileImportUrl = profileUrl + '/../' + profileImportUrl;
			}
			// Fix issue with OSCAL profile data
			if (foundResource.rlinks[0].['media-type'].endsWith('json') && profileImportUrl.endsWith('.xml')) {
				profileImportUrl = profileImportUrl.replace('.xml', '.json');
			}
			fetch(profileImportUrl)
			.then(res => res.json())
			.then(
			(result) => {
				// TODO deal with profiles that import other profiles
				if (result.catalog) {
					profileImport.catalog = result.catalog;
					// Dig through catalog controls and add to profile.controls
					ssp.controls = [];
					result.catalog.groups.forEach(group => {
						ssp.controls.push(...group.controls);
					});
					if (result.catalog.controls) {
						ssp.controls.push(...result.catalog.controls);
					}
					onSuccess();
				}
			},
			(error) => onError()
			)
		}
	}
}

/**
 * Loads an SSP's 'import-profile' and adds the resulting controls to the SSP
 * 
 * @see {@link https://pages.nist.gov/OSCAL/documentation/schema/implementation-layer/ssp/xml-schema/#global_import-profile}
 */
export default function OSCALSspResolveProfile(ssp, parentUrl, onSuccess, onError) {
	let profileUrl = ssp.['import-profile'].href;
	// TODO - this is incorrect in the ssp-example.json data and also should be improved for other use cases
	if (!profileUrl.startsWith('http')) {
		profileUrl = parentUrl + '/../../' + profileUrl;
	}
	fetch(profileUrl)
	.then(res => res.json())
	.then(
	  (result) => {
		ssp.profile = result.profile;
		ssp.profile.imports.forEach(profileImport => {
			ResolveProfileImport(ssp, profileImport, ssp.profile.['back-matter'], profileUrl, onSuccess, onError);
		});
	  },
	  (error) => onError()
	)
}