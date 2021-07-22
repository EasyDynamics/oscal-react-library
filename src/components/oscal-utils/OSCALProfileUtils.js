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
 * Gets the modifications from a profile at a given sourceURL.
 *
 * @param {string} sourceURL url to fetch profile from
 * @param {string} parentUrl parent url to fix sourceUrl
 * @param {function} setModifications set method for modifications
 */
export default function getProfileModifications(
  sourceUrl,
  parentUrl,
  setModifications
) {
  const getProfile = (profileUrl) =>
    fetch(profileUrl)
      .then((res) => res.json())
      .then(
        (result) => setModifications(result.profile.modify),
        () => null
      );

  const profileUrl = fixProfileUrl(sourceUrl, parentUrl);
  getProfile(profileUrl);
}
