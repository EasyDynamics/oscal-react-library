/**
 * Fixes source url if it does not properly link to a profile.
 *
 * @param {string} sourceURL url to fetch profile from
 * @param {string} parentUrl parent url to fix sourceUrl
 * @returns the correct source url
 */
export function fixProfileUrl(sourceUrl, parentUrl) {
  if (!sourceUrl?.startsWith("http")) {
    return `${parentUrl}/../${sourceUrl}`;
  }
  return sourceUrl;
}

/**
 * Fetches & sets the modifications from a profile at a given sourceURL.
 *
 * @param {string} sourceURL url to fetch profile from
 * @param {string} parentUrl parent url to fix sourceUrl
 * @param {function} setModifications set method for modifications
 */
export default async function fetchProfileModifications(
  sourceUrl,
  parentUrl,
  setModifications
) {
  const profileUrl = fixProfileUrl(sourceUrl, parentUrl);

  fetch(profileUrl)
    .then((res) => res.json())
    .then(
      (result) => setModifications(result.profile.modify),
      () => null
    );
}
